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