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

const BASE_USER = `${BASE}/User`
const AUTH_USER = `${AUTH_PATH}/User`

if (Meteor.isServer) {
    Meteor.methods({
        'user.getAll': getAllUser,
        'user.getByID': getUserByID,
        'user.create': createUser,
        'user.update': updateUser,
        'user.delete': deleteUser,
    });
}

function getAllUser(accessToken = '') {
    let url = `${AUTH_USER}`
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    });
}

function getUserByID(data, accessToken = '') {
    let url = `${AUTH_USER}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createUser(data, accessToken = '') {
    let url = `${AUTH_USER}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}

function updateUser(data, accessToken = '') {
    let url = `${AUTH_USER}/${data._id}`
    return httpDefault(METHOD.put, url, {
        token: accessToken
    });
}

function deleteUser(data, accessToken = '') {
    let url = `${AUTH_USER}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}