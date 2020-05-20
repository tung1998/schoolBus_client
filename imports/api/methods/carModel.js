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

const BASE_CARMODEL = `${BASE}/CarModel`
const AUTH_CARMODEL = `${AUTH_PATH}/CarModel`

if (Meteor.isServer) {
    Meteor.methods({
        'carModel.getAll': getAllCarModel,
        'carModel.getByID': getCarModelByID,
        'carModel.getByPage': getCarModelByPage,
        'carModel.create': createCarModel,
        'carModel.update': updateCarModel,
        'carModel.delete': deleteCarModel,
    });
}

function getAllCarModel(data, accessToken = '') {
    let url = `${AUTH_CARMODEL}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getCarModelByID(data, accessToken = '') {
    let url = `${AUTH_CARMODEL}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getCarModelByPage(data, accessToken = '') {
    let url = `${AUTH_CARMODEL}/${data.page}?limit=${data.limit}`
    if (data.options && data.options.length)
        data.options.forEach(item => {
            if (item.value) url += `&${encodeURIComponent(item.text)}=${encodeURIComponent(item.value)}`
        })
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createCarModel(data, accessToken = '') {
    let url = `${AUTH_CARMODEL}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}

function updateCarModel(data, accessToken = '') {
    let url = `${AUTH_CARMODEL}/${data._id}`
    return httpDefault(METHOD.put, url, {
        body: data,
        token: accessToken
    });
}

function deleteCarModel(data, accessToken = '') {
    let url = `${AUTH_CARMODEL}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}