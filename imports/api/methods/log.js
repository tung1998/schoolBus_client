import { Meteor } from 'meteor/meteor';

import { BASE, AUTH_PATH } from '../config'
import { httpDefault, METHOD } from '../checkAPI';

const AUTH_LOG = `${AUTH_PATH}/Log`

if (Meteor.isServer) {
    Meteor.methods({
        'log.get': getLog,
    });
}

function getLog() {
    let url = `${AUTH_LOG}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
