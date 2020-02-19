// Methods related to links

import { Meteor } from 'meteor/meteor';

import { BASE, AUTH_PATH } from '../config';
import { httpDefault, METHOD } from '../checkAPI';

const BASE_CAR_FUEL = `${AUTH_PATH}/CarFuel`

if (Meteor.isServer) {
    Meteor.methods({
        'carFuel.create': createCarFuel,
        'carFuel.getAll': getCarFuels,
        'carFuel.getMy': getMyCarFuels,
        'carFuel.getByCar': getCarFuelByCar,
        'carFuel.getByPage': getCarFuelsByPage,
        'carFuel.update': updateCarFuel,
        'carFuel.delete': deleteCarFuel,
        'carFuel.search': getCarFuelSearch, // phân trang
    });
}
//XEM
function getCarFuels(accessToken = '') {
    return httpDefault(METHOD.get, BASE_CAR_FUEL, { token: accessToken });
}
//?
function getMyCarFuels(accessToken = '') {
    return httpDefault(METHOD.get, `${BASE_CAR_FUEL}/me/1`, { token: accessToken });
}
//?
function getCarFuelByCar({ carID, options }, accessToken = '') {
    let page = 1,
        limit = 100,
        date = '';
    if (options.page) page = options.page;
    if (options.limit) limit = options.limit;
    if (options.date) date = `&date=${options.date}`;
    let url = `${BASE_CAR_FUEL}/getByCar/${page}?limit=${limit}${date}&carID=${carID}`;
    // console.log(url);
    return httpDefault(METHOD.get, url, { token: accessToken });
}
//?
function getCarFuelsByPage(accessToken = '', page = 1) {
    return httpDefault(METHOD.get, `${BASE_CAR_FUEL}/${page}`, { token: accessToken });
}
//THÊM
function createCarFuel(carFuel, accessToken = '') {
    return httpDefault(METHOD.push, BASE_CAR_FUEL, { token: accessToken });
}
//UPDATE`${BASE_CAR_FUEL}/${carFuel._id}`
function updateCarFuel(carFuel, accessToken = '') {
    return httpDefault(METHOD.put, `${BASE_CAR_FUEL}/${carFuel._id}`, { token: accessToken });
}
//XÓA
function deleteCarFuel(carFuelID, accessToken = '') {
    return httpDefault(METHOD.del, `${BASE_CAR_FUEL}/${carFuel._id}`, { token: accessToken });
}

/**
 * 
 * @param {Object} options dieu kien
 *                  options.page
 *                  options.limit
 * @param {string} accessToken token
 */
//TÌM KIẾM
function getCarFuelSearch(options, accessToken) {
    let url = `${BASE_CAR_FUEL}/search?limit=${options.limit}&page=${options.page}&startDate=${options.startDate}&endDate=${options.endDate}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}