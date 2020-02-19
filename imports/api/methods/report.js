import { Meteor } from 'meteor/meteor';

import { AUTH_PATH } from '../config'
import { httpDefault, METHOD } from '../checkAPI';

const _BASE = `${AUTH_PATH}/Report`

if (Meteor.isServer) {
	Meteor.methods({
		'report.getWeekByCarModel': getReportWeekByCarModel,
        'report.getMonthByCarModel': getReportMonthByCarModel,
        'report.getDatesByCarModel': getReportDatesByCarModel,
    });
}

function getReportWeekByCarModel({time, carModelID},accessToken) {
    let url =  `${_BASE}/week?time=${time}&carModelID=${carModelID}`;
    return httpDefault(METHOD.get, url, {token: accessToken})
}

function getReportMonthByCarModel({time, carModelID},accessToken) {
    let url =  `${_BASE}/month?time=${time}&carModelID=${carModelID}`;
    return httpDefault(METHOD.get, url, {token: accessToken})
}

function getReportDatesByCarModel({startTime, endTime, carModelID},accessToken) {
    let url =  `${_BASE}/dates?startTime=${startTime}&endTime=${endTime}&carModelID=${carModelID}`;
    return httpDefault(METHOD.get, url, {token: accessToken})
}