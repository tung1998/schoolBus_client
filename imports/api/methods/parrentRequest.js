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
        'ParrentRequest.getByPage': getParrentRequestsByPage,
        'ParrentRequest.getByID': getParrentRequestByID,
        'ParrentRequest.update': updateParrentRequest,
        'ParrentRequest.delete': deleteParrentRequest,
        'ParrentRequest.log': getParrentRequestsByLog,
        'ParrentRequest.seeByLog': getParrentRequestIDbyLog,
    });
    // public cho client subscribe
    Meteor.publish('ParrentRequest.getAll.meteor', () => {
        return COLLECTION_ParrentRequest.find({ isDeleted: false });
    });

    // public cho client subscribe
    Meteor.publish('ParrentRequest.getByIDs.meteor', (ids) => {
        return COLLECTION_ParrentRequest.find({
            isDeleted: false,
            _id: {
                $in: ids.map(e => new Meteor.Collection.ObjectID(e))
            }
        });
    });
}
//THÊM
function createParrentRequest(ParrentRequest, accessToken = '') {
    let url = `${AUTH_ParrentRequest}/`
    return httpDefault(METHOD.post, url, { token: accessToken });
}
//XEM HẾT
function getParrentRequests(options = {}, accessToken = '', extra) {
    let url = AUTH_ParrentRequest;
    //let { driverBlockedType } = options;
    //if (driverBlockedType) url += `?driverBlockedType=${driverBlockedType}`
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO TRANG
function getParrentRequestsByPage(accessToken = '', page = 1) {
    let url = `${AUTH_ParrentRequest}/${page}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO ID
function getParrentRequestByID(ParrentRequestID, accessToken = '') {
    //console.log(driverID, accessToken);
    let url = `${AUTH_ParrentRequest}/${ParrentRequestID}`;
    //console.log(url);

    return httpDefault(METHOD.get, url, { token: accessToken });
}
//UPDATE 
function updateParrentRequest(ParrentRequest, accessToken = '') {
    let url = `${AUTH_ParrentRequest}/${ParrentRequestID}`
    return httpDefault(METHOD.put, url, { token: accessToken });
}

//XÓA
function deleteParrentRequest(ParrentRequestID, accessToken = '') {
    let url = `${AUTH_ParrentRequest}/${ParrentRequestID}`
    return httpDefault(METHOD.del, url, { token: accessToken });
}

//LOG
function getParrentRequestsByLog(accessToken = '', page = 1) {
    let url = `${AUTH_ParrentRequest}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

//GET ID BY LOG
function getParrentRequestIDbyLog(accessToken = '', page = 1) {
    let url = `${AUTH_ParrentRequest}/${ParrentRequestID}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}