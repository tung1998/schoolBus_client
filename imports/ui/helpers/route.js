import {Meteor} from "meteor/meteor";

export{
    getRoutes,
    getRouteByID,
    addCarStopPickupToRoute, addCarStopTakeoffToRoute,
}

function getRoutes(accessToken = '', extra = 'carStop') {
    return new Promise((resolve, reject) => {
        Meteor.call('route.getAll', accessToken, extra, (err, result) => {
            resolve(result);
        });
    });
}

function getRouteByID(routeID, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('route.getByID', routeID, accessToken, (err, result) => {
            resolve(result);
        });
    });
}

function addCarStopPickupToRoute({routeID, carStop}, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('route.addCarStopPickup', {routeID, carStop}, accessToken, (err, result) => {
            if(result && result.error)
                reject(result);
            else resolve(result);
        });
    });
}

function addCarStopTakeoffToRoute({routeID, carStop}, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('route.addCarStopTakeoff', {routeID, carStop}, accessToken, (err, result) => {
            if(result && result.error)
                reject(result);
            else resolve(result);
        });
    });
}