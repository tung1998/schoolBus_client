function getCarFuels(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carFuel.getAll', accessToken, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        });
    })
}


function getMyCarFuels(accessToken = '', callback) {
    return new Promise((resolve, reject) => {
        Meteor.call('carFuel.getMy', accessToken, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        });
    })
}

function getCarFuelByCar({
    carID,
    options
}, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carFuel.getByCar', {
            carID,
            options
        }, accessToken, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        });
    })
}

function getCarFuelsByPage(page, callback) {
    Meteor.call('carFuel.getByPage', page, callback);
}

function createCarFuel(input, accessToken = '', callback) {
    Meteor.call('carFuel.create', input, accessToken, callback);
}

function updateCarFuel(input, accessToken = '', callback) {
    Meteor.call('carFuel.update', input, accessToken, callback);
}

function updateCarFuelAsync(input, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carFuel.update', input, accessToken, (err, result) => {
            if (result && result.error) reject(result)
            else if (err) reject(err);
            else resolve(result);
        });
    });
}

function deleteCarFuel(carFuelID, accessToken = '', callback) {
    return new Promise((resolve, reject) => {
        Meteor.call('carFuel.delete', carFuelID, accessToken, (err, result) => {
            if (result && result.error) reject(result)
            else if (err) reject(err);
            else resolve(result);
        });
    });
}

function getCarFuelSearch(options, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carFuel.search', options, accessToken, (err, result) => {
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
    getCarFuels,
    getMyCarFuels,
    getCarFuelByCar,
    getCarFuelsByPage,
    deleteCarFuel,
    createCarFuel,
    updateCarFuel,
    updateCarFuelAsync,
    getCarFuelSearch,
}