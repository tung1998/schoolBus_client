// Methods related to links

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { BASE, AUTH_PATH, } from '../config'
import { METHOD, httpDefault } from '../checkAPI'

const BASE_Teacher = `${BASE}/Teacher`
const AUTH_Teacher = `${AUTH_PATH}/Teacher`

// render data truc tiep tu mongodb
export const COLLECTION_Teacher = new Mongo.Collection('Teacher', { idGeneration: 'MONGO' });

if (Meteor.isServer) {
    Meteor.methods({
        'Teacher.create': createTeacher,
        'Teacher.getAll': getTeachers,
        'Teacher.getByPage': getTeachersByPage,
        'Teacher.getByID': getTeacherByID,
        'Teacher.update': updateTeacher,
        'Teacher.delete': deleteTeacher,
        'Teacher.log': getTeachersByLog,
        'Teacher.seeByLog': getTeacherIDbyLog,
    });
    // public cho client subscribe
    Meteor.publish('Teacher.getAll.meteor', () => {
        return COLLECTION_Teacher.find({ isDeleted: false });
    });

    // public cho client subscribe
    Meteor.publish('Teacher.getByIDs.meteor', (ids) => {
        return COLLECTION_Teacher.find({
            isDeleted: false,
            _id: {
                $in: ids.map(e => new Meteor.Collection.ObjectID(e))
            }
        });
    });
}
//THÊM
function createTeacher(Teacher, accessToken = '') {
    let url = `${AUTH_Teacher}/`
    return httpDefault(METHOD.post, url, { token: accessToken });
}
//XEM HẾT
function getTeachers(options = {}, accessToken = '', extra) {
    let url = AUTH_Teacher;
    //let { driverBlockedType } = options;
    //if (driverBlockedType) url += `?driverBlockedType=${driverBlockedType}`
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO TRANG
function getTeachersByPage(accessToken = '', page = 1) {
    let url = `${AUTH_Teacher}/${page}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO ID
function getTeacherByID(TeacherID, accessToken = '') {
    //console.log(driverID, accessToken);
    let url = `${AUTH_Teacher}/${TeacherID}`;
    //console.log(url);

    return httpDefault(METHOD.get, url, { token: accessToken });
}
//UPDATE 
function updateTeacher(Teacher, accessToken = '') {
    let url = `${AUTH_Teacher}/${TeacherID}`
    return httpDefault(METHOD.put, url, { token: accessToken });
}

//XÓA
function deleteTeacher(TeacherID, accessToken = '') {
    let url = `${AUTH_Teacher}/${TeacherID}`
    return httpDefault(METHOD.del, url, { token: accessToken });
}

//LOG
function getTeachersByLog(accessToken = '', page = 1) {
    let url = `${AUTH_Teacher}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

//GET ID BY LOG
function getTeacherIDbyLog(accessToken = '', page = 1) {
    let url = `${AUTH_Teacher}/${TeacherID}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}