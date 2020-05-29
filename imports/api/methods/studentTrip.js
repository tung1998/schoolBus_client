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

const BASE_STUDENT_TRIP = `${BASE}/StudentTrip`
const AUTH_STUDENT_TRIP = `${AUTH_PATH}/StudentTrip`

if (Meteor.isServer) {
    Meteor.methods({
        'studentTrip.getAll': getAllStudentTrip,
        'studentTrip.getByID': getStudentTripByID,
        'studentTrip.create': createStudentTrip,
        'studentTrip.update': updateStudentTrip,
        'studentTrip.delete': deleteStudentTrip,
    });
}

function getAllStudentTrip(accessToken = '') {
    let url = `${AUTH_STUDENT_TRIP}`
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    });
}

function getStudentTripByID(data, accessToken = '') {
    let url = `${AUTH_STUDENT_TRIP}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createStudentTrip(data, accessToken = '') {
    let url = `${AUTH_STUDENT_TRIP}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}

function updateStudentTrip(data, accessToken = '') {
    let url = `${AUTH_STUDENT_TRIP}/${data._id}`
    return httpDefault(METHOD.put, url, {
        token: accessToken
    });
}

function deleteStudentTrip(data, accessToken = '') {
    let url = `${AUTH_STUDENT_TRIP}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}