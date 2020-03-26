import {
    Meteor
} from 'meteor/meteor';

import {
    Mongo
} from 'meteor/mongo';

export const COLLECTION_Messages = new Mongo.Collection('Messages', {
    idGeneration: 'MONGO'
});

if (Meteor.isServer) {
    Meteor.methods({
        'message.create': createMessage,
        'message.update': updateMessage,
        'message.delete': deleteMessage,
    });
    // public cho client subscribe
    Meteor.publish({
        'message.publish.byRoomID': (roomID) => {
            return COLLECTION_Messages.find({
                isDeleted: false,
                roomID
            }, { sort: { time: -1 } })
        },
        'message.publish.status': (status = 0) => {
            return COLLECTION_Messages.find({
                isDeleted: false,
            }, { sort: { time: -1 } })
        },
        'message.publish.findCustomer': () => {
            return COLLECTION_Messages.find({
                isDeleted: false,
                // status: 0,
            }, {
                fields: {
                    roomID: 1,
                    text: 1
                },
                sort: { time: -1 }
            })
        }
    })
    COLLECTION_Messages.allow({
        update(status, sendBy) {
            return true;
        }
    })
}

function createMessage(data) {
    data.createdTime = Date.now()
    data.updatedTime = Date.now()
    data.isDeleted = false
    return new Promise((resolve, reject) => {
        COLLECTION_Messages.insert(data, (err, result) => {
            if (err) reject(err);
            else resolve(result)
        });
    });
}

function deleteMessage(data) {

}


function updateMessage(sendBy) {
    return new Promise((resolve, reject) => {
        COLLECTION_Messages.update({ status: 0, sendBy: sendBy }, { $set: { status: 1 } }, { multi: true });
    })
}