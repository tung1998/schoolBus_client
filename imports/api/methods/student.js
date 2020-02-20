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

const BASE_STUDENT = `${BASE}/Student`
const AUTH_STUDENT = `${AUTH_PATH}/Student`

if (Meteor.isServer) {
    Meteor.methods({
        'student.getAll': getAllStudent,
        'student.getByID': getStudentByID,
        'student.create': createStudent,
        'student.update': updateStudent,
        'student.delete': deleteStudent,
    });
}

function getAllStudent(accessToken = '') {
    let url = `${AUTH_STUDENT}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getStudentByID(data, accessToken = '') {
    let url = `${AUTH_STUDENT}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createStudent(data, accessToken = '') {
    let url = `${AUTH_STUDENT}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}

function updateStudent(data, accessToken = '') {
    let url = `${AUTH_STUDENT}/${data._id}`
    return httpDefault(METHOD.put, url, {
        token: accessToken
    });
}

function deleteStudent(data, accessToken = '') {
    let url = `${AUTH_STUDENT}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}