//THÊM
function createStudentList(StudentList, accessToken = '', callback) {
    Meteor.call('StudentList.create', StudentList, accessToken, callback)
}

//XEM HẾT
function getStudentList(accessToken = '', { driverBlockedType = 'all' } = {}) {
    return new Promise((resolve, reject) => {
        Meteor.call('StudentList.getAll', accessToken, { driverBlockedType }, (err, result) => {
            // if(result.error) reject(result);
            resolve(result);
        });
    });
}

//XEM THEO TRANG
function getStudentListsByPage(accessToken = '', page = 1) {
    return new Promise((resolve, reject) => {
        Meteor.call('StudentList.getByPage', accessToken, page, (err, result) => {
            resolve(result);
        });
    });
}

//XEM THEO ID
function getStudentListByID(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('StudentList.getByID', accessToken, (err, result) => {
            resolve(result);
        });
    });
}

//UPDATE
function updateStudentList(StudentList, accessToken = '', callback) {
    Meteor.call('StudentList.update', StudentList, accessToken, callback)
}

//XÓA
function deleteStudentList(StudentListID, accessToken = '', callback) {
    Meteor.call('StudentList.delete', StudentListID, accessToken, callback)
}
//****************************************************
/*function getCarNotAssignDriver(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('car.getNotAssignDriver', accessToken, (err, result) => {
            if (result && result.error) reject(result);
            resolve(result);
        });
    });
}

function getCarByDriver(driverID, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('car.getByDriver', driverID, accessToken, (err, result) => {
            if (result && result.error) reject(result);
            resolve(result);
        });
    });
}
*/
/**
 * Hàm lấy Car theo ID
 * @param {String} carID
 * @return {Object}
 */
function getCarsByIDMeteor(carID) {
    return COLLECTION_CAR
        .find({
            isDeleted: false,
            _id: new Meteor.Collection.ObjectID(carID)
        })
}

/**
 * Hàm lấy tất cả Car theo nhiều ID
 * @param {Array} carIDs
 * @return {Array}
 */
function getCarsByIDsMeteor(carIDs, extra) {
    let query = {
        isDeleted: false,
        _id: {
            $in: carIDs.map(e => new Meteor.Collection.ObjectID(e))
        }
    }

    let cars = COLLECTION_CAR.find(query)
    if (cars.count() == 0) return [];
    if (!extra) return cars.fetch();
    return addExtra(cars.fetch(), extra);
}

/**
 * Add Extra
 * @param {(Object[]|Object)} cars
 * @param {String} extra
 * @return {Array||Object}
 */
/*function addExtra(cars, extra) {
    extra = extra.split(',')
        // console.log(Array.isArray(cars), cars.length)
    if (Array.isArray(cars)) {
        let carModelIDs = [],
            driverIDs = [];
        cars.forEach(({
            carModelID,
            driverID
        }) => {
            if (extra.includes('carModel') && carModelID != null) {
                carModelIDs.push(carModelID);
            }
            if (extra.includes('carModel') && driverID != null) {
                driverIDs.push(driverID);
            }
        })
        let carModels = getCarModelsByIDsMeteor(carModelIDs);
        let drivers = getDriversByIDsMeteor(driverIDs);
        cars = cars.map(currentValue => {
            if (carModels != undefined && currentValue.carModelID != null) {
                currentValue.carModel = carModels.find(element => element._id._str == currentValue.carModelID);
            }
            if (drivers != undefined && currentValue.driverID != null) {
                currentValue.driver = drivers.find(element => element._id._str == currentValue.driverID);
            }
            return currentValue;
        })
        return cars;
    }
}
*/

export {
    getStudentLists,
    //getCarNotAssignDriver,
    getStudentListByID,
    getStudentListsByPage,
    //getCarByDriver,
    createStudentList,
    updateStudentList,
    deleteStudentList,
    //getCarsByIDMeteor,
    //getCarsByIDsMeteor,
}

// import collection mongoDB
import {
    COLLECTION_StudentList
} from '/imports/api/methods/car.js';

/*import {
    getCarModelsByIDsMeteor,
    getCarModelByIDMeteor
} from './carModel';

import {
    // meteor,
    getDriversByIDsMeteor,
} from './driver';*/