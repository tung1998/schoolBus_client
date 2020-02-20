import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { request } from "meteor/froatsnook:request";

import { httpDefault, METHOD, isStatusCodeError, msgError } from '../checkAPI';
import { BASE, AUTH_PATH, } from '../config'

import { USER_TYPE } from '../../ui/components/variableConst'

const BASE_DRIVER = `${BASE}/Driver`
const AUTH_DRIVER = `${AUTH_PATH}/Driver`


if (Meteor.isServer) {
    Meteor.methods({
        'driver.getAll': getDrivers,
        'driver.getByID': getDriverbyId,
        'driver.create': createDriver,
        'driver.update': updateDriver,
        'driver.delete': deleteDriver,
    });
}

//XEM
function getDrivers(accessToken = '') {
    let url = AUTH_DRIVER;
    return httpDefault(METHOD.get, url, { token: accessToken })
}

//XEM THEO ID
function getDriverbyId(data, accessToken = '') {
    let url = `${AUTH_DRIVER}/${data._id}`;
    return httpDefault(METHOD.get, url, { token: accessToken })
}

//THÊM
function createDriver(data, accessToken = '') {
    let url = AUTH_DRIVER;
    return httpDefault(METHOD.post, url, { token: accessToken });
}

//SỬA
function updateDriver(data, accessToken = '') {
    let url = `${AUTH_DRIVER}/${data._id}`;
    return httpDefault(METHOD.put, url, { token: accessToken });
}
//XÓA
function deleteDriver(data, accessToken = '') {
    let url = `${AUTH_DRIVER}/${data._id}`;
    return httpDefault(METHOD.del, url, { token: accessToken });
}