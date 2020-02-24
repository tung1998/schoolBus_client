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
} from '../../variableConst.js'

const BASE_API = `${AUTH_PATH}/Notification`
let msgID = 0;

if (Meteor.isServer) {
    Meteor.methods({
        'notification.getAll': getNotifications,
        'notification.create': createNotification,
        'notification.update': updateNotification,
        'notification.delete': deleteNotification,
    });
}
//XEM
function getNotifications(accessToken) {
    let url = `${BASE_API}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function createNotification(data, accessToken) {
    let url = `${AUTH_PATH}`;
    let body = data;
    return httpDefault(METHOD.post, url, {
        body,
        token: accessToken
    })
}

function updateNotification(data, accessToken) {
    let url = `${AUTH_PATH}/${data._id}`;
    return httpDefault(METHOD.put, url, { token: accessToken })
}

function deleteNotification(data, accessToken) {
    let url = `${AUTH_PATH}/${data._id}`
    return httpDefault(METHOD.del, url, { token: accessToken });
}