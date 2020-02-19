function getDrivers(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('driver.getAll', accessToken, (err, result) => {
            // if(result && result.error) reject(result);
            resolve(result);
        });
    });
}

function getDriverByID(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('driver.getByID', accessToken, (err, result) => {
            resolve(result);
        });
    });
}

function getDriverTripsHistory(date, status, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('driver.getTripHistory', date, status, accessToken, (err, result) => {
            if (err) reject(err)
            else if (result && result.error) reject(result)
            else resolve(result);
        });
    });
}

function getDriversNotBlock({
    page,
    limit
}, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('driver.getNotBlock', {
            page,
            limit
        }, accessToken, (err, result) => {
            if (err) reject(err)
            else if (result && result.error) reject(result)
            else resolve(result);
        });
    });
}

function getDriversNotAssignCar(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('driver.getNotAssignCar', accessToken, (err, result) => {
            if (err) reject(err)
            else if (result && result.error) reject(result)
            else resolve(result);
        });
    });
}

function getDriversByPage({
    page,
    limit
}, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('driver.getByPage', {
            page,
            limit
        }, accessToken, (err, result) => {
            if (result && result.error) {
                reject(result)
            } else resolve(result);
        });
    });
}

function createDriver(driver, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('driver.create', driver, accessToken, (err, result) => {
            resolve(result);
        });
    });
}

function updateDriver(driver, accessToken = '', callback) {
    Meteor.call('driver.update', driver, accessToken, callback)
}

function deleteDriver(driverID, accessToken = '', callback) {
    return new Promise((resolve, reject) => {
        Meteor.call('driver.delete', driverID, accessToken, (err, result) => {
            if (result && result.error) {
                reject(result);
            } else resolve(result);
        });
    });
}

function getDriversByIDsMeteor(driverIDs, extra) {
    let query = {
        isDeleted: false,
        _id: {
            $in: driverIDs.map(e => new Meteor.Collection.ObjectID(e))
        }
    }
    // console.log(query);
    let drivers = COLLECTION_DRIVER.find(query)
    if (drivers.count() == 0) return [];
    if (!extra) return drivers.fetch();
    return addExtra(drivers.fetch(), extra);
}

/**
 * Add Extra
 * @param {(Object[]|Object)} drivers
 * @param {String} extra
 * @return {Array}
 */
function addExtra(drivers, extra) {
    extra = extra.split(',')

    if (Array.isArray(drivers)) {
        let userIDs = []
        drivers.forEach(({
            userID
        }) => {
            if (extra.includes('user') && userID != null) {
                userIDs.push(userID)
            }
        })
        Meteor.subscribe('user.getByIDs.meteor', userIDs);
        let users = getUsersByIDsMeteor(userIDs)
        drivers = drivers.map(currentValue => {
            if (users != undefined && currentValue.userID != null) {
                currentValue.user = users.find(element => element._id._str == currentValue.userID)
            }
            return currentValue;
        })
        return drivers
    }
}

function getDriverStatisticBill(startDate, endDate, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('driver.getStatisticBill', startDate, endDate, accessToken, (err, result) => {
            if (err) reject(err)
            else if (result && result.error) reject(result)
            else resolve(result);
        });
    });
}

function getAggregateInMonth(year,month, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('driver.getAggregateInMonth', year, month, accessToken, (err, result) => {
            if (err) reject(err)
            else if (result && result.error) reject(result)
            else resolve(result);
        });
    });
}

function getNoLenhInMonth(year,month, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('driver.getNoLenhInMonth', year, month, accessToken, (err, result) => {
            if (err) reject(err)
            else if (result && result.error) reject(result)
            else resolve(result);
        });
    });
}

function getTongHopInMonth(year,month, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('driver.getTongHopInMonth', year, month, accessToken, (err, result) => {
            if (err) reject(err)
            else if (result && result.error) reject(result)
            else resolve(result);
        });
    });
}

export {
    getDrivers,
    getDriverByID,
    getDriversNotBlock,
    getDriversNotAssignCar,
    getDriversByPage,
    createDriver,
    // uploadImageDriver,
    deleteDriver,
    updateDriver,
    getDriversByIDsMeteor,
    getDriverTripsHistory,
    getDriverStatisticBill,
    getAggregateInMonth,
    getNoLenhInMonth,
    getTongHopInMonth
}
import {
    USER_TYPE,
} from '../components/variableConst'

// import collection mongoDB
import {
    COLLECTION_DRIVER
} from '/imports/api/methods/driver.js';

import {
    getUserByIDMeteor,
    getUsersByIDsMeteor
} from './user';