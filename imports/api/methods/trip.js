import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';

import {
    BASE,
    AUTH_PATH
} from '../config';
import {
    isStatusCodeError,
    msgError,
    httpDefault,
    METHOD
} from '../checkAPI';
import {
    capitalizeFirstLetter,
    formatDate
} from '../../ui/components/functions';

import {
    COLLECTION_CUSTOMERTRIP
} from './customerTrip';

import {
    updateTask
} from './task'
const BASE_TRIP = `${BASE}/Trip`
const AUTH_TRIP = `${AUTH_PATH}/Trip`

// render data truc tiep tu mongodb
export const COLLECTION_TRIP = new Mongo.Collection('Trip', {
    idGeneration: 'MONGO'
});



if (Meteor.isServer) {
    Meteor.methods({
        'trip.getAll': getTrips,
        'trip.getFuture': getFutureTrips,
        'trip.getByID': getTripByID,
        'trip.getDataByID': getTripDataByTripID,
        'trip.getByRouteID': getTripByRouteID,
        'trip.getFutureByRouteID': getFutureTripByRouteID,
        'trip.getFutureByDriverID': getFutureTripByDriverID,
        'trip.getHistoryByDriverID': getTripHistoryByDriverID,
        'trip.getHistoryByDate': getTripHistoryByDate,
        'trip.getByRouteIDOneHour': getTripByRouteIDOneHour,
        'trip.getByPage': getTripsByPage,
        'trip.countByCarModel': countTripByCarModel,
        'trip.create': createTrip,
        'trip.update': updateTrip,
        'trip.updateStatus': updateStatusTrip,
        'trip.updateLimit': updateLimitTrip,
        'trip.delete': deleteTrip,
        'trip.find': findTrip,
        'trip.getByCarID': findTripbyCarID,
        'trip.cancel': cancelTrip,
        'trip.getTodayTrips': getTodayTrips,
        'trip.dayInit': initTripInDay,
        'trip.getByDate': getTripsByDate,
        'trip.getByDateSort': getTripsByDateSort,
        'trip.getCurrent': getCurrentTrip,
        'trip.getSearchTripsByPage': getSearchTripsByPage,
        'trip.getFilterLimit': getFilterLimit,
        'trip.syncAssignCar': syncAssignCarToTrip,
        'trip.seatAnalysis.byTripID': seatAnalysisTripByTripID,
        'trip.getTripsStatistic': getTripsStatistic,
        'trip.getFutureByCarStop': getTripsFutureByCarStop,
        'trip.getLog': getTripLog,
        'trip.updatePayment': updateTripsPayment,
        'trip.getCustomerTrip': getCustomerTripInTrip,
        'trips.getCustomerTrip': getCustomerTripInTrips,
        'trip.updateEndTrip': updateEndTrip,
        'trip.transitDriver': transitDriver,
        'trip.revertTransitDriver': revertTransitDriver,
    });

    // public cho client subscribe
    Meteor.publish('trip.getAll.meteor', () => {
        return COLLECTION_TRIP.find({
            isDeleted: false
        });
    });
    Meteor.publish('trip.getByIDs.meteor', (ids) => {
        // console.log(ids);
        return COLLECTION_TRIP.find({
            isDeleted: false,
            _id: {
                $in: ids.map(e => new Meteor.Collection.ObjectID(e))
            }
        });
    });
    Meteor.publish('trip.filter.meteor', (startTime, endTime, options) => {
        let q = {
            isDeleted: false,
            startTime: {
                $gte: startTime,
                $lt: endTime
            }
        }
        if (options && options.routeID) q.routeID = options.routeID;
        return COLLECTION_TRIP.find(q);
    });
}


