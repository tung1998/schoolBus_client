// Methods related to links

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { request } from "meteor/froatsnook:request";

import { httpDefault, METHOD, isStatusCodeError, msgError } from '../checkAPI';
import { BASE, AUTH_PATH, } from '../config'

import { COLLECTION_USER } from './user'

import { USER_TYPE } from '../../ui/components/variableConst'

const BASE_DRIVER = `${BASE}/Driver`
const AUTH_DRIVER = `${AUTH_PATH}/Driver`

// render data truc tiep tu mongodb
export const COLLECTION_DRIVER = new Mongo.Collection('Driver', { idGeneration: 'MONGO' });

if (Meteor.isServer) {
    Meteor.methods({
        'driver.getAll': getDrivers,
        'driver.getByPage': getDriversByPage,
        'driver.getNotBlock': getDriversNotBlock,
        'driver.getNotAssignCar': getDriversNotAssignCar,
        'driver.create': createDriver,
        'driver.uploadImage': uploadImage,
        'driver.update': updateDriver,
        'driver.delete': deleteDriver,
        'driver.getTripHistory': getDriverTripsHistory,
        'driver.getStatisticBill': getDriverStatisticBill,
        'driver.getAggregateInMonth': getAggregateInMonth,
        'driver.getNoLenhInMonth': getNoLenhInMonth,
        'driver.getTongHopInMonth': getTongHopInMonth,
    });

    // public cho client subscribe
    Meteor.publish('driver.getAll.meteor', () => {
        return COLLECTION_DRIVER.find({ isDeleted: false, });
    });
    // // public cho client subscribe
    Meteor.publish('driver.getNotBlocked.meteor', () => {
        let users = COLLECTION_USER.find({ isDeleted: false, isBlocked: false, userType: USER_TYPE.driver });
        return COLLECTION_DRIVER.find({ isDeleted: false, userID: { $in: users.map(e => e._id._str) } });
    });

    // public cho client subscribe
    Meteor.publish('driver.getByIDs.meteor', (ids) => {
        return COLLECTION_DRIVER.find({
            isDeleted: false,
            _id: {
                $in: ids.map(e => new Meteor.Collection.ObjectID(e))
            }
        });
    });
}

//XEM
function getDrivers(accessToken = '') {
    let url = AUTH_DRIVER;
    return httpDefault(METHOD.get, url, { token: accessToken })
}

// lay danh sach driver khong bi block
function getDriversNotBlock({ page, limit }, accessToken = '', extra = 'user') {
    let url = `${AUTH_DRIVER}/not-block?limit=${limit}&page=${page}&extra=${extra}`;
    return httpDefault(METHOD.get, url, { token: accessToken })
}

// lay danh sach driver chua duoc gan xe
function getDriversNotAssignCar(accessToken = '') {
    let url = `${AUTH_DRIVER}/not-assigned`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}


//XEM LÁI XE THEO TRANG
function getDriversByPage({ page, limit }, accessToken = '') {
    let url = `${AUTH_DRIVER}/${page}?limit=${limit}`;
    let body = null;
    return httpDefault(METHOD.get, url, { body, token: accessToken })
}
//XEM LỊCH SỬ
function getDriverTripsHistory(date, status, accessToken = '') {
    let url = `${AUTH_DRIVER}/me/history?date=${date}&status=${status.join()}`;
    return httpDefault(METHOD.get, url, { token: accessToken })
}

//THÊM

function createDriver(driver, accessToken = '') {
    let url = AUTH_DRIVER;
    return httpDefault(METHOD.post, url, { token: accessToken });
}

//SỬA
function updateDriver(driver, accessToken = '') {
    let url = `${AUTH_DRIVER}/${driver._id}`;
    return httpDefault(METHOD.put, url, { token: accessToken });
}
//XÓA
function deleteDriver(driverID, accessToken = '') {
    let url = `${AUTH_DRIVER}/${driverID}`;
    return httpDefault(METHOD.del, url, { token: accessToken });
}

function uploadImage(form, accessToken = '') {
    return new Promise((resolve, reject) => {
        let formData = {
            image: form
        }
        try {
            let res_login = request.postSync(`${BASE_DRIVER}/5b5fed6356db2247cc1d9b88/image_upload`, {
                form: formData,
                headers: {
                    // "Content-Type": "application/x-www-form-urlencoded",
                    "enctype": "multipart/form-data",
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36'
                }
            });
            // console.log(res_login.response);
            resolve(res_login.response);

        } catch (error) {
            reject({ error });
        }
    });
}

function getDriverStatisticBill(startDate, endDate, accessToken = '') {
    let url = `${AUTH_DRIVER}/statistics-in-date?startDate=${startDate}&endDate=${endDate}`;
    return httpDefault(METHOD.get, url, { token: accessToken })
}

function getAggregateInMonth(year, month, accessToken = '') {
    let url = `${AUTH_DRIVER}/aggregate-in-month?year=${year}&month=${month}`;
    return httpDefault(METHOD.get, url, { token: accessToken })
}

function getNoLenhInMonth(year, month, accessToken = '') {
    let url = `${AUTH_DRIVER}/noLenh?year=${year}&month=${month}`;
    return httpDefault(METHOD.get, url, { token: accessToken })
}


function getTongHopInMonth(year, month, accessToken = '') {
    let url = `${AUTH_DRIVER}/tonghop?year=${year}&month=${month}`;
    return httpDefault(METHOD.get, url, { token: accessToken })
}