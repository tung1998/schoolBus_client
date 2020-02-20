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

const BASE_CAR = `${BASE}/Token`
const AUTH_CAR = `${AUTH_PATH}/Token`

if (Meteor.isServer) {
    Meteor.methods({
        'token.getAll': getAllToken,
        'token.getByID': getTokenByID,
        'token.create': createToken,
        'token.update': updateToken,
        'token.delete': deleteToken,
    });
}

function getAllToken(accessToken = '') {
    let url = `${AUTH_CAR}`
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    });
}

function getTokenByID(data, accessToken = '') {
    let url = `${AUTH_CAR}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createToken(data, accessToken = '') {
    let url = `${AUTH_CAR}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}

function updateToken(data, accessToken = '') {
    let url = `${AUTH_CAR}/${data._id}`
    return httpDefault(METHOD.put, url, {
        token: accessToken
    });
}

function deleteToken(data, accessToken = '') {
    let url = `${AUTH_CAR}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}