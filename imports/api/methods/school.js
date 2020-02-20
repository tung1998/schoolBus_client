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

const BASE_SCHOOL = `${BASE}/School`
const AUTH_SCHOOL = `${AUTH_PATH}/School`

if (Meteor.isServer) {
    Meteor.methods({
        'school.getAll': getAllSchool,
        'school.getByID': getSchoolByID,
        'school.create': createSchool,
        'school.update': updateSchool,
        'school.delete': deleteSchool,
    });
}

function getAllSchool(accessToken = '') {
    let url = `${AUTH_SCHOOL}`
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    });
}

function getSchoolByID(data, accessToken = '') {
    let url = `${AUTH_SCHOOL}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createSchool(data, accessToken = '') {
    let url = `${AUTH_SCHOOL}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}

function updateSchool(data, accessToken = '') {
    let url = `${AUTH_SCHOOL}/${data._id}`
    return httpDefault(METHOD.put, url, {
        token: accessToken
    });
}

function deleteSchool(data, accessToken = '') {
    let url = `${AUTH_SCHOOL}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}