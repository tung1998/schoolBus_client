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
        'studentList.getByPage': getStudentListByPage,
        'studentList.create': createStudentList,
        'studentList.update': updateStudentList,
        'studentList.delete': deleteStudentList,
        'studentList.addStudentIDs': addStudentIDs,
        'studentList.removeStudentIDs': removeStudentIDs,
    });
}

function getAllStudentList(data, accessToken = '') {
    let url = `${AUTH_STUDENT_LIST}?`
    if (data && data.options && data.options.length)
        data.options.forEach(item => {
            if (item.value) url += `${encodeURIComponent(item.text)}=${encodeURIComponent(item.value)}&`
        })
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getStudentListByID(data, accessToken = '') {
    let url = `${AUTH_STUDENT_LIST}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getStudentListByPage(data, accessToken = '') {
    let url = `${AUTH_STUDENT_LIST}/${data.page}?limit=${data.limit}`
    if (data.options && data.options.length)
    data.options.forEach(item => {
        if (item.value) url += `&${encodeURIComponent(item.text)}=${encodeURIComponent(item.value)}`
    })
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
        body: data,
        token: accessToken
    });
}

function deleteStudentList(data, accessToken = '') {
    let url = `${AUTH_STUDENT_LIST}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}

function addStudentIDs(data, accessToken = '') {
    let url = `${AUTH_STUDENT_LIST}/${data._id}/studentIDs/add`
    return httpDefault(METHOD.put, url, {
        body: data,
        token: accessToken
    });
}

function removeStudentIDs(data, accessToken = '') {
    let url = `${AUTH_STUDENT_LIST}/${data._id}/studentIDs/remove`
    return httpDefault(METHOD.put, url, {
        body: data,
        token: accessToken
    });
}