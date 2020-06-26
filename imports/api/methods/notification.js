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

export function sendFCMToAndroid(userID = '') {
    Push.send({
        from: 'test',
        title: 'test',
         text: 'hello',
            android_channel_id:userID,		//The android channel should match the id on the client
            query: {
                userId: userID
            }, 
            gcm: {
              style: 'inbox',
              summaryText: 'There are %n% notifications'
            },          
  });  
}

export function sendFCMToMultiUser(data = null) {
    if(data&&data.userIDs)
    data.userIds.forEach(item=>{
        Push.send({
            from: 'SchoolBus',
            title: data.title||"Thông báo",
            text: data.text||"Thông báo",
            url:data.url||"",
                android_channel_id:userID,		//The android channel should match the id on the client
                query: {
                    userId: item
                }, 
                gcm: {
                  style: 'inbox',
                  summaryText: 'There are %n% notifications'
                },          
      });
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