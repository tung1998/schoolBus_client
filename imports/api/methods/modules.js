import {
    Meteor
} from 'meteor/meteor';
const Cookies = require('js-cookie');

import {
    BASE,
    AUTH_PATH
} from '../config'
import {
    httpDefault,
    METHOD
} from '../checkAPI';
import {
    updateTask
} from './task';

const BASE_MODULE = `${BASE}/Module`
const AUTH_MODULE = `${AUTH_PATH}/Module`

if (Meteor.isServer) {
    Meteor.methods({
        'modules.get': getModules,
        'modules.create': createModule,
        'modules.update': updateModule,
        'modules.delete': deleteModule,
    });
}

function getModules(data, accessToken = '') {
    let url = AUTH_MODULE;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function createModule(data, accessToken = '') {
    let url = AUTH_MODULE;
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    })
}

function updateModule(data, accessToken = '') {
    let url = `${AUTH_MODULE}/${data._id}`;
    return httpDefault(METHOD.put, url, {
        body: data,
        token: accessToken
    })
}

function deleteModule(data, accessToken = '') {
    let url = `${AUTH_MODULE}/${data._id}`;
    return httpDefault(METHOD.del, url, {
        token: accessToken
    })
}