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
        'modules.getIcons': function() {
            return Assets.getText('icon.json');
        },
        'modules.init': initModules,
        // async 'modules.get'(accessToken) {
        //     return await getModules(accessToken);
        // }
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
    }).then(result => {
        return result
    })
}

function updateModule(data, accessToken = '') {
    let url = `${AUTH_MODULE}/${data._id}`;
    return httpDefault(METHOD.put, url, {
        body: data,
        token: accessToken
    }).then(result => {
        return result
    })
}

function deleteModule(data, accessToken = '') {
    let url = `${AUTH_MODULE}/${data._id}`;
    return httpDefault(METHOD.del, url, {
        token: accessToken
    }).then(result => {

        return result
    })
}

function initModules(accessToken) {
    return new Promise((resolve, reject) => {
        HTTP.call('GET', `${AUTH_MODULE}/init`, {
            headers: {
                "Authorization": accessToken,
                "Cache-Control": "no-cache"
            }
        }, (error, result) => {
            if (error) {
                // console.log(error.reason)
                reject(error)
            } else {
                resolve(result.data);
            }
        });
    });
}