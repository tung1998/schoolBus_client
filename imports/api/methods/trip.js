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
        'trip.attendance': attendanceTrip,
        'trip.image': imageTrip,
        'trip.getByTime': getTripByTime,
        'trip.getNext': getNextTrip,
        'trip.getLogByTripID': getTripLogByTripID
    });
}

function getAllTrip(data, accessToken = '') {
    let url = `${AUTH_TRIP}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getTripByID(data, accessToken = '') {
    let url = `${AUTH_TRIP}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getTripByTime(data, accessToken = '') {
    let url = `${AUTH_TRIP}/byTime?`;
    if (data.startTime) url += `startTime=${data.startTime}`
    if (data.endTime) url += `&endTime=${data.endTime}`
    if (data.extra) url += `extra=${data.extra}`
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
        body: data,
        token: accessToken
    });
}

function deleteTrip(data, accessToken = '') {
    let url = `${AUTH_TRIP}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}

function attendanceTrip(data, accessToken = '') {
    let url = `${AUTH_TRIP}/${data.tripID}/student/${data.studentID}/status`
    return httpDefault(METHOD.put, url, {
        body: {
            status: data.status
        },
        token: accessToken
    })
}

function imageTrip(data, accessToken = '') {
    let url = `${AUTH_TRIP}/${data.tripID}/student/${data.studentID}/image`
    return httpDefault(METHOD.put, url, {
        body: {
            image: data.image
        },
        token: accessToken
    })
}

function getNextTrip(data, accessToken = '') {
    let url = `${AUTH_TRIP}/next`
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    })
}

function getTripLogByTripID(data, accessToken = '') {
    let url = `${AUTH_TRIP}/${data.tripID}/log`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}