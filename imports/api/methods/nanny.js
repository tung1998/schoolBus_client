// Methods related to links

import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';

import {
    BASE,
    AUTH_PATH,
} from '../config'
import {
    METHOD,
    httpDefault
} from '../checkAPI'

const BASE_Nanny = `${BASE}/Nanny`
const AUTH_Nanny = `${AUTH_PATH}/Nanny`

// render data truc tiep tu mongodb
export const COLLECTION_Nanny = new Mongo.Collection('Nanny', {
    idGeneration: 'MONGO'
});

if (Meteor.isServer) {
    Meteor.methods({
        'Nanny.create': createNanny,
        'Nanny.getAll': getNannys,
        'Nanny.getByID': getNannyByID,
        'Nanny.getByPage': getNannyByPage,
        'Nanny.update': updateNanny,
        'Nanny.delete': deleteNanny,
    });
}
//THÊM
function createNanny(data, accessToken = '') {
    let url = `${AUTH_Nanny}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}
//XEM HẾT
function getNannys(data, accessToken = '') {
    let url = `${AUTH_Nanny}?extra=${data.extra}`;
    if (data && data.options && data.options.length)
    data.options.forEach(item => {
        if (item.value) url += `&${encodeURIComponent(item.text)}=${encodeURIComponent(item.value)}`
    })
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

//XEM THEO ID
function getNannyByID(data, accessToken = '') {
    let url = `${AUTH_Nanny}/${data._id}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getNannyByPage(data, accessToken = '') {
    let url = `${AUTH_Nanny}/${data.page}?limit=${data.limit}`;
    if (data.options && data.options.length)
        data.options.forEach(item => {
            if (item.value) url += `&${encodeURIComponent(item.text)}=${encodeURIComponent(item.value)}`
        })
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//UPDATE 
function updateNanny(data, accessToken = '') {
    let url = `${AUTH_Nanny}/${data._id}`
    return httpDefault(METHOD.put, url, {
        body: data,
        token: accessToken
    });
}

//XÓA
function deleteNanny(data, accessToken = '') {
    let url = `${AUTH_Nanny}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}