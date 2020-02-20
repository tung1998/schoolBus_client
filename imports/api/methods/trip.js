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

const BASE_TRIP = `${BASE}/Trip`
const AUTH_TRIP = `${AUTH_PATH}/Trip`

if (Meteor.isServer) {
    Meteor.methods({
        'trip.getAll': getAllTrip,
        'trip.getByID': getTripByID,
        'trip.create': createTrip,
        'trip.update': updateTrip,
        'trip.delete': deleteTrip,
    });
}

function getAllTrip(accessToken = '') {
    let url = `${AUTH_TRIP}`
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    });
}

function getTripByID(data, accessToken = '') {
    let url = `${AUTH_TRIP}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createTrip(data, accessToken = '') {
    let url = `${AUTH_TRIP}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}

function updateTrip(data, accessToken = '') {
    let url = `${AUTH_TRIP}/${data._id}`
    return httpDefault(METHOD.put, url, {
        token: accessToken
    });
}

function deleteTrip(data, accessToken = '') {
    let url = `${AUTH_TRIP}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}