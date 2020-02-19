// Methods related to links

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { BASE, AUTH_PATH, } from '../config'
import { METHOD, httpDefault } from '../checkAPI'

const BASE_StudentTrip = `${BASE}/StudentTrip`
const AUTH_StudentTrip = `${AUTH_PATH}/StudentTrip`

// render data truc tiep tu mongodb
export const COLLECTION_StudentTrip = new Mongo.Collection('StudentTrip', { idGeneration: 'MONGO' });

if (Meteor.isServer) {
    Meteor.methods({
        'StudentTrip.create': createStudentTrip,
        'StudentTrip.getAll': getStudentTrips,
        'StudentTrip.getByPage': getStudentTripsByPage,
        'StudentTrip.getByID': getStudentTripByID,
        'StudentTrip.update': updateStudentTrip,
        'StudentTrip.delete': deleteStudentTrip,
        'StudentTrip.log': getStudentTripsByLog,
        'StudentTrip.seeByLog': getStudentTripIDbyLog,
    });
    // public cho client subscribe
    Meteor.publish('StudentTrip.getAll.meteor', () => {
        return COLLECTION_StudentTrip.find({ isDeleted: false });
    });

    // public cho client subscribe
    Meteor.publish('StudentTrip.getByIDs.meteor', (ids) => {
        return COLLECTION_StudentTrip.find({
            isDeleted: false,
            _id: {
                $in: ids.map(e => new Meteor.Collection.ObjectID(e))
            }
        });
    });
}
//THÊM
function createStudentTrip(StudentTrip, accessToken = '') {
    let url = `${AUTH_StudentTrip}/`
    return httpDefault(METHOD.post, url, { token: accessToken });
}
//XEM HẾT
function getStudentTrips(options = {}, accessToken = '', extra) {
    let url = AUTH_StudentTrip;
    //let { driverBlockedType } = options;
    //if (driverBlockedType) url += `?driverBlockedType=${driverBlockedType}`
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO TRANG
function getStudentTripsByPage(accessToken = '', page = 1) {
    let url = `${AUTH_StudentTrip}/${page}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO ID
function getStudentTripByID(StudentTripID, accessToken = '') {
    //console.log(driverID, accessToken);
    let url = `${AUTH_StudentTrip}/${StudentTripID}`;
    //console.log(url);

    return httpDefault(METHOD.get, url, { token: accessToken });
}
//UPDATE 
function updateStudentTrip(StudentTrip, accessToken = '') {
    let url = `${AUTH_StudentTrip}/${StudentTripID}`
    return httpDefault(METHOD.put, url, { token: accessToken });
}

//XÓA
function deleteStudentTrip(StudentTripID, accessToken = '') {
    let url = `${AUTH_StudentTrip}/${StudentTripID}`
    return httpDefault(METHOD.del, url, { token: accessToken });
}

//LOG
function getStudentTripsByLog(accessToken = '', page = 1) {
    let url = `${AUTH_StudentTrip}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

//GET ID BY LOG
function getStudentTripIDbyLog(accessToken = '', page = 1) {
    let url = `${AUTH_StudentTrip}/${StudentTripID}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}