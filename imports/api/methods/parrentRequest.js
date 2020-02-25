// Methods related to links

import { Meteor } from 'meteor/meteor';

import {
    BASE,
    AUTH_PATH
} from '../config'
import { METHOD, httpDefault } from '../checkAPI'
const BASE_ParrentRequest = `${AUTH_PATH}/ParrentRequest`

if (Meteor.isServer) {
    Meteor.methods({
        'ParrentRequest.create': createParrentRequest,
        'ParrentRequest.getAll': getParrentRequests,
        'ParrentRequest.getById': getParrentRequestById,
        'ParrentRequest.update': updateParrentRequest,
        'ParrentRequest.delete': deleteParrentRequest,
    });
}

function getParrentRequests(data, accessToken = '') {
    let url = `${BASE_ParrentRequest}?extra=${data.extra}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

function getParrentRequestById(data, accessToken = '') {
    let url = `${BASE_ParrentRequest}/${data._id}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

function createParrentRequest(data, accessToken = '') {
    let url = BASE_ParrentRequest;
    return httpDefault(METHOD.post, url, { body: data, token: accessToken });
}

function updateParrentRequest(data, accessToken = '') {
    let url = `${BASE_ParrentRequest}/${data._id}/content`;
    return httpDefault(METHOD.put, url, { token: accessToken });
}

function deleteParrentRequest(data, accessToken = '') {
    let url = `${BASE_ParrentRequest}/${data._id}`;
    return httpDefault(METHOD.del, url, { token: accessToken });
}