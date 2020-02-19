// Methods related to links

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { BASE, AUTH_PATH, } from '../config'
import { METHOD, httpDefault } from '../checkAPI'

const BASE_Parrent = `${BASE}/Parrent`
const AUTH_Parrent = `${AUTH_PATH}/Parrent`

// render data truc tiep tu mongodb
export const COLLECTION_Parrent = new Mongo.Collection('Parrent', { idGeneration: 'MONGO' });

if (Meteor.isServer) {
    Meteor.methods({
        'Parrent.create': createParrent,
        'Parrent.getAll': getParrents,
        'Parrent.getByPage': getParrentsByPage,
        'Parrent.getByID': getParrentByID,
        'Parrent.update': updateParrent,
        'Parrent.delete': deleteParrent,
        'Parrent.log': getParrentsByLog,
        'Parrent.seeByLog': getParrentIDbyLog,
    });
    // public cho client subscribe
    Meteor.publish('Parrent.getAll.meteor', () => {
        return COLLECTION_Parrent.find({ isDeleted: false });
    });

    // public cho client subscribe
    Meteor.publish('Parrent.getByIDs.meteor', (ids) => {
        return COLLECTION_Parrent.find({
            isDeleted: false,
            _id: {
                $in: ids.map(e => new Meteor.Collection.ObjectID(e))
            }
        });
    });
}
//THÊM
function createParrent(Parrent, accessToken = '') {
    let url = `${AUTH_Parrent}/`
    return httpDefault(METHOD.post, url, { token: accessToken });
}
//XEM HẾT
function getParrents(options = {}, accessToken = '', extra) {
    let url = AUTH_Parrent;
    //let { driverBlockedType } = options;
    //if (driverBlockedType) url += `?driverBlockedType=${driverBlockedType}`
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO TRANG
function getParrentsByPage(accessToken = '', page = 1) {
    let url = `${AUTH_Parrent}/${page}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO ID
function getParrentByID(ParrentID, accessToken = '') {
    //console.log(driverID, accessToken);
    let url = `${AUTH_Parrent}/${ParrentID}`;
    //console.log(url);

    return httpDefault(METHOD.get, url, { token: accessToken });
}
//UPDATE 
function updateParrent(Parrent, accessToken = '') {
    let url = `${AUTH_Parrent}/${ParrentID}`
    return httpDefault(METHOD.put, url, { token: accessToken });
}

//XÓA
function deleteParrent(ParrentID, accessToken = '') {
    let url = `${AUTH_Parrent}/${ParrentID}`
    return httpDefault(METHOD.del, url, { token: accessToken });
}

//LOG
function getParrentsByLog(accessToken = '', page = 1) {
    let url = `${AUTH_Parrent}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

//GET ID BY LOG
function getParrentIDbyLog(accessToken = '', page = 1) {
    let url = `${AUTH_Parrent}/${ParrentID}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}