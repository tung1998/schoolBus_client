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

const BASE_CLASS = `${BASE}/Class`
const AUTH_CLASS = `${AUTH_PATH}/Class`

if (Meteor.isServer) {
    Meteor.methods({
        'class.getAll': getAllClass,
        'class.getByID': getClassByID,
        'class.create': createClass,
        'class.update': updateClass,
        'class.delete': deleteClass,
    });
}

function getAllClass(accessToken = '') {
    let url = `${AUTH_CLASS}`
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    });
}

function getClassByID(data, accessToken = '') {
    let url = `${AUTH_CLASS}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createClass(data, accessToken = '') {
    let url = `${AUTH_CLASS}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}

function updateClass(data, accessToken = '') {
    let url = `${AUTH_CLASS}/${data._id}`
    return httpDefault(METHOD.put, url, {
        body: data,
        token: accessToken
    });
}

function deleteClass(data, accessToken = '') {
    let url = `${AUTH_CLASS}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}