function getTrips(accessToken = '', extra = '') {
    let url = AUTH_TRIP;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function getTodayTrips(accessToken = '', extra = '') {
    let day = new Date()
    day.setHours(0)
    day.setMinutes(0)
    let start = day.getTime()
    day.setDate(day.getDate() + 1)
    let end = day.getTime()
    let url = `${AUTH_TRIP}/byTime/${start}-${end}/1?extra=${extra}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function getFutureTrips(accessToken = '', extra = '') {
    let url = `${AUTH_TRIP}/future?extra=${extra}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

export function getTripByID(tripID, accessToken = '', extra = '') {
    let url = `${AUTH_TRIP}/${tripID}?extra=${extra}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}
//lấy dữ liệu khách hàng và chi phí chuyến đi
export function getTripDataByTripID(tripID, accessToken = '', extra = '') {
    let url = `${AUTH_TRIP}/tripdata/${tripID}?extra=${extra}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function getTripByRouteID(routeID, accessToken = '', extra = '', options = {}) {
    let {
        start,
        finish,
        sortBy,
        sortType,
        status
    } = options;
    let url = `${AUTH_TRIP}/byRoute?routeID=${routeID}&extra=${extra}`;
    if (start && finish) url += `&start=${start}&finish=${finish}`;
    if (sortBy && sortType) url += `&sortBy=${sortBy}&sortType=${sortType}`;
    if (status) url += `&status=${status}`;

    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getFutureTripByRouteID(routeID, accessToken, options, page, limit, extra = '') {
    let url = `${AUTH_TRIP}/byRoute?routeID=${routeID}&future=1&page=${page}&limit=${limit}&sortBy=${options.sortBy}&sortType=${options.sortType}&extra=${extra}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function getTripByRouteIDOneHour(routeID, startTime, accessToken = '', extra = '') {
    let url = `${AUTH_TRIP}/byRoute?routeID=${routeID}&startTime=${startTime}&extra=${extra}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function getTripsByPage(accessToken = '', page = 1, extra = '') {
    let url = `${AUTH_TRIP}/${page}?extra=${extra}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function createTrip(trip, accessToken = '') {
    let url = AUTH_TRIP;
    return httpDefault(METHOD.post, url, {
        token: accessToken
    })
}

function cancelTrip(trip, accessToken = '') {
    let tripID = trip._id;
    let url = `${AUTH_TRIP}/cancel`;
    let body = {
        tripID
    };
    console.log(trip);
    return httpDefault(METHOD.post, url, {
        body,
        token: accessToken
    }).then(result => {
        updateTask('Trip', tripID, formatDate(trip.startTime))
        return result
    })
}

function findTrip(trip, accessToken = '', extra = '') {
    let url = `${AUTH_TRIP}/find?extra=${extra}`;
    // console.log(url);
    return httpDefault(METHOD.post, url, {
        body: trip,
        token: accessToken
    });
}

function findTripbyCarID(carID, startTime, accessToken = '', extra = '') {
    let url = `${AUTH_TRIP}/byCar?carID=${carID}&startTime=${startTime}&extra=${extra}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function getTripsByDate(date, accessToken = '', extra = '') {
    let url = `${AUTH_TRIP}/byDate?date=${date}&extra=${extra}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function getTripsByDateSort(date, accessToken = '', extra = '') {
    let url = `${AUTH_TRIP}/byDate?date=${date}&sortBy=startTime&sortType=1&extra=${extra}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function getCurrentTrip(accessToken = '', extra = '') {
    let url = `${AUTH_TRIP}/current?extra=${extra}`;
    // console.log(url);
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getFutureTripByDriverID(DriverID, options, page, limit, accessToken, extra = '') {
    let time_now = new Date();
    let ten_minute_ago = time_now.getTime() - 1000 * 60 * 60 * 2;
    let end_day = new Date(time_now.setHours(23, 59, 59, 0)).getTime();

    if (!options.startTime) {
        options.startTime = ten_minute_ago;
    }
    if (!options.endTime) {
        options.endTime = end_day;
    }
    if (!options.sortBy) {
        options.sortBy = 'startTime';
    }
    if (!options.sortType) {
        options.sortType = "1";
    }

    let url = `${AUTH_TRIP}/byDriver?driverID=${DriverID}&startTime=${options.startTime}&endTime=${options.endTime}&page=${page}&limit=${limit}&sortBy=${options.sortBy}&sortType=${options.sortType}&extra=${extra}`;

    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function getTripHistoryByDriverID({
    driverID,
    date,
    status
}, accessToken) {
    let url = `${AUTH_TRIP}/history/byDriver?driverID=${driverID}&date=${date}&status=${status.join(',')}`;
    // console.log(url);
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function getTripHistoryByDate({
    date,
    status
}, accessToken) {
    let url = `${AUTH_TRIP}/history/byDate?&date=${date}&status=${status.join(',')}`;
    // console.log(url);
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function updateStatusTrip(trip, accessToken = '') {
    let data = {
        status: trip.status
    }
    if (trip.note) data.note = capitalizeFirstLetter(trip.note);

    let url = `${AUTH_TRIP}/${trip._id}/status`;
    return httpDefault(METHOD.put, url, {
        token: accessToken
    })
}

function updateTrip(trip, accessToken = '', opts, updateTaskTrip) {

    let url = `${AUTH_TRIP}/${trip._id}`;
    return httpDefault(METHOD.put, url, {
        token: accessToken
    })
}


function updateLimitTrip(trip, accessToken) {
    let url = `${AUTH_TRIP}/${trip._id}/limit`;

    return httpDefault(METHOD.put, url, {
        token: accessToken
    }).then(result => {
        updateTask('Trip', trip._id, formatDate(trip.startTime))
        return result
    })
}

function initTripInDay(date, accessToken = '') {

    let url = `${AUTH_TRIP}/dayInit`;
    return httpDefault(METHOD.post, url, {
        token: accessToken
    })
}
/**
 * Hàm này ko dùng nữa, nếu dùng thì phải sửa lại cấu trúc hàm:
 * 1. Dùng httpDefault
 * 2. Cập nhật updateTask: thêm date của trip vào để giảm tải ở clien ko load lại nhiều nếu ko cùng date.
 *  */
function deleteTrip(tripID = '', accessToken = '') {

    let url = `${AUTH_TRIP}/${tripID}`;
    return httpDefault(METHOD.del, url, {
        token: accessToken
    })
}

function getSearchTripsByPage(options, page, limit, accessToken) {
    let today = Date.now();
    let driverID = '',
        carID = '',
        routeID = '';
    let type = '',
        sortby = 'startTime',
        sortType = '-1';
    let extra = [];
    if (options.type == 'all') type = '0,1'
    else type = options.type;
    if (options.status == 'all') {
        options.status = '';
    }
    if (!options.startTime) options.startTime = today - 86400 * 1000;
    if (!options.endTime) options.endTime = today;

    if (options.driverID) driverID = options.driverID;
    if (options.carID) carID = options.carID;

    if (options.routeID == 'all') routeID = '';
    else if (options.routeID) routeID = options.routeID;

    if (options.sortby) sortby = options.sortby;
    if (options.sortType) sortType = options.sortType;
    if (options.extra && options.extra.length > 0) extra = options.extra;

    let query = `routeID=${routeID}&type=${type}&status=${options.status}&start=${options.startTime}&finish=${options.endTime}&page=${page}&limit=${limit}&extra=${extra}&sortBy=${sortby}&sortType=${sortType}`;

    if (options.statistic == true) {
        query += `&statistic=${options.statistic}`;
        if (carID && carID.length > 0) query += `&carID[]=${carID}`;
        if (driverID && driverID.length > 0) query += `&driverID[]=${driverID}`;
    } else query += `&carID=${carID}&driverID=${driverID}`;

    let url = `${AUTH_TRIP}/filter?${query}`;
    // console.log(url);
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function getFilterLimit(options, page, limit, accessToken) {
    let today = Date.now();
    let driverID = '',
        carID = '',
        routeID = '';
    let type = '',
        sortby = 'startTime',
        sortType = '-1';
    let extra = [];
    if (options.type == 'all') type = '0,1'
    else type = options.type;
    if (options.status == 'all') {
        options.status = '';
    }
    if (!options.startTime) options.startTime = today - 86400 * 1000;
    if (!options.endTime) options.endTime = today;

    if (options.driverID) driverID = options.driverID;
    if (options.carID) carID = options.carID;

    if (options.routeID == 'all') routeID = '';
    else if (options.routeID) routeID = options.routeID;

    if (options.sortby) sortby = options.sortby;
    if (options.sortType) sortType = options.sortType;
    if (options.extra && options.extra.length > 0) extra = options.extra;

    let query = `routeID=${routeID}&type=${type}&status=${options.status}&start=${options.startTime}&finish=${options.endTime}&page=${page}&limit=${limit}&extra=${extra}&sortBy=${sortby}&sortType=${sortType}`;

    if (options.statistic == true) {
        query += `&statistic=${options.statistic}`;
        if (carID && carID.length > 0) query += `&carID[]=${carID}`;
        if (driverID && driverID.length > 0) query += `&driverID[]=${driverID}`;
    } else query += `&carID=${carID}&driverID=${driverID}`;

    let url = `${AUTH_TRIP}/filterlimit?${query}`;
    // console.log(url);
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function syncAssignCarToTrip({
    start,
    finish
}, accessToken = '') {

    let url = `${AUTH_TRIP}/assign-driver-and-car`;
    return httpDefault(METHOD.put, url, {
        token: accessToken
    })
}

function seatAnalysisTripByTripID(ids) {
    return COLLECTION_CUSTOMERTRIP.rawCollection().aggregate([{
            $match: {
                isDeleted: false,
                tripID: {
                    $in: ids
                },
                status: {
                    $in: [0, 1, 4, 5]
                }
            }
        },
        {
            $group: {
                _id: "$tripID",
                s: {
                    $sum: "$seats"
                },
                seats_detail: {
                    $push: {
                        status: "$status",
                        seats: "$seats"
                    }
                }
            }
        }
    ]).toArray();
}


function getTripsStatistic(options, accessToken) {
    let today = Date.now();
    let carID = '',
        routeID = '',
        status = '';

    if (!options.startTime) options.startTime = today - 86400 * 1000;
    if (!options.endTime) options.endTime = today;

    if (options.driverID) driverID = options.driverID;
    if (options.carID) carID = options.carID;
    if (options.status) status = options.status;
    let query = `start=${options.startTime}&finish=${options.endTime}&status=${status}`;

    // if (carID && carID.length > 0) query += `&carID[]=${carID}`;
    // if (driverID && driverID.length > 0) query += `&driverID[]=${driverID}`;

    let url = `${AUTH_TRIP}/statistic?${query}`;
    // console.log(url);
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function countTripByCarModel({
    tripID,
    carModelID,
    startTime
}, accessToken) {
    let url = `${AUTH_TRIP}/count/bycarModel?tripID=${tripID}&carModelID=${carModelID}&startTime=${startTime}`;
    // console.log(url);
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

/**
 * 
 */


function getTripsFutureByCarStop({
    carStopID,
    date,
    routeID
}, accessToken) {
    let url = `${AUTH_TRIP}/byPickupCarStop?carStopID=${carStopID}&date=${date}&routeID=${routeID}`;
    // console.log(url);
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

// sửa lại
function getTripLog(tripID, accessToken = '') {
    let url = `${AUTH_TRIP}/${tripID}/log`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function updateTripsPayment(data, accessToken = '') {
    let url = `${AUTH_TRIP}/payment`;
    let tripIDs = data.trips.map(i => i.tripID);
    let dates = data.trips.map(i => data.date);
    return httpDefault(METHOD.put, url, {
        token: accessToken,
        body: data
    }).then(result => {
        // @tungBT: lam gi co "_ids" ???
        // updateTask('Trip', data._ids)
        updateTask('Trip', tripIDs, dates)
        return result
    })
}

function getCustomerTripInTrip(tripID, accessToken = '', {
    statusCustomerTrip,
}) {
    let query = '';
    if (statusCustomerTrip) query += `statusCustomerTrip=${statusCustomerTrip}&extra=driver,car,bill`;
    let url = `${AUTH_TRIP}/${tripID}/customerTrip?${query}`;
    // console.log(url);
    return httpDefault(METHOD.get, url, {
        token: accessToken,
    })
}


function getCustomerTripInTrips(tripIDs, accessToken = '', {
    statusCustomerTrip,
}) {
    let body = {
        tripIDs,
        statusCustomerTrip,
    }
    let url = `${AUTH_TRIP}/customerTrip`;
    // console.log(tripIDs);
    return httpDefault(METHOD.post, url, {
        body,
        token: accessToken,
    })
}


function updateEndTrip({
    trips,
    note
}, accessToken) {
    let url = `${AUTH_TRIP}/end`;
    let tripIDs = trips.map(i => i._id);
    let dates = trips.map(i => formatDate(i.startTime));
    return httpDefault(METHOD.put, url, {
        body: {
            tripIDs,
            note
        },
        token: accessToken,
    }).then(result => {
        if (tripIDs && tripIDs.length > 0) updateTask('Trip', tripIDs, dates);
        return result
    })
}


function transitDriver(trip, accessToken) {
    let url = `${AUTH_TRIP}/${trip._id}/transitDriver`;
    return httpDefault(METHOD.put, url, {
        token: accessToken,
    }).then(result => {
        if (trip._id) updateTask('Trip', trip._id, formatDate(trip.startTime));
        return result
    })
}

function revertTransitDriver(trip, accessToken) {
    let url = `${AUTH_TRIP}/${trip._id}/notTransitDriver`;
    return httpDefault(METHOD.put, url, {
        token: accessToken,
    }).then(result => {
        if (trip._id) updateTask('Trip', trip._id, formatDate(trip.startTime));
        return result
    })
}