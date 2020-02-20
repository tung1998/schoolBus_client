import {
    Meteor
} from 'meteor/meteor';

import {
    BASE,
    AUTH_PATH,
} from '../config'
import {
    METHOD,
    httpDefault
} from '../checkAPI'

const BASE_SCHOOL = `${BASE}/School`
const AUTH_SCHOOL = `${AUTH_PATH}/School`

if (Meteor.isServer) {
    Meteor.methods({
<<<<<<< HEAD
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
=======
        'school.getAll': getAllSchool,
        'school.getByID': getSchoolByID,
        'school.create': createSchool,
        'school.update': updateSchool,
        'school.delete': deleteSchool,
    });
}

function getAllSchool(accessToken = '') {
    let url = `${AUTH_SCHOOL}`
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    });
}

function getSchoolByID(data, accessToken = '') {
    let url = `${AUTH_SCHOOL}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createSchool(data, accessToken = '') {
    let url = `${AUTH_SCHOOL}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}

function updateSchool(data, accessToken = '') {
    let url = `${AUTH_SCHOOL}/${data._id}`
    return httpDefault(METHOD.put, url, {
        token: accessToken
    });
}

function deleteSchool(data, accessToken = '') {
    let url = `${AUTH_SCHOOL}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}
>>>>>>> b45c36112edaa855a4d6f7627b65a951d95db03e
