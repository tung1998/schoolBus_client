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
        'modules.getByID': getModulesByID,
        'modules.getByPage': getModulesByPage,
        'modules.create': createModule,
        'modules.update': updateModule,
        'modules.delete': deleteModule,
        'modules.getIcons': function () {
			return Assets.getText('icon.json')
		},
    });
}

function getModules(data, accessToken = '') {
    let url = AUTH_MODULE;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function getModulesByID(data, accessToken = '') {
    let url = `${AUTH_MODULE}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function getModulesByPage(data, accessToken = '') {
    let url = `${AUTH_MODULE}/${data.page}?limit=${data.limit}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
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