import { Meteor } from 'meteor/meteor';

import { BASE, AUTH_PATH } from '../config'
import { httpDefault, METHOD } from '../checkAPI';

const AUTH_LOG = `${AUTH_PATH}/Log`
const AUTH_LOG_CUSTOMERTRIP = `${AUTH_PATH}/customerTrip/log`;
const AUTH_CUSTOMERTRIP = `${AUTH_PATH}/customerTrip`;

const LogBy = {
    customerTrip: 0,
}

if (Meteor.isServer) {
    Meteor.methods({
        'log.get': getLog,
        'log.getByObject': getLogFullByObject,
        'log.customerTrip.getLast': getLogCustomerTripLast,
        'log.customerTrip.getByPage': getLogCustomerTripByPage,
        'log.customerTrip.getByID': getLogCustomerTripByID,
    });
}

function getLog() {
    let url = `${AUTH_LOG}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

function getLogCustomerTripLast(accessToken) {
    let url = `${AUTH_LOG_CUSTOMERTRIP}?sortBy=updatedTime&sortType=-1`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

function getLogCustomerTripByPage(options, page, limit, accessToken) {
    let today = Date.now();
    if (options.phone == "all") {
        options.phone = '?';
    } else options.phone = `/byPhone?phone=${options.phone}&`;
    if (options.type == "all") {
        options.type = '';
    }
    // if(options.status == "all") {
    //     options.status = '';
    // }
    if (!options.startTime) options.startTime = today - 86400 * 1000;
    if (!options.endTime) options.endTime = today;
    let url = `${AUTH_LOG_CUSTOMERTRIP}${options.phone}page=${page}&limit=${limit}&start=${options.startTime}&finish=${options.endTime}&type=${options.type}&customerPhone=${options.customerPhone || ''}&customerName=${options.customerName? encodeURIComponent(options.customerName): ''}&sortBy=updatedTime&sortType=-1`;
    // console.log(url);
    return httpDefault(METHOD.get, url, { token: accessToken });
}

function getLogFullByObject({ objectID, type = LogBy.customerTrip }, accessToken) {
    let url = '',
        path = '';
    if (type == LogBy.customerTrip) {
        path = `${AUTH_CUSTOMERTRIP}`;
    }
    url = `${path}/${objectID}/log`;
    // console.log(url, objectID, type);
    return httpDefault(METHOD.get, url, { token: accessToken });
}

function getLogCustomerTripByID(customerTripID, accessToken) {
    const url = `${AUTH_PATH}/customertrip/${customerTripID}/log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}