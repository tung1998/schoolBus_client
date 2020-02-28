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
        'monitoring.getLastgps': getLastgps,
    });
}

function getLastgps(data, accessToken = '') {
    let url = `${AUTH_GPS}/last`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}