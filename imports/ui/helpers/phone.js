// import collection
import { col_phone } from '/imports/api/methods/phone.js';
import {Meteor} from "meteor/meteor";

import { PHONE } from "../components/variableConst";

export{
    seenMissed, receivedPhone, endPhone, searchPhoneByPage, getPhoneByStatus
}

function seenMissed(id) {
    return new Promise((resolve, reject) => {
        Meteor.call('phone.seenMissed', id, (err, result) => {
            resolve(result);
        });
    });
}

function receivedPhone(id) {
    return new Promise((resolve, reject) => {
        Meteor.call('phone.received', id, (err, result) => {
            resolve(result);
        });
    });
}

function endPhone(id) {
    return new Promise((resolve, reject) => {
        Meteor.call('phone.end', id, (err, result) => {
            resolve(result);
        });
    });
}

function searchPhoneByPage(options, page, limit, accessToken) {
    return new Promise((resolve, reject) => {
        Meteor.call('phone.searchPhoneByPage', options, page, limit, accessToken, (err, result) => {
            resolve(result);
        });
    });
}

function getPhoneByStatus(q,o = {}) {
    let options = {sort: {callTime: -1}};
    if(o.limit) options.limit = o.limit;
    if(o.sort) options.sort = o.sort;
    let cursor = col_phone.find(q, options);
    return cursor;
}