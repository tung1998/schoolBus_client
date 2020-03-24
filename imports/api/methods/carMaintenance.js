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

const BASE_CARMAINTENANCE = `${BASE}/CarMaintenance`
const AUTH_CARMAINTENANCE = `${AUTH_PATH}/CarMaintenance`

if (Meteor.isServer) {
    Meteor.methods({
        'carMaintenance.getAll': getAllCarMaintenance,
        'carMaintenance.getByID': getCarMaintenanceByID,
        'carMaintenance.getByPage': getCarMaintenanceByPage,
        'carMaintenance.create': createCarMaintenance,
        'carMaintenance.update': updateCarMaintenance,
        'carMaintenance.delete': deleteCarMaintenance,
    });
}

function getAllCarMaintenance(accessToken = '') {
    let url = `${AUTH_CARMAINTENANCE}`
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    });
}

function getCarMaintenanceByID(data, accessToken = '') {
    let url = `${AUTH_CARMAINTENANCE}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getCarMaintenanceByPage(data, accessToken = '') {
    let url = `${AUTH_CARMAINTENANCE}/${data.page}?limit=${data.limit}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createCarMaintenance(data, accessToken = '') {
    let url = `${AUTH_CARMAINTENANCE}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}

function updateCarMaintenance(data, accessToken = '') {
    let url = `${AUTH_CARMAINTENANCE}/${data._id}`
    return httpDefault(METHOD.put, url, {
        body: data,
        token: accessToken
    });
}

function deleteCarMaintenance(data, accessToken = '') {
    let url = `${AUTH_CARMAINTENANCE}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}