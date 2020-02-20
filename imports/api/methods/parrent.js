// Methods related to links

import { Meteor } from 'meteor/meteor';

import { BASE, AUTH_PATH, } from '../config'
import { METHOD, httpDefault } from '../checkAPI'

const BASE_Parrent = `${BASE}/Parrent`
const AUTH_Parrent = `${AUTH_PATH}/Parrent`

if (Meteor.isServer) {
    Meteor.methods({
        'Parrent.create': createParrent,
        'Parrent.getAll': getParrents,
        'Parrent.getByID': getParrentByID,
        'Parrent.update': updateParrent,
        'Parrent.delete': deleteParrent,
    });
}
//THÊM
function createParrent(data, accessToken = '') {
    let url = `${AUTH_Parrent}/`
    return httpDefault(METHOD.post, url, { token: accessToken });
}
//XEM HẾT
function getParrents(accessToken = '') {
    let url = AUTH_Parrent;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO ID
function getParrentByID(data, accessToken = '') {
    let url = `${AUTH_Parrent}/${data._id}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//UPDATE 
function updateParrent(data, accessToken = '') {
    let url = `${AUTH_Parrent}/${data._id}`
    return httpDefault(METHOD.put, url, { token: accessToken });
}

//XÓA
function deleteParrent(data, accessToken = '') {
    let url = `${AUTH_Parrent}/${data._id}`
    return httpDefault(METHOD.del, url, { token: accessToken });
}