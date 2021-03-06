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

const BASE_CAR = `${BASE}/Car`
const AUTH_CAR = `${AUTH_PATH}/Car`

if (Meteor.isServer) {
    Meteor.methods({
        'car.getAll': getAllCar,
        'car.getByID': getCarByID,
        'car.getByPage': getCarByPage,
        'car.create': createCar,
        'car.update': updateCar,
        'car.delete': deleteCar,
    });
}

function getAllCar(data, accessToken = '') {
    let url = `${AUTH_CAR}?`
    if (data && data.options && data.options.length)
        data.options.forEach(item => {
            if (item.value != '') url += `${encodeURIComponent(item.text)}=${encodeURIComponent(item.value)}&`
        })
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getCarByID(data, accessToken = '') {
    let url = `${AUTH_CAR}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getCarByPage(data, accessToken = '') {
    let url = `${AUTH_CAR}/${data.page}?limit=${data.limit}`
    if (data.options && data.options.length)
        data.options.forEach(item => {
            if (item.value) url += `&${encodeURIComponent(item.text)}=${encodeURIComponent(item.value)}`
        })
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createCar(data, accessToken = '') {
    let url = `${AUTH_CAR}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}

function updateCar(data, accessToken = '') {
    let url = `${AUTH_CAR}/${data._id}`
    return httpDefault(METHOD.put, url, {
        body: data,
        token: accessToken
    });
}

function deleteCar(data, accessToken = '') {
    let url = `${AUTH_CAR}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}