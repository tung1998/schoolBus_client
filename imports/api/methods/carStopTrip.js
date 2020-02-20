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

const BASE_CARSTOPTRIP = `${BASE}/CarStopTrip`
const AUTH_CARSTOPTRIP = `${AUTH_PATH}/CarStopTrip`

if (Meteor.isServer) {
    Meteor.methods({
        'carStopTrip.getAll': getAllCarStopTrip,
        'carStopTrip.getByID': getCarStopTripByID,
        'carStopTrip.create': createCarStopTrip,
        'carStopTrip.update': updateCarStopTrip,
        'carStopTrip.delete': deleteCarStopTrip,
    });
}

function getAllCarStopTrip(accessToken = '') {
    let url = `${AUTH_CARSTOPTRIP}`
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    });
}

function getCarStopTripByID(data, accessToken = '') {
    let url = `${AUTH_CARSTOPTRIP}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createCarStopTrip(data, accessToken = '') {
    let url = `${AUTH_CARSTOPTRIP}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}

function updateCarStopTrip(data, accessToken = '') {
    let url = `${AUTH_CARSTOPTRIP}/${data._id}`
    return httpDefault(METHOD.put, url, {
        body: data,
        token: accessToken
    });
}

function deleteCarStopTrip(data, accessToken = '') {
    let url = `${AUTH_CARSTOPTRIP}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}