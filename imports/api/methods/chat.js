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
        'message.publish.All': function() {
            return COLLECTION_Messages.find({});
        },
        'message.publish.getByRoomID': roomID => {
            return COLLECTION_Messages.find({ roomID: roomID, isDeleted: false });
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
    return COLLECTION_Messages.insert(data, (err, result) => {
        if (err) throw (err);
        else {}
    });
}

function deleteMessage(data) {

}


function updateMessage(roomID, sendBy) {
    return COLLECTION_Messages.update({ status: 0, roomID: roomID, sendBy: sendBy }, { $set: { status: 1 } }, { multi: true });
}