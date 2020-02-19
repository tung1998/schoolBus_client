import {
    Meteor
} from 'meteor/meteor';

import {
    AUTH_PATH
} from '../config'
import {
    isStatusCodeError,
    msgError,
    httpDefault,
    METHOD
} from '../checkAPI';

const BASE_URL = `${AUTH_PATH}/eSMS`;

if (Meteor.isServer) {
    Meteor.methods({
        'eSMS.getByTime': getByTimeESMS,
        'eSMS.sendSMSPOST': sendSMSPOSTESMS,
        'eSMS.getESMSFilter': getESMSFilter,
        'eSMS.getBalance': getBalance,
    });
}

function getByTimeESMS(opts, accessToken) {
    let url = `${BASE_URL}/GetSmsSentData`;
    return httpDefault(METHOD.post, url, {
        token: accessToken,
        body: opts, // {FROM, TO}
    })
}

function sendSMSPOSTESMS(opts, accessToken) {
    let url = `${BASE_URL}/SendMultipleMessage_V4_get`;
    return httpDefault(METHOD.post, url, {
        token: accessToken,
        body: opts,
    })
}

function getESMSFilter(opts, accessToken) {
    let url = `${BASE_URL}/SmsFilter?`;
    if (opts.SMSID) url += `SMSID=${opts.SMSID}&`
    if (opts.FromTime) url += `FromTime=${opts.FromTime}&`
    if (opts.ToTime) url += `ToTime=${opts.ToTime}&`
    if (opts.SmsType) url += `SmsType=${opts.SmsType}&`
    // console.log(url)
    return httpDefault(METHOD.get, url, {
        token: accessToken,
    })
}


function getBalance(accessToken) {
    let url = `${BASE_URL}/GetBalance`;
    // console.log(url)
    return httpDefault(METHOD.get, url, {
        token: accessToken,
    })
}