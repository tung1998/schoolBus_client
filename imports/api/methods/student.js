// Methods related to links

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { BASE, AUTH_PATH, } from '../config'
import { METHOD, httpDefault } from '../checkAPI'

const BASE_Student = `${BASE}/Student`
const AUTH_Student = `${AUTH_PATH}/Student`

// render data truc tiep tu mongodb
export const COLLECTION_Student = new Mongo.Collection('Student', { idGeneration: 'MONGO' });

if (Meteor.isServer) {
    Meteor.methods({
        'Student.create': createStudent,
        'Student.getAll': getStudents,
        'Student.getByPage': getStudentsByPage,
        'Student.getByID': getStudentByID,
        'Student.update': updateStudent,
        'Student.delete': deleteStudent,
        'Student.log': getStudentsByLog,
        'Student.seeByLog': getStudentIDbyLog,
    });
    // public cho client subscribe
    Meteor.publish('Student.getAll.meteor', () => {
        return COLLECTION_Student.find({ isDeleted: false });
    });

    // public cho client subscribe
    Meteor.publish('Student.getByIDs.meteor', (ids) => {
        return COLLECTION_Student.find({
            isDeleted: false,
            _id: {
                $in: ids.map(e => new Meteor.Collection.ObjectID(e))
            }
        });
    });
}
//THÊM
function createStudent(Student, accessToken = '') {
    let url = `${AUTH_Student}/`
    return httpDefault(METHOD.post, url, { token: accessToken });
}
//XEM HẾT
function getStudents(options = {}, accessToken = '', extra) {
    let url = AUTH_Student;
    //let { driverBlockedType } = options;
    //if (driverBlockedType) url += `?driverBlockedType=${driverBlockedType}`
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO TRANG
function getStudentsByPage(accessToken = '', page = 1) {
    let url = `${AUTH_Student}/${page}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO ID
function getStudentByID(StudentID, accessToken = '') {
    //console.log(driverID, accessToken);
    let url = `${AUTH_Student}/${StudentID}`;
    //console.log(url);

    return httpDefault(METHOD.get, url, { token: accessToken });
}
//UPDATE 
function updateStudent(Student, accessToken = '') {
    let url = `${AUTH_Student}/${StudentID}`
    return httpDefault(METHOD.put, url, { token: accessToken });
}

//XÓA
function deleteStudent(StudentID, accessToken = '') {
    let url = `${AUTH_Student}/${StudentID}`
    return httpDefault(METHOD.del, url, { token: accessToken });
}

//LOG
function getStudentsByLog(accessToken = '', page = 1) {
    let url = `${AUTH_Student}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

//GET ID BY LOG
function getStudentIDbyLog(accessToken = '', page = 1) {
    let url = `${AUTH_Student}/${StudentID}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}