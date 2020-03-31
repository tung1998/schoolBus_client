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

const BASE_ADMIN = `${BASE}/Administrator`
const AUTH_ADMIN = `${AUTH_PATH}/Administrator`

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
    let url = `${AUTH_ADMIN}`;
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken,
    })
}

function getAllAdmin(data, accessToken = '') {
    let url = `${AUTH_ADMIN}?extra=${data.extra}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function getAdminByPage(data, accessToken = '') {
    let url = `${AUTH_ADMIN}/${data.page}?limit=${data.limit}`;
    if (data.options && data.options.length){
        data.options.forEach(item => {
            if (item.value != null) url += `&${encodeURIComponent(item.text)}=${encodeURIComponent(item.value)}`
        })
    }
    console.log(url);
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