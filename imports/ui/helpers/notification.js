import { Meteor } from "meteor/meteor"

export{
    getNotifications,
    readNotification,
    sendNotificationToAndroid,
    sendNotificationToUser,
    createNotification,
    sendNotificationToMultiUser,
}

function getNotifications(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('notification.getAll', accessToken, (err, result) => {
            if(result && result.error){
                reject(result)
            } else resolve(result);
        });
    });
}

function readNotification(notificationID, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('notification.read', notificationID, accessToken, (err, result) => {
            resolve(result);
        });
    });
}

function sendNotificationToAndroid({title, text, image, payload}, userID = '') {
    Meteor.call('notification.sendFCMToAndroid', {title, text, image, payload}, userID, (err, result) => {
        console.log(err, result);
    });
}

function sendNotificationToUser(userID, { text, title}, data = null) {
    return new Promise((resolve, reject) => {
        Meteor.call('notification.sendFCMToUser', userID, { text, title}, data , (err, result) => {
            if(err)
                reject(err);
            else if(result && result.error)
                reject(result);
            else resolve(result);
        });
    })
}

function createNotification(object, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('notification.create', object, accessToken, (err, result) => {
            if(result && result.error) reject(result)
            else if(err) reject(err);
            else resolve(result);
        });
    });
}

/**
 * 
 *result
 * {
    "multicast_id": 6411088656839245807,
    "success": 1, // Số tin gửi thành công
    "failure": 1, // Số tin gửi thất bại
    "canonical_ids": 0,
    "results": [
        {
            "error": "InvalidApnsCredential"
        },
        {
            "message_id": "0:1573547166727804%79e88feb79e88feb"
        }
    ]
 *}
 * @param {*} userIDs 
 * @param {*} param1 
 * @param {*} data 
 */
function sendNotificationToMultiUser(userIDs, { text, title}, data = null) {
    return new Promise((resolve, reject) => {
        Meteor.call('notification.sendFCMToMultiUser', userIDs, { text, title}, data , (err, result) => {
            if(err)
                reject(err);
            else if(result && result.error)
                reject(result);
            else resolve(result);
        });
    })
}