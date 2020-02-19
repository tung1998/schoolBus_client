// Methods related to links

import { Meteor } from 'meteor/meteor';

import { BASE, AUTH_PATH } from '../config';
import { httpDefault, METHOD } from '../checkAPI';

const BASE_CAR_MAINTENANCE = `${BASE}/CarMaintenance`
const AUTH_CAR_MAINTENANCE = `${AUTH_PATH}/CarMaintenance`

if (Meteor.isServer) {
    Meteor.methods({
        'carMaintenance.create': createCarMaintenance,
        'carMaintenance.getAll': getCarMaintenances,
        'carMaintenance.getMy': getMyCarMaintenances,
        'carMaintenance.getByCar': getCarMaintenanceByCar,
        'carMaintenance.getByTrip': getCarMaintenanceByTrip,
        'carMaintenance.getByPage': getCarMaintenancesByPage,
        'carMaintenance.update': updateCarMaintenance,
        'carMaintenance.delete': deleteCarMaintenance,
        'carMaintenance.getByDriver': getCarMaintenanceByDriverID,
        'carMaintenance.search': getCarMaintenanceSearch, // phân trang
    });
}
//XEM
function getCarMaintenances(accessToken) {
    let url = `${AUTH_CAR_MAINTENANCE}?extra=trip`
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//?
function getMyCarMaintenances(accessToken = '') {
    return httpDefault(METHOD.get, `${AUTH_CAR_MAINTENANCE}/me/1?extra=car,trip`, { token: accessToken });
}

//?
function getCarMaintenanceByCar({ carID, options }, accessToken = '') {
    let page = 1,
        limit = 100,
        date = '';
    if (options.page) page = options.page;
    if (options.limit) limit = options.limit;
    if (options.maintenanceDate) date = `&maintenanceDate=${options.maintenanceDate}`;
    let url = `${AUTH_CAR_MAINTENANCE}/getByCar?page=${page}&limit=${limit}${date}&carID=${carID}`;
    // console.log(url);
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//?
function getCarMaintenanceByTrip({ tripID }, accessToken = '') {
    let url = `${AUTH_CAR_MAINTENANCE}/getByTrip/${tripID}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//?
function getCarMaintenancesByPage(page, accessToken) {
    return httpDefault(METHOD.get, `${AUTH_CAR_MAINTENANCE}/${page}`, { token: accessToken });
}
//THÊM
function createCarMaintenance(carMaintenance, accessToken = '') {
    return httpDefault(METHOD.post, AUTH_CAR_MAINTENANCE, { token: accessToken });
}
//SỬA
function updateCarMaintenance(carMaintenance, accessToken = '') {
    return httpDefault(METHOD.put, `${AUTH_CAR_MAINTENANCE}/${carMaintenance._id}`, { token: accessToken });
}
//XÓA
function deleteCarMaintenance(carMaintenanceID, accessToken = '') {
    return httpDefault(METHOD.del, `${AUTH_CAR_MAINTENANCE}/${carMaintenance._id}`, { token: accessToken });
}


function getCarMaintenanceByDriverID(driverID, page, accessToken = '') {
    let url = `${AUTH_CAR_MAINTENANCE}/byDriver?driverID="${driverID}"&page=${page}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

/**
 * 
 * @param {Object} options dieu kien
 *                  options.page
 *                  options.limit
 * @param {string} accessToken token
 */

function getCarMaintenanceSearch(options, accessToken) {
    let url = `${AUTH_CAR_MAINTENANCE}/search?limit=${options.limit}&page=${options.page}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}