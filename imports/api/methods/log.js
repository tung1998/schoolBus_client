import { Meteor } from 'meteor/meteor';

import { BASE, AUTH_PATH } from '../config'
import { httpDefault, METHOD } from '../checkAPI';

const AUTH_LOG = `${AUTH_PATH}/Log`

if (Meteor.isServer) {
    Meteor.methods({
        'log.getAll': getLog,
        'log.getByID': getLogById,
    });
}

function getLog() {
    let url = `${AUTH_LOG}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

function getLogById(data) {
    let url = `${AUTH_LOG}/${data._id}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
