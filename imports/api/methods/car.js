// Methods related to links

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { BASE, AUTH_PATH, } from '../config'
import { METHOD, httpDefault } from '../checkAPI'

const BASE_CAR = `${BASE}/Car`
const AUTH_CAR = `${AUTH_PATH}/Car`

// render data truc tiep tu mongodb
export const COLLECTION_CAR = new Mongo.Collection('Car', { idGeneration: 'MONGO' });

if (Meteor.isServer) {
    Meteor.methods({
        'car.create': createCar,
        'car.getAll': getCars,
        //'car.getNotAssignDriver': getCarNotAssignDriver,
        'car.getByPage': getCarsByPage,
        'car.getByDriver': getCarByDriver,
        'car.update': updateCar,
        //'car.updateStatus': updateCarStatus,
        'car.delete': deleteCar,
    });
    // public cho client subscribe
    Meteor.publish('car.getAll.meteor', () => {
        return COLLECTION_CAR.find({ isDeleted: false });
    });

    // public cho client subscribe
    Meteor.publish('car.getByIDs.meteor', (ids) => {
        return COLLECTION_CAR.find({
            isDeleted: false,
            _id: {
                $in: ids.map(e => new Meteor.Collection.ObjectID(e))
            }
        });
    });
}
//THÊM XE
function createCar(car, accessToken = '') {
    let url = `${AUTH_CAR}/`
    return httpDefault(METHOD.post, url, { token: accessToken });
}
//ĐẾM XE
function getCars(accessToken = '', options = {}) {
    let url = AUTH_CAR;
    let { driverBlockedType } = options;
    if (driverBlockedType) url += `?driverBlockedType=${driverBlockedType}`
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//LẤY DANH SÁCH XE
function getCarByDriver(driverID, accessToken = '') {
    //console.log(driverID, accessToken);
    let url = `${AUTH_CAR}/bydriver?driverID=${driverID}`;
    //console.log(url);

    return httpDefault(METHOD.get, url, { token: accessToken });
}
//LẤY XE THEO page
function getCarsByPage(accessToken = '', page = 1) {
    let url = `${AUTH_CAR}/${page}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//LẤY XE THEO IDs
//XÓA XE
function deleteCar(carID, accessToken = '') {
    let url = `${AUTH_CAR}/:carID([0-9a-fA-F]{24})`
    return httpDefault(METHOD.del, url, { token: accessToken });
}
//UPDATE XE
function updateCar(car, accessToken = '') {
    let url = `${AUTH_CAR}/:carID([0-9a-fA-F]{24})`
    return httpDefault(METHOD.put, url, { token: accessToken });
}



// lay danh sach car chua duoc gan tài xế