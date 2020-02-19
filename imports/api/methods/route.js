import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';

import {
    BASE,
    AUTH_PATH
} from '../config'
import {
    httpDefault,
    METHOD
} from '../checkAPI';

const BASE_ROUTE = `${BASE}/Route`
const AUTH_ROUTE = `${AUTH_PATH}/Route`

// render data truc tiep tu mongodb
export const COLLECTION_ROUTE = new Mongo.Collection('Route', {
    idGeneration: 'MONGO'
});

if (Meteor.isServer) {
    Meteor.methods({
        'route.create': createRoute,
        'route.addCarStopPickup': addCarStopPickupRoute,
        'route.addCarStopTakeoff': addCarStopTakeoffRoute,
        'route.getAll': getRoutes,
        'route.getByID': getRouteByID,
        'route.getByPage': getRoutesByPage,
        'route.update': updateRoute,
        'route.delete': deleteRoute,
    });

    // public cho client subscribe
    Meteor.publish('route.getAll.meteor', () => {
        return COLLECTION_ROUTE.find({
            isDeleted: false
        });
    });
}

function getRoutes(accessToken = '', extra) {
    let url = AUTH_ROUTE + (extra ? ('?extra=' + extra) : '')
    return httpDefault(METHOD.get, url, {
        body: carStop,
        token: accessToken
    });
}


function getRouteByID(routeID, accessToken = '') {
    let url = `${AUTH_ROUTE}/${routeID}`
    return httpDefault(METHOD.get, url, {
        body: carStop,
        token: accessToken
    });
}


function getRoutesByPage(accessToken = '', page) {
    let url = `${AUTH_ROUTE}/${page}`;
    return httpDefault(METHOD.get, url, {
        body: carStop,
        token: accessToken
    });
}

function createRoute(route, accessToken = '') {
    let url = AUTH_ROUTE;
    return httpDefault(METHOD.post, url, {
        body: carStop,
        token: accessToken
    });
}

function addCarStopPickupRoute({
    routeID,
    carStop
}, accessToken = '') {
    let url = `${AUTH_ROUTE}/${routeID}/pickupCarStop`;
    // console.log(routeID, url, carStop);
    return httpDefault(METHOD.post, url, {
        body: carStop,
        token: accessToken
    });
}

function addCarStopTakeoffRoute({
    routeID,
    carStop
}, accessToken = '') {
    let url = `${AUTH_ROUTE}/${routeID}/takeoffCarStop`;
    // console.log(routeID, url, carStop);
    return httpDefault(METHOD.post, url, {
        body: carStop,
        token: accessToken
    });
}

function updateRoute(route, accessToken = '') {
    let url = `${AUTH_ROUTE}/${route._id}`;
    // console.log(routeID, url, carStop);
    return httpDefault(METHOD.put, url, {
        body: carStop,
        token: accessToken
    });
}

function deleteRoute(routeID, accessToken = '') {
    let url = `${AUTH_ROUTE}/${routeID}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    }).then(result => {
        return result
    })
}