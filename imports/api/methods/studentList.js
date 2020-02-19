// Methods related to links

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { BASE, AUTH_PATH, } from '../config'
import { METHOD, httpDefault } from '../checkAPI'

const BASE_StudentList = `${BASE}/StudentList`
const AUTH_StudentList = `${AUTH_PATH}/StudentList`

// render data truc tiep tu mongodb
export const COLLECTION_StudentList = new Mongo.Collection('StudentList', { idGeneration: 'MONGO' });

if (Meteor.isServer) {
    Meteor.methods({
        'StudentList.create': createStudentList,
        'StudentList.getAll': getStudentLists,
        'StudentList.getByPage': getStudentListsByPage,
        'StudentList.getByID': getStudentListByID,
        'StudentList.update': updateStudentList,
        'StudentList.delete': deleteStudentList,
        'StudentList.log': getStudentListsByLog,
        'StudentList.seeByLog': getStudentListIDbyLog,
    });
    // public cho client subscribe
    Meteor.publish('StudentList.getAll.meteor', () => {
        return COLLECTION_StudentList.find({ isDeleted: false });
    });

    // public cho client subscribe
    Meteor.publish('StudentList.getByIDs.meteor', (ids) => {
        return COLLECTION_StudentList.find({
            isDeleted: false,
            _id: {
                $in: ids.map(e => new Meteor.Collection.ObjectID(e))
            }
        });
    });
}
//THÊM
function createStudentList(StudentList, accessToken = '') {
    let url = `${AUTH_StudentList}/`
    return httpDefault(METHOD.post, url, { token: accessToken });
}
//XEM HẾT
function getStudentLists(options = {}, accessToken = '', extra) {
    let url = AUTH_StudentList;
    //let { driverBlockedType } = options;
    //if (driverBlockedType) url += `?driverBlockedType=${driverBlockedType}`
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO TRANG
function getStudentListsByPage(accessToken = '', page = 1) {
    let url = `${AUTH_StudentList}/${page}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO ID
function getStudentListByID(StudentListID, accessToken = '') {
    //console.log(driverID, accessToken);
    let url = `${AUTH_StudentList}/${StudentListID}`;
    //console.log(url);

    return httpDefault(METHOD.get, url, { token: accessToken });
}
//UPDATE 
function updateStudentList(StudentList, accessToken = '') {
    let url = `${AUTH_StudentList}/${StudentListID}`
    return httpDefault(METHOD.put, url, { token: accessToken });
}

//XÓA
function deleteStudentList(StudentListID, accessToken = '') {
    let url = `${AUTH_StudentList}/${StudentListID}`
    return httpDefault(METHOD.del, url, { token: accessToken });
}

//LOG
function getStudentListsByLog(accessToken = '', page = 1) {
    let url = `${AUTH_StudentList}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

//GET ID BY LOG
function getStudentListIDbyLog(accessToken = '', page = 1) {
    let url = `${AUTH_StudentList}/${StudentListID}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}