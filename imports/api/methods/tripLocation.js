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

const BASE_TRIP_LOCATION = `${BASE}/TripLocation`
const AUTH_TRIP_LOCATION = `${AUTH_PATH}/TripLocation`

if (Meteor.isServer) {
    Meteor.methods({
        'tripLocation.getAll': getAllTripLocation,
        'tripLocation.getByID': getTripLocationByID,
        'tripLocation.create': createTripLocation,
        'tripLocation.update': updateTripLocation,
        'tripLocation.delete': deleteTripLocation,
    });
}

function getAllTripLocation(accessToken = '') {
    let url = `${AUTH_TRIP_LOCATION}`
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    });
}

function getTripLocationByID(data, accessToken = '') {
    let url = `${AUTH_TRIP_LOCATION}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createTripLocation(data, accessToken = '') {
    let url = `${AUTH_TRIP_LOCATION}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}

function updateTripLocation(data, accessToken = '') {
    let url = `${AUTH_TRIP_LOCATION}/${data._id}`
    return httpDefault(METHOD.put, url, {
        token: accessToken
    });
}

function deleteTripLocation(data, accessToken = '') {
    let url = `${AUTH_TRIP_LOCATION}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}