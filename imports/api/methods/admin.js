// Methods related to links

import { Meteor } from 'meteor/meteor';
// import { Mongo } from 'meteor/mongo';

import {
    BASE,
    AUTH_PATH
} from '../config'
import { METHOD, httpDefault } from '../checkAPI';

const BASE_URL = `${BASE}/Admin`
const AUTH_URL = `${AUTH_PATH}/Admin`
    // render data truc tiep tu mongodb
    // export const COLLECTION_Admin = new Mongo.Collection('Admin', { idGeneration: 'MONGO' });

if (Meteor.isServer) {
    Meteor.methods({
        'admin.create': createAdmin,
        'admin.getAll': getAdmin,
        'admin.update': updateAdmin,
        'admin.delete': deleteAdmin,
    });
    // public cho client subscribe
    // Meteor.publish('Admin.getAll.meteor', () => {
    //     return COLLECTION_Admin.find({isDeleted: false});
    // });
}

function getAdmin(accessToken = '') {
    let url = `${AUTH_URL}`;
    return httpDefault(METHOD.get, url, { token: accessToken })
}

function createAdmin(admin, accessToken = '') {
    let url = `${AUTH_URL}`;
    return httpDefault(METHOD.post, url, {
        body: admin,
        token: accessToken,
    })
}

function updateAdmin(Admins, accessToken = '') {
    let url = `${AUTH_URL}`;
    return httpDefault(METHOD.put, url, {
        body: admin,
        token: accessToken,
    })
}

function deleteAdmin(_ids, accessToken = '') {
    let url = `${AUTH_URL}`;
    return httpDefault(METHOD.del, url, {
        body: { _ids },
        token: accessToken,
    })
}