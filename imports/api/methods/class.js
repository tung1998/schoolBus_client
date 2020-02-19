// Methods related to links

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { BASE, AUTH_PATH, } from '../config'
import { METHOD, httpDefault } from '../checkAPI'

const BASE_Class = `${BASE}/Class`
const AUTH_Class = `${AUTH_PATH}/Class`

// render data truc tiep tu mongodb
export const COLLECTION_Class = new Mongo.Collection('Class', { idGeneration: 'MONGO' });

if (Meteor.isServer) {
    Meteor.methods({
        'Class.create': createClass,
        'Class.getAll': getClasss,
        'Class.getByPage': getClasssByPage,
        'Class.getByID': getClassByID,
        'Class.update': updateClass,
        'Class.delete': deleteClass,
        'Class.log': getClasssByLog,
        'Class.seeByLog': getClassIDbyLog,
    });
    // public cho client subscribe
    Meteor.publish('Class.getAll.meteor', () => {
        return COLLECTION_Class.find({ isDeleted: false });
    });

    // public cho client subscribe
    Meteor.publish('Class.getByIDs.meteor', (ids) => {
        return COLLECTION_Class.find({
            isDeleted: false,
            _id: {
                $in: ids.map(e => new Meteor.Collection.ObjectID(e))
            }
        });
    });
}
//THÊM
function createClass(Class, accessToken = '') {
    let url = `${AUTH_Class}/`
    return httpDefault(METHOD.post, url, { token: accessToken });
}
//XEM HẾT
function getClasss(options = {}, accessToken = '', extra) {
    let url = AUTH_Class;
    //let { driverBlockedType } = options;
    //if (driverBlockedType) url += `?driverBlockedType=${driverBlockedType}`
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO TRANG
function getClasssByPage(accessToken = '', page = 1) {
    let url = `${AUTH_Class}/${page}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//XEM THEO ID
function getClassByID(ClassID, accessToken = '') {
    //console.log(driverID, accessToken);
    let url = `${AUTH_Class}/${ClassID}`;
    //console.log(url);

    return httpDefault(METHOD.get, url, { token: accessToken });
}
//UPDATE 
function updateClass(Class, accessToken = '') {
    let url = `${AUTH_Class}/${ClassID}`
    return httpDefault(METHOD.put, url, { token: accessToken });
}

//XÓA
function deleteClass(ClassID, accessToken = '') {
    let url = `${AUTH_Class}/${ClassID}`
    return httpDefault(METHOD.del, url, { token: accessToken });
}

//LOG
function getClasssByLog(accessToken = '', page = 1) {
    let url = `${AUTH_Class}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

//GET ID BY LOG
function getClassIDbyLog(accessToken = '', page = 1) {
    let url = `${AUTH_Class}/${ClassID}/Log`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}