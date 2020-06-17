import {
    Meteor
} from 'meteor/meteor';

import {
    BASE,
    AUTH_PATH,
} from '../config'
import {
    METHOD,
    httpDefault
} from '../checkAPI'

const BASE_CARSTOP = `${BASE}/CarStop`
const AUTH_CARSTOP = `${AUTH_PATH}/CarStop`

if (Meteor.isServer) {
    Meteor.methods({
        'carStop.getAll': getAllCarStop,
        'carStop.getByID': getCarStopByID,
        'carStop.getByPage': getCarStopByPage,
        'carStop.create': createCarStop,
        'carStop.update': updateCarStop,
        'carStop.delete': deleteCarStop,
    });
}

function getAllCarStop(data, accessToken = '') {
    let url = `${AUTH_CARSTOP}?`
    if (data && data.options && data.options.length)
        data.options.forEach(item => {
            if (item.value != '') url += `${encodeURIComponent(item.text)}=${encodeURIComponent(item.value)}&`
        })
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getCarStopByID(data, accessToken = '') {
    let url = `${AUTH_CARSTOP}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getCarStopByPage(data, accessToken = '') {
    let url = `${AUTH_CARSTOP}/${data.page}?limit=${data.limit}`
    if (data.options && data.options.length)
        data.options.forEach(item => {
            if (item.value) url += `&${encodeURIComponent(item.text)}=${encodeURIComponent(item.value)}`
        })
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createCarStop(data, accessToken = '') {
    let url = `${AUTH_CARSTOP}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}

function updateCarStop(data, accessToken = '') {
    let url = `${AUTH_CARSTOP}/${data._id}`
    return httpDefault(METHOD.put, url, {
        body: data,
        token: accessToken
    });
}

function deleteCarStop(data, accessToken = '') {
    let url = `${AUTH_CARSTOP}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}