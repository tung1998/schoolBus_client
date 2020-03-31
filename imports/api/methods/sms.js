import { Meteor } from 'meteor/meteor';

import { AUTH_PATH } from '../config'
import { httpDefault, METHOD } from '../checkAPI';

const BASE_API = `${AUTH_PATH}/sms`

if (Meteor.isServer) {
	Meteor.methods({
        'sms.getSMS': getSMS,
        'sms.getSMSByID': getSMSByID,
        'sms.getSMSByPage': getSMSByPage,
        'sms.createSMS': createSMS,
        'sms.updateSMS': updateSMS,
        'sms.deleteSMS': deleteSMS
    });
}
/**
 * Ham gui sms theo tin nhan brandname  
 * @param {Object} data is customerTrip data.
 * @param {string} accessToken token validate
 */

function getSMS(data, accessToken = '') {
    let url = `${AUTH_School}/`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

function getSMSByID(data, accessToken = '') {
    let url = `${AUTH_PATH}/${data._id}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getSMSByPage(data, accessToken = '') {
    let url = `${AUTH_PATH}/${data.PageID}`;
    if (data.options && data.options.length)
        data.options.forEach(item => {
            if (item.value) url += `&${encodeURIComponent(item.text)}=${encodeURIComponent(item.value)}`
        })
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createSMS(data, accessToken = '') {
    let url = `${AUTH_PATH}`;
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    });
}

function updateSMS(data, accessToken = '') {
    let url = `${AUTH_PATH}/${data._id}`;
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    });
}

function deleteSMS(data, accessToken = '') {
    let url = `${AUTH_PATH}/${data._id}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}