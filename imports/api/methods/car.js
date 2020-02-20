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
        'car.create': createCar,
<<<<<<< HEAD
<<<<<<< HEAD
        'car.getAll': getCars,
=======
        // 'car.getAll': getCars,
>>>>>>> f47e67d16e006e4790a5cf6643eed5c7b455ad67
        // 'car.getNotAssignDriver': getCarNotAssignDriver,
        // 'car.getByPage': getCarsByPage,
        'car.getByDriver': getCarByDriver,
=======
>>>>>>> d66459822327e10045c71c763685913b03f39eb7
        'car.update': updateCar,
        'car.delete': deleteCar,
    });
}

function getAllCar(accessToken = '') {
    let url = `${AUTH_CAR}`
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    });
}

function getCarByID(data, accessToken = '') {
    let url = `${AUTH_CAR}/${data._id}`
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