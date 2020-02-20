// Methods related to links

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { BASE, AUTH_PATH, } from '../config'
import { METHOD, httpDefault } from '../checkAPI'

const BASE_Nanny = `${BASE}/Nanny`
const AUTH_Nanny = `${AUTH_PATH}/Nanny`

// render data truc tiep tu mongodb
export const COLLECTION_Nanny = new Mongo.Collection('Nanny', { idGeneration: 'MONGO' });

if (Meteor.isServer) {
    Meteor.methods({
        'Nanny.create': createNanny,
        'Nanny.getAll': getNannys,
        'Nanny.getByID': getNannyByID,
        'Nanny.update': updateNanny,
        'Nanny.delete': deleteNanny,
    });
}
//THÊM
function createNanny(data, accessToken = '') {
    let url = `${AUTH_Nanny}/`
    return httpDefault(METHOD.post, url, { token: accessToken });
}
//XEM HẾT
function getNannys(accessToken = '') {
    let url = AUTH_Nanny;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

//XEM THEO ID
function getNannyByID(data, accessToken = '') {
    let url = `${AUTH_Nanny}/${data._id}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//UPDATE 
function updateNanny(data, accessToken = '') {
    let url = `${AUTH_Nanny}/${data._id}`
    return httpDefault(METHOD.put, url, { token: accessToken });
}

//XÓA
function deleteNanny(data, accessToken = '') {
    let url = `${AUTH_Nanny}/${data._id}`
    return httpDefault(METHOD.del, url, { token: accessToken });
}