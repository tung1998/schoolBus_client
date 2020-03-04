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
        'student.getByPage': getStudentByPage,
        'student.getByID': getStudentByID,
        'student.getByClass': getStudentByClass,
        'student.create': createStudent,
        'student.update': updateStudent,
        'student.delete': deleteStudent,
    });
}

function getAllStudent(data, accessToken = '') {
    let url = `${AUTH_STUDENT}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getStudentByPage(data, accessToken = '') {
    let url = `${AUTH_STUDENT}/${data.page}?limit=${data.limit}`
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

function getStudentByClass(data, accessToken = '') {
    let url = `${AUTH_STUDENT}/byClass?`
    if (data.classID) url += `classID=${data.classID}`
    if (data.extra) url += `extra=${data.extra}`
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