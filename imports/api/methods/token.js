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

const BASE_TOKEN = `${BASE}/Token`
const AUTH_TOKEN = `${AUTH_PATH}/Token`

if (Meteor.isServer) {
    Meteor.methods({
        'token.getAll': getAllToken,
        'token.getByID': getTokenByID,
        'token.create': createToken,
        'token.update': updateToken,
        'token.delete': deleteToken,
        'token.loginByUsername': loginByUsername,
    });
}

function getAllToken(accessToken = '') {
    let url = `${AUTH_TOKEN}`
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    });
}

function getTokenByID(data, accessToken = '') {
    let url = `${AUTH_TOKEN}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createToken(data, accessToken = '') {
    let url = `${AUTH_TOKEN}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}

function updateToken(data, accessToken = '') {
    let url = `${AUTH_TOKEN}/${data._id}`
    return httpDefault(METHOD.put, url, {
        token: accessToken
    });
}

function deleteToken(data, accessToken = '') {
    let url = `${AUTH_TOKEN}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}

function loginByUsername(data) {
    let url = `${AUTH_TOKEN}`;
    let content = 'username=' + data.username + '&password=' + data.password;
    let headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "B",
        "Cache-Control": "no-cache"
    }
    return httpDefault(METHOD.post, url, {
        content,
        headers
    });
}