import {
    Meteor
} from 'meteor/meteor';

import {
    BASE,
    AUTH_PATH,
} from '../config'
import {
    METHOD,
    httpDefault
} from '../checkAPI'

const BASE_CARFUEL = `${BASE}/CarFuel`
const AUTH_CARFUEL = `${AUTH_PATH}/CarFuel`

if (Meteor.isServer) {
    Meteor.methods({
        'carFuel.getAll': getAllCarFuel,
        'carFuel.getByID': getCarFuelByID,
        'carFuel.getByPage': getCarFuelByPage,
        'carFuel.create': createCarFuel,
        'carFuel.update': updateCarFuel,
        'carFuel.delete': deleteCarFuel,
    });
}

function getAllCarFuel(accessToken = '') {
    let url = `${AUTH_CARFUEL}`
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    });
}

function getCarFuelByID(data, accessToken = '') {
    let url = `${AUTH_CARFUEL}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getCarFuelByPage(data, accessToken = '') {
    let url = `${AUTH_CARFUEL}/${data.page}?limit=${data.limit}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createCarFuel(data, accessToken = '') {
    let url = `${AUTH_CARFUEL}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}

function updateCarFuel(data, accessToken = '') {
    let url = `${AUTH_CARFUEL}/${data._id}`
    return httpDefault(METHOD.put, url, {
        body: data,
        token: accessToken
    });
}

function deleteCarFuel(data, accessToken = '') {
    let url = `${AUTH_CARFUEL}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}