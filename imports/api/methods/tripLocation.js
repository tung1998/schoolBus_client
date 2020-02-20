// Methods related to links

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { BASE, AUTH_PATH, } from '../config'
import { METHOD, httpDefault } from '../checkAPI'

const BASE_TRIPLOCATION = `${BASE}/TripLocation`
const AUTH_TRIPLOCATION = `${AUTH_PATH}/TripLocation`

// render data truc tiep tu mongodb
export const COLLECTION_TRIPLOCATION = new Mongo.Collection('TripLocation', { idGeneration: 'MONGO' });

if (Meteor.isServer) {
    Meteor.methods({
        'tripLocation.create': createTripLocation,
        // 'tripLocation.getAll': getTripLocations,
        // 'tripLocation.getNotAssignDriver': getTripLocationNotAssignDriver,
        // 'tripLocation.getByPage': getTripLocationsByPage,
        'tripLocation.getByDriver': getTripLocationByDriver,
        'tripLocation.update': updateTripLocation,
        // 'tripLocation.updateStatus': updateTripLocationStatus,
        'tripLocation.delete': deleteTripLocation,
    });
    // public cho client subscribe
    Meteor.publish('tripLocation.getAll.meteor', () => {
        return COLLECTION_TRIPLOCATION.find({ isDeleted: false });
    });

    // public cho client subscribe
    Meteor.publish('tripLocation.getByIDs.meteor', (ids) => {
        return COLLECTION_TRIPLOCATION.find({
            isDeleted: false,
            _id: {
                $in: ids.map(e => new Meteor.Collection.ObjectID(e))
            }
        });
    });
}
//THÊM XE
function createTripLocation(tripLocation, accessToken = '') {
    let url = `${AUTH_TRIPLOCATION}/`
    return httpDefault(METHOD.post, url, { token: accessToken });
}
//ĐẾM XE
function getTripLocations(accessToken = '', options = {}) {
    let url = AUTH_TRIPLOCATION;
    let { driverBlockedType } = options;
    if (driverBlockedType) url += `?driverBlockedType=${driverBlockedType}`
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//LẤY DANH SÁCH XE
function getTripLocationByDriver(driverID, accessToken = '') {
    //console.log(driverID, accessToken);
    let url = `${AUTH_TRIPLOCATION}/bydriver?driverID=${driverID}`;
    //console.log(url);

    return httpDefault(METHOD.get, url, { token: accessToken });
}
//LẤY XE THEO page
function getTripLocationsByPage(accessToken = '', page = 1) {
    let url = `${AUTH_TRIPLOCATION}/${page}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//LẤY XE THEO IDs
//XÓA XE
function deleteTripLocation(tripLocationID, accessToken = '') {
    let url = `${AUTH_TRIPLOCATION}/:tripLocationID([0-9a-fA-F]{24})`
    return httpDefault(METHOD.del, url, { token: accessToken });
}
//UPDATE XE
function updateTripLocation(tripLocation, accessToken = '') {
    let url = `${AUTH_TRIPLOCATION}/:tripLocationID([0-9a-fA-F]{24})`
    return httpDefault(METHOD.put, url, { token: accessToken });
}



// lay danh sach tripLocation chua duoc gan tài xế