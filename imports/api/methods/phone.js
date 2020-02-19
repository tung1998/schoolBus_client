import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


import { BASE } from '../config'
import { httpDefault, METHOD } from '../checkAPI'

import { PHONE } from '../../ui/components/variableConst'

const BASE_PHONE = `${BASE}/Phone`
const operatorPhoneNumber = "02273676767"

// them export de cho client su dung
export const col_phone = new Mongo.Collection('Phone', { idGeneration: 'MONGO' });

if (Meteor.isServer) {
    Meteor.methods({
        'phone.getIncoming': getPhoneIncoming,
        'phone.received': receivedPhone,
        'phone.end': endPhone,
        'phone.getMissed': getMissedPhone,
        'phone.seenMissed': seenMissed,
        'phone.searchPhoneByPage': getPhoneFilterByPage,
        // 'phone.getIncoming.meteor': getPhoneIncomingMeteor,
        'phone.seenMissed.meteor': seenMissed_meteor,
    });
    Meteor.publish('phone.getIncoming.meteor', () => {
        return col_phone.find({ status: PHONE.status.coming.number, callTime: { $gt: Date.now() - 1000*2*60 } }, { sort: { callTime: -1 } });
    });
    Meteor.publish('phone.getMissed.meteor', () => {
        return col_phone.find({ status: PHONE.status.missed.number, }, { limit: 1, sort: { callTime: -1 } });
    });

    Meteor.publish('phone.getReceived.meteor', () => {
        return col_phone.find({ status: PHONE.status.received.number, }, { limit: 3, sort: { callTime: -1 } });
    });
}

function getPhoneIncoming(phone = operatorPhoneNumber) {
    let url = `${BASE_PHONE}/incoming?operatorPhoneNumber=${phone}`;
    return httpDefault(METHOD.get, url, { token: '' });
}

// function getPhoneIncomingMeteor(phone = operatorPhoneNumber) {
//     let query = { status: PHONE.status.coming }
//     return col_phone.find({ query }).fetch();
// }

function getMissedPhone(phone = operatorPhoneNumber) {
    let url = `${BASE_PHONE}/missed?operatorPhoneNumber=${phone}`;
    return httpDefault(METHOD.get, url, { token: '' });
}

function seenMissed(id) {
    let url = `${BASE_PHONE}/${id}/resolveMissed`;
    return httpDefault(METHOD.put, url, { token: '' });
}

function receivedPhone(id) {
    let url = `${BASE_PHONE}/${id}/received`;
    return httpDefault(METHOD.put, url, { token: '' });
}

function endPhone(id) {
    let url = `${BASE_PHONE}/${id}/end`;
    return httpDefault(METHOD.put, url, { token: '' });
}

function getPhoneFilterByPage(options, page, limit, accessToken) {
    let today = Date.now();
    if (options.operatorPhoneNumber == "all") {
        options.operatorPhoneNumber = '';
    }
    if (options.status == "all") {
        options.status = '';
    }
    if (!options.startTime) options.startTime = today - 86400 * 1000;
    if (!options.endTime) options.endTime = today;

    let url = `${BASE_PHONE}/filter?operatorPhoneNumber=${options.operatorPhoneNumber}&phoneNumber=${options.phoneNumber}&status=${options.status}&start=${options.startTime}&finish=${options.endTime}&page=${page}&limit=${limit}&sortBy=callTime&sortType=-1`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

// 08/03/2019

function getPhoneIncoming_meteor(phone = operatorPhoneNumber) {
    return col_phone.find({
        status: PHONE.status.coming.number,
    });
}

// insert by mongo of meteor
function seenMissed_meteor(id) {
    check(id, String);
    let query = { _id: new Meteor.Collection.ObjectID(id), status: PHONE.status.missed.number };
    let modifier = { $set: { status: PHONE.status.missed_resolved.number } };
    // console.log(query, modifier);
    return col_phone.update(query, modifier);
}
