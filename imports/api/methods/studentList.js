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

const BASE_STUDENT_LIST = `${BASE}/StudentList`
const AUTH_STUDENT_LIST = `${AUTH_PATH}/StudentList`

if (Meteor.isServer) {
    Meteor.methods({
        'studentList.getAll': getAllStudentList,
        'studentList.getByID': getStudentListByID,
        'studentList.create': createStudentList,
        'studentList.update': updateStudentList,
        'studentList.delete': deleteStudentList,
    });
}

function getAllStudentList(data, accessToken = '') {
    let url = `${AUTH_STUDENT_LIST}`
    return httpDefault(METHOD.get, url, { token: accessToken });
}

function getStudentListByID(data, accessToken = '') {
    let url = `${AUTH_STUDENT_LIST}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createStudentList(data, accessToken = '') {
    let url = `${AUTH_STUDENT_LIST}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}

function updateStudentList(data, accessToken = '') {
    let url = `${AUTH_STUDENT_LIST}/${data._id}`
    return httpDefault(METHOD.put, url, {
        token: accessToken
    });
}

function deleteStudentList(data, accessToken = '') {
    let url = `${AUTH_STUDENT_LIST}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}