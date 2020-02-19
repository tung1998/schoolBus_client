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
        'Nanny.getByPage': getNannysByPage,
        'Nanny.getByID': getNannyByID,
        'Nanny.update': updateNanny,
        'Nanny.delete': deleteNanny,
        'Nanny.log': getNannysByLog,
        'Nanny.seeByLog': getNannyIDbyLog,
    });
    // public cho client subscribe
    Meteor.publish('Nanny.getAll.meteor', () => {
        return COLLECTION_Nanny.find({ isDeleted: false });
    });

    // public cho client subscribe
    Meteor.publish('Nanny.getByIDs.meteor', (ids) => {
        return COLLECTION_Nanny.find({
            isDeleted: false,
            _id: {
                $in: ids.map(e => new Meteor.Collection.ObjectID(e))
            }
        });
    });
}
//THÊM
function createNanny(Nanny, accessToken = '') {
    let url = `${AUTH_Nanny}/`
    return httpDefault(METHOD.post, url, { token: accessToken });
}
//XEM HẾT
function getNannys(options = {}, accessToken = '', extra) {
    let url = AUTH_Nanny;
    //let { driverBlockedType } = options;
    //if (driverBlockedType) url += `?driverBlockedType=${driverBlockedType}`
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO TRANG
function getNannysByPage(accessToken = '', page = 1) {
    let url = `${AUTH_Nanny}/${page}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO ID
function getNannyByID(NannyID, accessToken = '') {
    //console.log(driverID, accessToken);
    let url = `${AUTH_Nanny}/${NannyID}`;
    //console.log(url);

    return httpDefault(METHOD.get, url, { token: accessToken });
}
//UPDATE 
function updateNanny(Nanny, accessToken = '') {
    let url = `${AUTH_Nanny}/${NannyID}`
    return httpDefault(METHOD.put, url, { token: accessToken });
}

//XÓA
function deleteNanny(NannyID, accessToken = '') {
    let url = `${AUTH_Nanny}/${NannyID}`
    return httpDefault(METHOD.del, url, { token: accessToken });
}

//LOG
function getNannysByLog(accessToken = '', page = 1) {
    let url = `${AUTH_Nanny}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

//GET ID BY LOG
function getNannyIDbyLog(accessToken = '', page = 1) {
    let url = `${AUTH_Nanny}/${NannyID}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}