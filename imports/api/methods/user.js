// Methods related to links

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { BASE, AUTH_PATH, } from '../config'
import { METHOD, httpDefault } from '../checkAPI'

const BASE_USER = `${BASE}/User`
const AUTH_USER = `${AUTH_PATH}/User`

// render data truc tiep tu mongodb
export const COLLECTION_USER = new Mongo.Collection('User', { idGeneration: 'MONGO' });

if (Meteor.isServer) {
    Meteor.methods({
        'user.create': createUser,
        // 'user.getAll': getUsers,
        // 'user.getNotAssignDriver': getUserNotAssignDriver,
        // 'user.getByPage': getUsersByPage,
        'user.getByDriver': getUserByDriver,
        'user.update': updateUser,
        // 'user.updateStatus': updateUserStatus,
        'user.delete': deleteUser,
    });
    // public cho client subscribe
    Meteor.publish('user.getAll.meteor', () => {
        return COLLECTION_USER.find({ isDeleted: false });
    });

    // public cho client subscribe
    Meteor.publish('user.getByIDs.meteor', (ids) => {
        return COLLECTION_USER.find({
            isDeleted: false,
            _id: {
                $in: ids.map(e => new Meteor.Collection.ObjectID(e))
            }
        });
    });
}
//THÊM XE
function createUser(user, accessToken = '') {
    let url = `${AUTH_USER}/`
    return httpDefault(METHOD.post, url, { token: accessToken });
}
//ĐẾM XE
function getUsers(accessToken = '', options = {}) {
    let url = AUTH_USER;
    let { driverBlockedType } = options;
    if (driverBlockedType) url += `?driverBlockedType=${driverBlockedType}`
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//LẤY DANH SÁCH XE
function getUserByDriver(driverID, accessToken = '') {
    //console.log(driverID, accessToken);
    let url = `${AUTH_USER}/bydriver?driverID=${driverID}`;
    //console.log(url);

    return httpDefault(METHOD.get, url, { token: accessToken });
}
//LẤY XE THEO page
function getUsersByPage(accessToken = '', page = 1) {
    let url = `${AUTH_USER}/${page}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//LẤY XE THEO IDs
//XÓA XE
function deleteUser(userID, accessToken = '') {
    let url = `${AUTH_USER}/:userID([0-9a-fA-F]{24})`
    return httpDefault(METHOD.del, url, { token: accessToken });
}
//UPDATE XE
function updateUser(user, accessToken = '') {
    let url = `${AUTH_USER}/:userID([0-9a-fA-F]{24})`
    return httpDefault(METHOD.put, url, { token: accessToken });
}



// lay danh sach user chua duoc gan tài xế