// Methods related to links

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { BASE, AUTH_PATH, } from '../config'
import { METHOD, httpDefault } from '../checkAPI'

const BASE_TripLocation = `${BASE}/TripLocation`
const AUTH_TripLocation = `${AUTH_PATH}/TripLocation`

// render data truc tiep tu mongodb
export const COLLECTION_TripLocation = new Mongo.Collection('TripLocation', { idGeneration: 'MONGO' });

if (Meteor.isServer) {
    Meteor.methods({
        'TripLocation.create': createTripLocation,
        'TripLocation.getAll': getTripLocations,
        'TripLocation.getByPage': getTripLocationsByPage,
        'TripLocation.getByID': getTripLocationByID,
        'TripLocation.update': updateTripLocation,
        'TripLocation.delete': deleteTripLocation,
        'TripLocation.log': getTripLocationsByLog,
        'TripLocation.seeByLog': getTripLocationIDbyLog,
    });
    // public cho client subscribe
    Meteor.publish('TripLocation.getAll.meteor', () => {
        return COLLECTION_TripLocation.find({ isDeleted: false });
    });

    // public cho client subscribe
    Meteor.publish('TripLocation.getByIDs.meteor', (ids) => {
        return COLLECTION_TripLocation.find({
            isDeleted: false,
            _id: {
                $in: ids.map(e => new Meteor.Collection.ObjectID(e))
            }
        });
    });
}
//THÊM
function createTripLocation(TripLocation, accessToken = '') {
    let url = `${AUTH_TripLocation}/`
    return httpDefault(METHOD.post, url, { token: accessToken });
}
//XEM HẾT
function getTripLocations(options = {}, accessToken = '', extra) {
    let url = AUTH_TripLocation;
    //let { driverBlockedType } = options;
    //if (driverBlockedType) url += `?driverBlockedType=${driverBlockedType}`
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO TRANG
function getTripLocationsByPage(accessToken = '', page = 1) {
    let url = `${AUTH_TripLocation}/${page}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO ID
function getTripLocationByID(TripLocationID, accessToken = '') {
    //console.log(driverID, accessToken);
    let url = `${AUTH_TripLocation}/${TripLocationID}`;
    //console.log(url);

    return httpDefault(METHOD.get, url, { token: accessToken });
}
//UPDATE 
function updateTripLocation(TripLocation, accessToken = '') {
    let url = `${AUTH_TripLocation}/${TripLocationID}`
    return httpDefault(METHOD.put, url, { token: accessToken });
}

//XÓA
function deleteTripLocation(TripLocationID, accessToken = '') {
    let url = `${AUTH_TripLocation}/${TripLocationID}`
    return httpDefault(METHOD.del, url, { token: accessToken });
}

//LOG
function getTripLocationsByLog(accessToken = '', page = 1) {
    let url = `${AUTH_TripLocation}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

//GET ID BY LOG
function getTripLocationIDbyLog(accessToken = '', page = 1) {
    let url = `${AUTH_TripLocation}/${TripLocationID}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}