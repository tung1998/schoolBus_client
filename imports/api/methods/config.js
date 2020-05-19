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

const BASE_CONFIG = `${BASE}/Config`
const AUTH_CONFIG = `${AUTH_PATH}/Config`

if (Meteor.isServer) {
    Meteor.methods({
        'config.getAll': getAllConfig,
        'config.getByID': getConfigByID,
        'config.create': createConfig,
        'config.update': updateConfig,
        'config.delete': deleteConfig,
    });
}

function getAllConfig(accessToken = '') {
    let url = `${AUTH_CONFIG}`
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    });
}

function getConfigByID(data, accessToken = '') {
    let url = `${AUTH_CONFIG}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createConfig(data, accessToken = '') {
    let url = `${AUTH_CONFIG}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}

function updateConfig(data, accessToken = '') {
    let url = `${AUTH_CONFIG}/${data._id}`
    return httpDefault(METHOD.put, url, {
        body: data,
        token: accessToken
    });
}

function deleteConfig(data, accessToken = '') {
    let url = `${AUTH_CONFIG}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}