// Methods related to links

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

const BASE_Parent = `${BASE}/Parent`
const AUTH_Parent = `${AUTH_PATH}/Parent`

if (Meteor.isServer) {
    Meteor.methods({
        'Parent.create': createParent,
        'Parent.getAll': getParents,
        'Parent.getByID': getParentByID,
        'Parent.getByPage': getParentByPage,
        'Parent.getByClass': getParentByClass,
        'Parent.update': updateParent,
        'Parent.delete': deleteParent,

    });
}
//THÊM
function createParent(data, accessToken = '') {
    let url = `${AUTH_Parent}/`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}
//XEM HẾT
function getParents(data, accessToken = '') {
    let url = AUTH_Parent;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}
//XEM THEO ID
function getParentByID(data, accessToken = '') {
    let url = `${AUTH_Parent}/${data._id}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getParentByPage(data, accessToken = '') {
    let url = `${AUTH_Parent}/${data.page}?limit=${data.limit}`
    if (data.options && data.options.length)
        data.options.forEach(item => {
            if (item.value) url += `&${encodeURIComponent(item.text)}=${encodeURIComponent(item.value)}`
        })
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getParentByClass(data, accessToken = '') {
    let url = `${AUTH_Parent}/byClass?classID=${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

//UPDATE 
function updateParent(data, accessToken = '') {
    let url = `${AUTH_Parent}/${data._id}`
    return httpDefault(METHOD.put, url, {
        body: data,
        token: accessToken
    });
}

//XÓA
function deleteParent(data, accessToken = '') {
    let url = `${AUTH_Parent}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}