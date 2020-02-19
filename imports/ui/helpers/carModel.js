function getCarModels(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carModel.getAll', accessToken, (err, result) => {
            // if(result.error) reject(result);
            resolve(result);
        });
    });
}

function getCarModelByID(carModelID, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carModel.getByID', carModelID, accessToken, (err, result) => {
            resolve(result);
        });
    });
}

function getCarModelsByPage(accessToken = '', page = 1) {
    return new Promise((resolve, reject) => {
        Meteor.call('carModel.getByPage', accessToken, page, (err, result) => {
            resolve(result);
        });
    });
}

function createCarModel(carModel, accessToken = '', callback) {
    Meteor.call('carModel.create', carModel, accessToken, callback);
}

function updateCarModel(carModel, accessToken = '', callback) {
    Meteor.call('carModel.update', carModel, accessToken, callback);
}

function deleteCarModel(carModelID, accessToken = '', callback) {
    Meteor.call('carModel.delete', carModelID, accessToken, callback);
}


/**
 * Hàm lấy CarModel theo ID
 * @param {String} carModelID
 * @return {Object}
 */
function getCarModelByIDMeteor(carModelID) {
    return COLLECTION_CARMODEL
        .find({ isDeleted: false, _id: new Meteor.Collection.ObjectID(carModelID) })
}

/**
 * Hàm lấy tất cả CarModel theo nhiều ID
 * @param {Array} carModelIDs
 * @return {Array}
 */
function getCarModelsByIDsMeteor(carModelIDs) {
    return COLLECTION_CARMODEL
        .find({ isDeleted: false, _id: { $in: carModelIDs.map(e => new Meteor.Collection.ObjectID(e)) } })
        .fetch()
}

export {
    getCarModels,
    getCarModelByID,
    getCarModelsByPage,
    createCarModel,
    updateCarModel,
    deleteCarModel,
    getCarModelByIDMeteor,
    getCarModelsByIDsMeteor,
}

// import collection mongoDB
import {
    COLLECTION_CARMODEL
} from '/imports/api/methods/carModel.js';