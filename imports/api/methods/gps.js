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

const BASE_GPS = `${BASE}/gps`
const AUTH_GPS = `${AUTH_PATH}/gps`

if (Meteor.isServer) {
    Meteor.methods({
        'gps.getLastgps': getLastgps,
        'gps.getLastByCar': getLastByCar,
    });
}

function getLastgps(data, accessToken = '') {
    let url = `${AUTH_GPS}/last`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getLastByCar(data, accessToken = '') {
    let url = `${AUTH_GPS}/last/byCar?carID=${data._id}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}