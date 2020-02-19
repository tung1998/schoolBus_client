import { Meteor } from 'meteor/meteor';

import { AUTH_PATH } from '../config'
import { httpDefault, METHOD } from '../checkAPI';

const BASE_API = `${AUTH_PATH}/sms`

if (Meteor.isServer) {
	Meteor.methods({
		'sms.send': sendSMS,
    });
}
/**
 * Ham gui sms theo tin nhan brandname  
 * @param {Object} data is customerTrip data.
 * @param {string} accessToken token validate
 */
function sendSMS(data, accessToken) {
    let url =  `${BASE_API}?`;
    // return httpDefault(METHOD.get, url, { token: accessToken });
    return new Promise((resolve, reject) => {
        resolve('ok')
    });
}