// Methods related to links

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { BASE, AUTH_PATH, } from '../config'
import { METHOD, httpDefault } from '../checkAPI'

const BASE_COMMON = `${BASE}/COMMON`
const AUTH_COMMON = `${AUTH_PATH}/COMMON`

// render data truc tiep tu mongodb
export const COLLECTION_COMMON = new Mongo.Collection('COMMON', { idGeneration: 'MONGO' });

if (Meteor.isServer) {
    Meteor.methods({
        'COMMON.create': createCOMMON,
        'COMMON.getAll': getCOMMONs,
        'COMMON.getByPage': getCOMMONsByPage,
        'COMMON.getByID': getCOMMONByID,
        'COMMON.update': updateCOMMON,
        'COMMON.delete': deleteCOMMON,
        'COMMON.log': getCOMMONsByLog,
        'COMMON.seeByLog': getCOMMONIDbyLog,
    });
    // public cho client subscribe
    Meteor.publish('COMMON.getAll.meteor', () => {
        return COLLECTION_COMMON.find({ isDeleted: false });
    });

    // public cho client subscribe
    Meteor.publish('COMMON.getByIDs.meteor', (ids) => {
        return COLLECTION_COMMON.find({
            isDeleted: false,
            _id: {
                $in: ids.map(e => new Meteor.Collection.ObjectID(e))
            }
        });
    });
}
//THÊM
function createCOMMON(COMMON, accessToken = '') {
    let url = `${AUTH_COMMON}/`
    return httpDefault(METHOD.post, url, { token: accessToken });
}
//XEM HẾT
function getCOMMONs(options = {}, accessToken = '', extra) {
    let url = AUTH_COMMON;
    //let { driverBlockedType } = options;
    //if (driverBlockedType) url += `?driverBlockedType=${driverBlockedType}`
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO TRANG
function getCOMMONsByPage(accessToken = '', page = 1) {
    let url = `${AUTH_COMMON}/${page}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO ID
function getCOMMONByID(COMMONID, accessToken = '') {
    //console.log(driverID, accessToken);
    let url = `${AUTH_COMMON}/${COMMONID}`;
    //console.log(url);

    return httpDefault(METHOD.get, url, { token: accessToken });
}
//UPDATE 
function updateCOMMON(COMMON, accessToken = '') {
    let url = `${AUTH_COMMON}/${COMMONID}`
    return httpDefault(METHOD.put, url, { token: accessToken });
}

//XÓA
function deleteCOMMON(COMMONID, accessToken = '') {
    let url = `${AUTH_COMMON}/${COMMONID}`
    return httpDefault(METHOD.del, url, { token: accessToken });
}

//LOG
function getCOMMONsByLog(accessToken = '', page = 1) {
    let url = `${AUTH_COMMON}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

//GET ID BY LOG
function getCOMMONIDbyLog(accessToken = '', page = 1) {
    let url = `${AUTH_COMMON}/${COMMONID}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}