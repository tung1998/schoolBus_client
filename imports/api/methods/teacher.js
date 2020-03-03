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
        'teacher.getAll': getAllTeacher,
        'teacher.getByID': getTeacherByID,
        'teacher.create': createTeacher,
        'teacher.update': updateTeacher,
        'teacher.delete': deleteTeacher,
        'teacher.getBySchool': getBySchoolID
    });
}

function getBySchoolID(data, accessToken = ''){
    let url = `${AUTH_TEACHER}/bySchool?schoolID=${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getAllTeacher(data, accessToken = '') {
    let url = `${AUTH_TEACHER}?extra=${data.extra}`
    return httpDefault(METHOD.get, url, {
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
        body: data,
        token: accessToken
    });
}

function deleteTeacher(data, accessToken = '') {
    let url = `${AUTH_TEACHER}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}