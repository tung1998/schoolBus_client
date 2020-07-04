// Methods related to links

import { Meteor } from 'meteor/meteor';

import {
    BASE,
    AUTH_PATH
} from '../config'
import { METHOD, httpDefault } from '../checkAPI'
const BASE_ParentRequest = `${AUTH_PATH}/ParentRequest`

if (Meteor.isServer) {
    Meteor.methods({
        'ParentRequest.create': createParentRequest,
        'ParentRequest.getAll': getParentRequests,
        'ParentRequest.getById': getParentRequestById,
        'ParentRequest.update': updateParentRequest,
        'ParentRequest.delete': deleteParentRequest,
        'ParentRequest.confirm': confirmParentRequest,
    });
}

function getParentRequests(data, accessToken = '') {
    let url = `${BASE_ParentRequest}?`;
    if (data&&data.extra) url += `extra=${data.extra}`
    return httpDefault(METHOD.get, url, { token: accessToken });
}

function getParentRequestById(data, accessToken = '') {
    let url = `${BASE_ParentRequest}/${data._id}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

function createParentRequest(data, accessToken = '') {
    let url = `${BASE_ParentRequest}`;
    return httpDefault(METHOD.post, url, { body: data, token: accessToken });
}

function updateParentRequest(data, accessToken = '') {
    let url = `${BASE_ParentRequest}/${data._id}/content`;
    return httpDefault(METHOD.put, url, { token: accessToken });
}

function confirmParentRequest(data, accessToken = '') {
    let url = `${BASE_ParentRequest}/${data._id}/confirm`;
    return httpDefault(METHOD.put, url, { token: accessToken });
}

function deleteParentRequest(data, accessToken = '') {
    let url = `${BASE_ParentRequest}/${data._id}`;
    return httpDefault(METHOD.del, url, { token: accessToken });
}