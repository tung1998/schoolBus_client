import {
    Meteor
} from 'meteor/meteor';


import {
    AUTH_PATH,
    FCM_
} from '../config'
import {
    httpDefault,
    METHOD
} from '../checkAPI';

import {
    NOTI_DEFAULT
} from '../../variableConst'

const BASE_API = `${AUTH_PATH}/Notification`
let msgID = 0;

if (Meteor.isServer) {
    Meteor.methods({
        'notification.getAll': getNotifications,
        'notification.getFilter': getNotificationsFilter,
        'notification.read': readNotifications,
        'notification.create': createNotification,
        'notification.sendFCMToAndroid': sendFCMToAndroid,
        'notification.sendFCMToUser': sendFCMToUser,
        'notification.sendFCMToMultiUser': sendFCMToMultiUser,
    });
}

function getNotifications(accessToken) {
    let url = `${BASE_API}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function getNotificationsFilter(options, page, limit, accessToken = '') {
    let {sortBy, sortType} = options;
    if(!sortBy) sortBy = 'createdTime';
    if(!sortType) sortType = '-1';
    let url = `${BASE_API}/filter?page=${page}&limit=${limit}&sortBy=${sortBy}&sortType=${sortType}`;
    // console.log(url)
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function readNotifications(notificationID, accessToken) {
    let url = `${BASE_API}/${notificationID}/status`
    return httpDefault(METHOD.put,url, {
        body:{
            status: 1
        },
        token: accessToken
    })
}

export function sendFCMToAndroid({
    title,
    text,
    image = '',
    payload
}, userID = '') {
    let query = {}
    if (userID) {
        query.userId = userID;
    }

    Push.send({
        title,
        text,
        from: 'test',
        badge: 2, //optional, use it to set badge count of the receiver when the app is in background.
        query,
        // gcm: {
        //     // image: `www/application/app/img/icon-app/app-icon-96x96.png`,
        // },
        notId: msgID++,
        // payload,
    });
}

export function sendFCMToUser(userId, {
    title,
    text
} = NOTI_DEFAULT.customerTrip.new, data = null) {
    // body...
    return new Promise((resolve, reject) => {
        try {
            let p = [];
            
            Push.appCollection.find({
                userId
            }).forEach((item) => {
                let notification = {
                    title,
                    text,
                    sound: "sound"
                };
                if (item && item.token && item.token.gcm) {

                    p.push(sendByAPI(item.token.gcm, notification, data));
                }
            });
            p = Promise.all(p);
            p = p.then(results => {
                console.log(results)
                console.log('send: ', userId);
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