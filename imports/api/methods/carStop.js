// Methods related to links

import { Meteor } from 'meteor/meteor';

import {
    BASE,
    AUTH_PATH
} from '../config'
import {
    METHOD,
    httpDefault
} from '../checkAPI'

const BASE_CAR_STOP = `${BASE}/CarStop`
const AUTH_CAR_STOP = `${AUTH_PATH}/CarStop`

if (Meteor.isServer) {
    Meteor.methods({
        'carStop.create': createCarStop,
        'carStop.getAll': getCarStops,
        'carStop.update': updateCarStop,
        'carStop.delete': deleteCarStop,
        'carStop.getByID': getCarStopByID,
        'carStop.getNormalCarStops': getNormalCarStops,
        'carStop.getRequireCarStops': getRequireCarStops,
        'carStop.getTransitCarStops': getTransitCarStops,
        'carStop.getByTypeInRoute': getByTypeInRouteCarStops,
        'carStop.getByPage': getCarStopsByPage,
        'carStop.getBySearch': getCarStopsBySearch,
    });
}
//XEM
function getCarStops(accessToken = '') {
    let url = AUTH_CAR_STOP
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO ID
function getCarStopByID(carStopID, accessToken = '') {
    let url = `${AUTH_CAR_STOP}/${carStopID}`
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO TRANG
function getCarStopsByPage({ page, limit, options }, accessToken = '') {
    let url = `${AUTH_CAR_STOP}/${page}?limit=${limit}`;
    if (options.sortBy) {
        url += `&sortBy=${options.sortBy}`
    }
    if (options.sortType) {
        url += `&sortType=${options.sortType}`
    }
    // console.log(url, accessToken);
    return httpDefault(METHOD.get, url, { token: accessToken })
}
//? 
function getNormalCarStops(accessToken = '') {
    let url = `${AUTH_CAR_STOP}/getNormalCarStops`
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//?
function getTransitCarStops(accessToken = '') {
    let url = `${AUTH_CAR_STOP}/getTransitCarStops`
    return httpDefault(METHOD.get, url, { token: accessToken });
}

function getRequireCarStops(accessToken = '') {
    let url = `${AUTH_CAR_STOP}/getRequireCarStops`
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//THÊM
function createCarStop(carStop, accessToken = '') {
    let url = AUTH_CAR_STOP;
    return httpDefault(METHOD.post, url, { body: carStop, token: accessToken });
}
//SỬA
function updateCarStop(carStop, accessToken = '') {
    let url = `${AUTH_CAR_STOP}/${carStop._id}`;
    return httpDefault(METHOD.put, url, { body: carStop, token: accessToken });
}
//TÌM KIẾM
function getCarStopsBySearch(name, address, accessToken = '') {
    let url = `${AUTH_CAR_STOP}/search`
    return httpDefault(METHOD.post, url, {
        body: {
            name,
            address
        },
        token: accessToken,
    })
}
//XÓA
function deleteCarStop(carStopID, accessToken = '') {
    let url = `${AUTH_CAR_STOP}/${carStopID}`;
    return httpDefault(METHOD.del, url, { body: carStop, token: accessToken });
}
//?
function getByTypeInRouteCarStops({ type, routeID }, accessToken = '') {
    let url = `${AUTH_CAR_STOP}/byTypeInRoute?type=${type}`;
    if (routeID) url += `&routeID=${routeID}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}