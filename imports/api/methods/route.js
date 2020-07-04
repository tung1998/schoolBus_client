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
        'route.getByPage': getRouteByPage,
        'route.create': createRoute,
        'route.update': updateRoute,
        'route.delete': deleteRoute,
        'route.updateCarStopDelayTime': updateCarStopDelayTime,
    });
}

function getAllRoute(data, accessToken = '') {
    let url = `${AUTH_ROUTE}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getRouteByID(data, accessToken = '') {
    let url = `${AUTH_ROUTE}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getRouteByPage(data, accessToken = '') {
    let url = `${AUTH_ROUTE}/${data.page}?limit=${data.limit}`
    if (data.options && data.options.length)
        data.options.forEach(item => {
            if (item.value) url += `&${encodeURIComponent(item.text)}=${encodeURIComponent(item.value)}`
        })
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
        body: data, 
        token: accessToken
    });
}

function deleteRoute(data, accessToken = '') {
    let url = `${AUTH_ROUTE}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}

function updateCarStopDelayTime(data, accessToken = '') {
    let url = `${AUTH_ROUTE}/${data.routeID}/carStop/${data.carStopID}`
    return httpDefault(METHOD.put, url, {
        body:{
            delayTime: data.delayTime
        },
        token: accessToken
    });
}