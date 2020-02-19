// Methods related to links

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { BASE, AUTH_PATH, } from '../config'
import { METHOD, httpDefault } from '../checkAPI'

const BASE_School = `${BASE}/School`
const AUTH_School = `${AUTH_PATH}/School`

// render data truc tiep tu mongodb
export const COLLECTION_School = new Mongo.Collection('School', { idGeneration: 'MONGO' });

if (Meteor.isServer) {
    Meteor.methods({
        'School.create': createSchool,
        'School.getAll': getSchools,
        'School.getByPage': getSchoolsByPage,
        'School.getByID': getSchoolByID,
        'School.update': updateSchool,
        'School.delete': deleteSchool,
        'School.log': getSchoolsByLog,
        'School.seeByLog': getSchoolIDbyLog,
    });
    // public cho client subscribe
    Meteor.publish('School.getAll.meteor', () => {
        return COLLECTION_School.find({ isDeleted: false });
    });

    // public cho client subscribe
    Meteor.publish('School.getByIDs.meteor', (ids) => {
        return COLLECTION_School.find({
            isDeleted: false,
            _id: {
                $in: ids.map(e => new Meteor.Collection.ObjectID(e))
            }
        });
    });
}
//THÊM
function createSchool(School, accessToken = '') {
    let url = `${AUTH_School}/`
    return httpDefault(METHOD.post, url, { token: accessToken });
}
//XEM HẾT
function getSchools(options = {}, accessToken = '', extra) {
    let url = AUTH_School;
    //let { driverBlockedType } = options;
    //if (driverBlockedType) url += `?driverBlockedType=${driverBlockedType}`
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO TRANG
function getSchoolsByPage(accessToken = '', page = 1) {
    let url = `${AUTH_School}/${page}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO ID
function getSchoolByID(SchoolID, accessToken = '') {
    //console.log(driverID, accessToken);
    let url = `${AUTH_School}/${SchoolID}`;
    //console.log(url);

    return httpDefault(METHOD.get, url, { token: accessToken });
}
//UPDATE 
function updateSchool(School, accessToken = '') {
    let url = `${AUTH_School}/${SchoolID}`
    return httpDefault(METHOD.put, url, { token: accessToken });
}

//XÓA
function deleteSchool(SchoolID, accessToken = '') {
    let url = `${AUTH_School}/${SchoolID}`
    return httpDefault(METHOD.del, url, { token: accessToken });
}

//LOG
function getSchoolsByLog(accessToken = '', page = 1) {
    let url = `${AUTH_School}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

//GET ID BY LOG
function getSchoolIDbyLog(accessToken = '', page = 1) {
    let url = `${AUTH_School}/${SchoolID}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}