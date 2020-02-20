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

const BASE_ROUTE = `${BASE}/Route`
const AUTH_ROUTE = `${AUTH_PATH}/Route`

if (Meteor.isServer) {
    Meteor.methods({
        'route.getAll': getAllRoute,
        'route.getByID': getRouteByID,
        'route.create': createRoute,
        'route.update': updateRoute,
        'route.delete': deleteRoute,
    });
}

function getAllRoute(accessToken = '') {
    let url = `${AUTH_ROUTE}`
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    });
}

function getRouteByID(data, accessToken = '') {
    let url = `${AUTH_ROUTE}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createRoute(data, accessToken = '') {
    let url = `${AUTH_ROUTE}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}

function updateRoute(data, accessToken = '') {
    let url = `${AUTH_ROUTE}/${data._id}`
    return httpDefault(METHOD.put, url, {
        token: accessToken
    });
}

function deleteRoute(data, accessToken = '') {
    let url = `${AUTH_ROUTE}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}