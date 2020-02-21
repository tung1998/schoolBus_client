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
            return Assets.getText('icon.json')
        },
        'modules.init': initModules,
        // async 'modules.get'(accessToken) {
        //     return await getModules(accessToken);
        // }
    });
}

function getModules(accessToken = '') {
    let url = AUTH_MODULE;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function createModule(module, accessToken = '') {
    let url = AUTH_MODULE;
    let body = module;
    return httpDefault(METHOD.post, url, {
        body,
        token: accessToken
    }).then(result => {
        updateTask('Module', result._id)
        return result
    })
}

function updateModule(module, accessToken = '') {
    let url = `${AUTH_MODULE}/${module._id}`;
    let body = module;
    return httpDefault(METHOD.put, url, {
        body,
        token: accessToken
    }).then(result => {
        updateTask('Module', module._id)
        return result
    })
}

function deleteModule(data, accessToken = '') {
    let url = `${AUTH_MODULE}/${data._id}`;
    return httpDefault(METHOD.del, url, {
        token: accessToken
    }).then(result => {
        updateTask('Module', data._id)
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