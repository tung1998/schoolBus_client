// Methods related to links

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { BASE, AUTH_PATH, } from '../config'
import { METHOD, httpDefault } from '../checkAPI'

const BASE_ParrentRequest = `${BASE}/ParrentRequest`
const AUTH_ParrentRequest = `${AUTH_PATH}/ParrentRequest`

// render data truc tiep tu mongodb
export const COLLECTION_ParrentRequest = new Mongo.Collection('ParrentRequest', { idGeneration: 'MONGO' });

if (Meteor.isServer) {
    Meteor.methods({
        'ParrentRequest.create': createParrentRequest,
        'ParrentRequest.getAll': getParrentRequests,
        'ParrentRequest.getByID': getParrentRequestByID,
        'ParrentRequest.update': updateParrentRequest,
        'ParrentRequest.delete': deleteParrentRequest,
    });
}
//THÊM
function createParrentRequest(data, accessToken = '') {
    let url = `${AUTH_ParrentRequest}/`
    return httpDefault(METHOD.post, url, { token: accessToken });
}
//XEM HẾT
function getParrentRequests(accessToken = '') {
    let url = AUTH_ParrentRequest;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO ID
function getParrentRequestByID(data, accessToken = '') {
    let url = `${AUTH_ParrentRequest}/${data._id}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//UPDATE 
function updateParrentRequest(data, accessToken = '') {
    let url = `${AUTH_ParrentRequest}/${data._id}`
    return httpDefault(METHOD.put, url, { token: accessToken });
}

//XÓA
function deleteParrentRequest(data, accessToken = '') {
    let url = `${AUTH_ParrentRequest}/${data._id}`
    return httpDefault(METHOD.del, url, { token: accessToken });
}