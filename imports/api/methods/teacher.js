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

const BASE_TEACHER = `${BASE}/Teacher`
const AUTH_TEACHER = `${AUTH_PATH}/Teacher`

if (Meteor.isServer) {
    Meteor.methods({
        'car.getAll': getAllTeacher,
        'car.getByID': getTeacherByID,
        'car.create': createTeacher,
        'car.update': updateTeacher,
        'car.delete': deleteTeacher,
    });
}

function getAllTeacher(accessToken = '') {
    let url = `${AUTH_TEACHER}`
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    });
}

function getTeacherByID(data, accessToken = '') {
    let url = `${AUTH_TEACHER}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createTeacher(data, accessToken = '') {
    let url = `${AUTH_TEACHER}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}

function updateTeacher(data, accessToken = '') {
    let url = `${AUTH_TEACHER}/${data._id}`
    return httpDefault(METHOD.put, url, {
        token: accessToken
    });
}

function deleteTeacher(data, accessToken = '') {
    let url = `${AUTH_TEACHER}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}