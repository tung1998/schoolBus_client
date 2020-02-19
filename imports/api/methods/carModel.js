// Methods related to links

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import {
    BASE,
    AUTH_PATH,
} from '../config'

const BASE_CAR_MODEL = `${BASE}/CarModel`
const AUTH_CAR_MODEL = `${AUTH_PATH}/CarModel`

// render data truc tiep tu mongodb
export const COLLECTION_CARMODEL = new Mongo.Collection('CarModel', { idGeneration: 'MONGO' });

if (Meteor.isServer) {
    Meteor.methods({
        'carModel.create': createCarModel,
        'carModel.getAll': getCarModels,
        'carModel.getByID': getCarModelByID,
        'carModel.getByPage': getCarModelsByPage,
        'carModel.update': updateCarModel,
        'carModel.delete': deleteCarModel,
    });
    // public cho client subscribe
    Meteor.publish('carModel.getAll.meteor', () => {
        return COLLECTION_CARMODEL.find({ isDeleted: false });
    });

    // public cho client subscribe
    Meteor.publish('carModel.getByIDs.meteor', (ids) => {
        return COLLECTION_CARMODEL.find({
            isDeleted: false,
            _id: {
                $in: ids.map(e => new Meteor.Collection.ObjectID(e))
            }
        });
    });
}
//XEM
function getCarModels(accessToken = '') {
    return httpDefault(METHOD.get, AUTH_CAR_MODEL, { token: accessToken });
}
//XEM THEO ID
function getCarModelByID(carModelID, accessToken = '') {
    return httpDefault(METHOD.get, `${AUTH_CAR_MODEL}/${carModelID}`, { token: accessToken });
}
//XEM THEO TRANG
function getCarModelsByPage(accessToken = '', page = 1) {
    return httpDefault(METHOD.get, `${AUTH_CAR_MODEL}/${page}`, { token: accessToken });
}
//THÊM
function createCarModel(carModel, accessToken = '') {
    return httpDefault(METHOD.post, AUTH_CAR_MODEL, { token: accessToken });
}
//SỬA
function updateCarModel(carModel, accessToken = '') {
    return httpDefault(METHOD.put, `${AUTH_CAR_MODEL}/${carModelID}`, { token: accessToken });
}

function deleteCarModel(carModelID, accessToken = '') {
    return httpDefault(METHOD.del, `${AUTH_CAR_MODEL}/${carModelID}`, { token: accessToken });
}