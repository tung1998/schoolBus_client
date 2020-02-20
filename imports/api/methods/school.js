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
        'School.getByID': getSchoolByID,
        'School.getByPage': getSchoolsByPage,
        'School.update': updateSchool,
        'School.delete': deleteSchool
    });
}
//THÊM
function createSchool(data, accessToken = '') {
    let url = `${AUTH_School}/`
    return httpDefault(
        METHOD.post,
        url,
        { 
            body: data,
            token: accessToken
        }
    );
}
//XEM HẾT
function getSchools(options = {}, accessToken = '', extra) {
    let url = `${AUTH_School}/`;
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
function getSchoolByID(data, accessToken = '') {
    //console.log(driverID, accessToken);
    let url = `${AUTH_School}/${data.SchoolID}`;
    //console.log(url);

    return httpDefault(METHOD.get, url, {token: accessToken });
}
//UPDATE 
function updateSchool(data, accessToken = '') {
    let url = `${AUTH_School}/${data.SchoolID}`
    return httpDefault(METHOD.put, url, {body: data, token: accessToken });
}

//XÓA
function deleteSchool(data, accessToken = '') {
    let url = `${AUTH_School}/${data.SchoolID}`
    return httpDefault(METHOD.del, url, {body: data, token: accessToken });
}

// //LOG
// function getSchoolsByLog(accessToken = '', page = 1) {
//     let url = `${AUTH_School}/Log`;
//     return httpDefault(METHOD.get, url, { token: accessToken });
// }

// //GET ID BY LOG
// function getSchoolIDbyLog(accessToken = '', page = 1) {
//     let url = `${AUTH_School}/${SchoolID}/Log`;
//     return httpDefault(METHOD.get, url, { token: accessToken });
// }