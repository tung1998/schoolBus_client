import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';

import {
    AUTH_PATH,
    FCM_
} from '../config'
import {
    isStatusCodeError,
    msgError,
    httpDefault,
    METHOD
} from '../checkAPI';

import {
    NOTI_DEFAULT
} from '../../ui/components/variableConst.js'

const BASE_API = `${AUTH_PATH}/Notification`
let msgID = 0;

if (Meteor.isServer) {
    Meteor.methods({
        'notification.getAll': getNotifications,
        'notification.read': readNotifications,
        'notification.create': createNotification,
        'notification.sendFCMToAndroid': sendFCMToAndroid,
        'notification.sendFCMToUser': sendFCMToUser,
        'notification.sendFCMToMultiUser': sendFCMToMultiUser,
    });
}
//XEM
function getNotifications(accessToken) {
    let url = `${BASE_API}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}
//ĐỌC 
function readNotifications(notificationID, accessToken) {
    let url = `${BASE_API}/${notificationID}/status`;
    return httpDefault(METHOD.put, url, {
        token: accessToken
    })
}

function sendFCMToAndroid({
    title,
    text,
    image = '',
    payload,
    gcm,
    apn,
    id,
}, userID = '') {
    let query = {}
    if (userID) {
        query.userId = userID;
    }
    if (id) query.id = id;
    let options = {
        title,
        text,
        from: 'main',
        badge: 2, //optional, use it to set badge count of the receiver when the app is in background.
        query,
        // gcm: {
        //     // image: `www/application/app/img/icon-app/app-icon-96x96.png`,
        // },
        notId: msgID++,
        // payload,
    }
    if (gcm) options.token = { gcm: gcm };
    if (apn) options.token = { apn: apn };
    console.log(options);

    Push.send(options);
}

export function sendFCMToUser(userID, {
    title,
    text
} = NOTI_DEFAULT.customerTrip.new, data = null) {
    // body...
    return new Promise((resolve, reject) => {
        try {
            let p = [];
            Push.appCollection.find({
                userId: userID
            }).forEach((item) => {
                // console.log(item.token);
                let notification = {
                    title,
                    text,
                    sound: "default"
                };
                if (item && item.token && (item.token.gcm || item.token.apn)) {
                    p.push(sendByAPI(item.token.gcm || item.token.apn, notification, data));
                }
            });
            p = Promise.all(p);
            p = p.then(results => {
                console.log('send: ', userID);
                if (results && results.length > 0)
                    resolve({
                        error: false,
                        message: 'ok'
                    })
                else resolve({
                    error: true,
                    message: 'Khong co app'
                })
            }).catch(e => {
                console.log(e);
                resolve({
                    error: true,
                    message: 'Co loi xay ra'
                })
            });
        } catch (error) {
            resolve(error);
        }
    });
}

function sendFCMToMultiUser(userIDs, {
    title,
    text
} = NOTI_DEFAULT.customerTrip.new, data = null) {
    // body...
    let tokens = [];
    let notification = {
        title,
        text,
        sound: "default"
    };
    Push.appCollection.find({
        userId: {
            $in: userIDs
        }
    }).forEach((item) => {
        if (item && item.token && (item.token.gcm || item.token.apn)) {
            tokens.push(item.token.gcm || item.token.apn);
        }
    });
    return sendByAPIToMultiDevice(tokens, notification);
}

function sendByAPI(appToken = null, notification, data = null) {
    let url = `https://fcm.googleapis.com/fcm/send`;
    let body = {
        notification,
        to: appToken,
    }
    if (data) body.data = data;
    return httpDefault(METHOD.post, url, {
        body,
        token: `key=${FCM_.server_key}`
    })
}


function sendByAPIToMultiDevice(tokens, notification, data = null) {
    let url = `https://fcm.googleapis.com/fcm/send`;
    let body = {
        notification,
        registration_ids: tokens,
    }
    if (data) body.data = data;
    return httpDefault(METHOD.post, url, {
        body,
        token: `key=${FCM_.server_key}`
    })
}

function createNotification({
    type,
    userID,
    createdBy,
    title,
    content,
    link
}, accessToken) {
    let url = `${AUTH_PATH}`;
    let body = {
        type,
        userID,
        createdBy,
        title,
        content,
        link
    };
    return httpDefault(METHOD.post, url, {
        body,
        token: accessToken
    })
}