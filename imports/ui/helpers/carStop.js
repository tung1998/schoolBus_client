
import {
    computeDistanceBetween, newLatLng,
} from '../../ui/helpers/plugins/gmaps/gmaps'

import {
    getDistanceFromLatLonInKm
} from '../../ui/components/functions'

export{
    getCarStops,
    getCarStopByPage,
    getNormalCarStops,
    getRequireCarStops,
    getTransitCarStops,
    getCarStopByID,
    getCarStopsBySearch,
    createCarStop,
    updateCarStop,
    deleteCarStop,
    getByTypeInRouteCarStop,
    getByTypeInRouteCarStopLimit,
}

function getCarStops(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carStop.getAll', accessToken, (err, result) => {
            // if(result.error) reject(result);
            resolve(result);
        });
    });
}

function getCarStopByPage({page, limit, options}, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carStop.getByPage', {page, limit, options}, accessToken, (err, result) => {
            if(result && result.error) reject(result);
            resolve(result);
        });
    });
}

function getNormalCarStops(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carStop.getNormalCarStops', accessToken, (err, result) => {
            // if(result.error) reject(result);
            resolve(result);
        });
    });
}

function getRequireCarStops(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carStop.getRequireCarStops', accessToken, (err, result) => {
            // if(result.error) reject(result);
            resolve(result);
        });
    });
}

function getTransitCarStops(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carStop.getTransitCarStops', accessToken, (err, result) => {
            // if(result.error) reject(result);
            resolve(result);
        });
    });
}

function getCarStopByID(carStopID, accessToken= '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carStop.getByID', carStopID, accessToken, (err, result) => {
            if (result && result.error) {
                reject(result);
            } else if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function getCarStopsBySearch(name, address, accessToken= '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carStop.getBySearch', name, address, accessToken, (err, result) => {
            // if(result.error) reject(result);
            if (result && result.error) {
                reject(result);
            } else if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function deleteCarStop(carStopID, accessToken = '', callback){
    Meteor.call('carStop.delete', carStopID, accessToken, callback);
}

function createCarStop(input, accessToken= '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carStop.create', input, accessToken, (err, result) => {
            if(err) reject(err)
            else if (result && result.error) reject(result)
            else resolve(result);
        });
    });
}

function updateCarStop(input, accessToken= '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carStop.update', input, accessToken, (err, result) => {
            if(err) reject(err)
            else if (result && result.error) reject(result)
            else resolve(result);
        });
    });
}

function getByTypeInRouteCarStop(options, accessToken= '') {
    return new Promise((resolve, reject) => {
        Meteor.call('carStop.getByTypeInRoute', options, accessToken, (err, result) => {
            if (result && result.error) {
                reject(result);
            } else if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function getByTypeInRouteCarStopLimit({type, routeID, lat, lng}, accessToken= '') {
    // console.log(type, routeID);
    return getByTypeInRouteCarStop({type, routeID}, accessToken ).then(results => {
        results.sort((a, b) => {
            let da = computeDistanceBetween(newLatLng(a.location), newLatLng(lat, lng));
            da = Number(da.toFixed(3));
            let db = computeDistanceBetween(newLatLng(b.location), newLatLng(lat, lng));
            db = Number(db.toFixed(3));
            return da - db;
        });
        return results[0];
    });
}
