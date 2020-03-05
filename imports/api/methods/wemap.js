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

const BASE_USER = `${BASE}/we-tools`
const AUTH_USER = `${AUTH_PATH}/we-tools`
if (Meteor.isServer) {
    Meteor.methods({
        'wemap.getAddress': getAddress,
        'wemap.getDrivePath': getDrivePath
    });
}

function getAddress(data, accessToken = '') {
    //let url = `https://apis.wemap.asia/we-tools/reverse?key=IqzJukzUWpWrcDHJeDpUPLSGndDx&lat=${data.lat}&lon=${data.lng}`
    let url = ""
        //console.log(url)
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getDrivePath(data, accessToken = '') {
    let url = `https://apis.wemap.asia/direction-api/route/v1/driving/${data.startLng}%2C${data.startLat}%3B${data.desLng}%2C${data.desLat}?geometries=polyline&steps=true&overview=full&key=vpstPRxkBBTLaZkOaCfAHlqXtCR`;
    //console.log(url)
    //let url = ""
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}