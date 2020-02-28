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
    });
}

function getAddress(data, accessToken = '') {
    let url = `https://apis.wemap.asia/we-tools/reverse?key=IqzJukzUWpWrcDHJeDpUPLSGndDx&lat=${data.lat}&lon=${data.lng}`
        //console.log(url)
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}