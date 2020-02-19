// Methods related to links

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { BASE, AUTH_PATH, } from '../config'
import { METHOD, httpDefault } from '../checkAPI'

const BASE_CarStopTrip = `${BASE}/CarStopTrip`
const AUTH_CarStopTrip = `${AUTH_PATH}/CarStopTrip`

// render data truc tiep tu mongodb
export const COLLECTION_CarStopTrip = new Mongo.Collection('CarStopTrip', { idGeneration: 'MONGO' });

if (Meteor.isServer) {
    Meteor.methods({
        'CarStopTrip.create': createCarStopTrip,
        'CarStopTrip.getAll': getCarStopTrips,
        'CarStopTrip.getByPage': getCarStopTripsByPage,
        'CarStopTrip.getByID': getCarStopTripByID,
        'CarStopTrip.update': updateCarStopTrip,
        'CarStopTrip.delete': deleteCarStopTrip,
        'CarStopTrip.log': getCarStopTripsByLog,
        'CarStopTrip.seeByLog': getCarStopTripIDbyLog,
    });
    // public cho client subscribe
    Meteor.publish('CarStopTrip.getAll.meteor', () => {
        return COLLECTION_CarStopTrip.find({ isDeleted: false });
    });

    // public cho client subscribe
    Meteor.publish('CarStopTrip.getByIDs.meteor', (ids) => {
        return COLLECTION_CarStopTrip.find({
            isDeleted: false,
            _id: {
                $in: ids.map(e => new Meteor.Collection.ObjectID(e))
            }
        });
    });
}
//THÊM
function createCarStopTrip(CarStopTrip, accessToken = '') {
    let url = `${AUTH_CarStopTrip}/`
    return httpDefault(METHOD.post, url, { token: accessToken });
}
//XEM HẾT
function getCarStopTrips(options = {}, accessToken = '', extra) {
    let url = AUTH_CarStopTrip;
    //let { driverBlockedType } = options;
    //if (driverBlockedType) url += `?driverBlockedType=${driverBlockedType}`
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO TRANG
function getCarStopTripsByPage(accessToken = '', page = 1) {
    let url = `${AUTH_CarStopTrip}/${page}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO ID
function getCarStopTripByID(CarStopTripID, accessToken = '') {
    //console.log(driverID, accessToken);
    let url = `${AUTH_CarStopTrip}/${CarStopTripID}`;
    //console.log(url);

    return httpDefault(METHOD.get, url, { token: accessToken });
}
//UPDATE 
function updateCarStopTrip(CarStopTrip, accessToken = '') {
    let url = `${AUTH_CarStopTrip}/${CarStopTripID}`
    return httpDefault(METHOD.put, url, { token: accessToken });
}

//XÓA
function deleteCarStopTrip(CarStopTripID, accessToken = '') {
    let url = `${AUTH_CarStopTrip}/${CarStopTripID}`
    return httpDefault(METHOD.del, url, { token: accessToken });
}

//LOG
function getCarStopTripsByLog(accessToken = '', page = 1) {
    let url = `${AUTH_CarStopTrip}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

//GET ID BY LOG
function getCarStopTripIDbyLog(accessToken = '', page = 1) {
    let url = `${AUTH_CarStopTrip}/${CarStopTripID}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}