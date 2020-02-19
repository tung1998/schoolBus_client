function getCarMaintenances(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carMaintenance.getAll', accessToken, (err, result) => {
            resolve(result);
        });
    });
}

function getCarMaintenanceByCar({
    carID,
    options
}, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carMaintenance.getByCar', {
            carID,
            options
        }, accessToken, (err, result) => {
            if (result && result.error) {
                reject(result);
            } else resolve(result);
        });
    });
}

function getCarMaintenanceByTrip({
    tripID
}, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carMaintenance.getByTrip', {
            tripID
        }, accessToken, (err, result) => {
            if (result && result.error) reject(result);
            else if (err) reject(err);
            resolve(result);
        });
    });
}

function getMyCarMaintenances(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carMaintenance.getMy', accessToken, (err, result) => {
            resolve(result);
        });
    });
}

function getCarMaintenancesByPage(accessToken = '', page = 1) {
    return new Promise((resolve, reject) => {
        Meteor.call('carMaintenance.getByPage', page, accessToken, (err, result) => {
            resolve(result);
        });
    });
}

function createCarMaintenance(input, accessToken = '', callback) {
    Meteor.call('carMaintenance.create', input, accessToken, callback);
}

function updateCarMaintenance(input, accessToken = '', callback) {
    Meteor.call('carMaintenance.update', input, accessToken, callback);
}

function updateCarMaintenanceAsync(input, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carMaintenance.update', input, accessToken, (err, result) => {
            if (result && result.error) reject(result)
            else if (err) reject(err);
            else resolve(result);
        });
    });
}

function deleteCarMaintenance(carMaintenanceID, accessToken = '', callback) {
    return new Promise((resolve, reject) => {
        Meteor.call('carMaintenance.delete', carMaintenanceID, accessToken, (err, result) => {
            if (result && result.error) reject(result)
            else if (err) reject(err);
            else resolve(result);
        });
    });
}

function getCarMaintenanceByDriverID(driverID, page, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carMaintenance.delete', driverID, page, accessToken, (err, result) => {
            if (result && result.error) reject(result)
            else if (err) reject(err);
            else resolve(result);
        });
    })
}


function getCarMaintenanceSearch(options, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carMaintenance.search', options, accessToken, (err, result) => {
            if (result && result.error) reject(result)
            else if (err) reject(err);
            else resolve(result);
        });
    })
}

import {
    Meteor
} from "meteor/meteor"

export {
    getCarMaintenances,
    getCarMaintenanceByCar,
    getCarMaintenanceByTrip,
    getMyCarMaintenances,
    getCarMaintenancesByPage,
    deleteCarMaintenance,
    createCarMaintenance,
    updateCarMaintenance,
    updateCarMaintenanceAsync,
    getCarMaintenanceByDriverID,
    getCarMaintenanceSearch,
}