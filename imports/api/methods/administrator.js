import {
    Meteor
} from 'meteor/meteor';

import {
    BASE,
    AUTH_PATH
} from '../config'

import {
    METHOD,
    httpDefault
} from '../checkAPI';

const BASE_ADMIN = `${BASE}/Admin`
const AUTH_ADMIN = `${AUTH_PATH}/Admin`

if (Meteor.isServer) {
    Meteor.methods({
        'admin.create': createAdmin,
        'admin.getAll': getAllAdmin,
        'admin.getByPage': getAdminByPage,
        'admin.getByID': getAdminByID,
        'admin.update': updateAdmin,
        'admin.delete': deleteAdmin,
    });
}

function createAdmin(data, accessToken = '') {
    let url = `${AUTH_URL}`;
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken,
    })
}

function getAllAdmin(accessToken = '') {
    let url = `${AUTH_URL}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function getAdminByPage(data, accessToken = '') {
    let url = `${AUTH_ADMIN}/${data.page}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function getAdminByID(data, accessToken = '') {
    let url = `${AUTH_ADMIN}/${data._id}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function updateAdmin(data, accessToken = '') {
    let url = `${AUTH_ADMIN}/${data._id}`;
    return httpDefault(METHOD.put, url, {
        body: data,
        token: accessToken,
    })
}

function deleteAdmin(data, accessToken = '') {
    let url = `${AUTH_ADMIN}/${data._id}`;
    return httpDefault(METHOD.del, url, {
        token: accessToken,
    })
}