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
        'user.getByPage': getUserByPage,
        'user.create': createUser,
        'user.update': updateUser,
        'user.delete': deleteUser,
        'user.updatePassword': updatePassword,
        'user.getCurrentInfor': getCurrentUserInfor,
        'user.isSuperadmin': isSuperadmin,
        'user.blockUser': blockUser,
        'user.unblockUser': unblockUser
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

function getUserByPage(data, accessToken = '') {
    let url = `${AUTH_USER}/${data.page}?limit=${data.limit}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getCurrentUserInfor(data, accessToken = '') {
    let url = `${AUTH_USER}/Current`
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
        body: data,
        token: accessToken
    });
}

function deleteUser(data, accessToken = '') {
    let url = `${AUTH_USER}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}

function updatePassword(data, accessToken = '') {
    let url = `${AUTH_USER}/password`
    return httpDefault(METHOD.put, url, {
        body: data,
        token: accessToken
    })
}

function isSuperadmin(data, accessToken = '') {
    let url = `${AUTH_USER}/isSuperadmin`
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    })
}

function blockUser(data, accessToken = '') {
    let url = `${AUTH_USER}/${data._id}/block`
    return httpDefault(METHOD.put, url, {
        body: data,
        token: accessToken
    })
}

function unblockUser(data, accessToken = '') {
    let url = `${AUTH_USER}/${data._id}/unblock`
    return httpDefault(METHOD.put, url, {
        token: accessToken
    })
}