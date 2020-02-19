function getTrips(accessToken = '', extra = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getAll', accessToken, extra, (err, result) => {
            resolve(result);
        });
    });
}

function getTodayTrips(accessToken = '', extra = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getTodayTrips', accessToken, extra, (err, result) => {
            resolve(result);
        });
    });
}

function getTripsByDate(date, accessToken = '', extra = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getByDate', date, accessToken, extra, (err, result) => {
            resolve(result);
        });
    });
}

function getTripsByDateSort(date, accessToken = '', extra = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getByDateSort', date, accessToken, extra, (err, result) => {
            resolve(result);
        });
    });
}

function getFutureTrips(accessToken = '', extra = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getFuture', accessToken, extra, (err, result) => {
            resolve(result);
        });
    });
}

function getCurrentTrip(accessToken = '', extra = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getCurrent', accessToken, extra, (err, result) => {
            if (result.error) {
                reject(result)
            } else {
                // Nếu có thì lấy danh sách khách hàng
                let status = [
                    _CUSTOMERTRIP.status.dang_doi.number,
                    _CUSTOMERTRIP.status.dang_thuc_hien.number,
                    // _CUSTOMERTRIP.status.ket_thuc.number,
                ]
                getCustomerTripsByTrip(result._id, accessToken).then(customerTrips => {
                    // prices: tong so tien phai thu
                    // seats: so ghe
                    let {seats, prices} = customerTrips.reduce((res, value) => {
                        res.prices += value.price - (value.deposit || 0);
                        res.seats += value.seats;
                        return res;
                    }, {seats: 0, prices: 0})
                    
                    // sort theo địa chỉ đón
                    customerTrips = customerTrips.sort((a, b) => {
                        if (a.pickup.address.toLowerCase() < b.pickup.address.toLowerCase())    return -1;
                        if (a.pickup.address.toLowerCase() > b.pickup.address.toLowerCase())    return 1;
                        return 0;
                    });
                    result.customerTrips = customerTrips;
                    result.seats = seats;
                    result.prices = prices;
                    // console.log(result);
                    resolve(result);
                })
            }
        });
    });
}

function findTrip(trip, accessToken = '', extra = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.find', trip, accessToken, extra, (err, result) => {
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

function getTripByID(tripID, accessToken = '', extra = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getByID', tripID, accessToken, extra, (err, result) => {
            if (result.error) {
                reject(result)
            } else {
                resolve(result);
            }
        });
    });
}

function getTripDataByID(tripID, accessToken = '', extra = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getDataByID', tripID, accessToken, extra, (err, result) => {
            if (result.error) {
                reject(result)
            } else {
                resolve(result);
            }
        });
    });
}

function getTripByRouteID(routeID, accessToken = '', extra = '', opts) {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getByRouteID', routeID, accessToken, extra, opts, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

function getFutureTripByRouteID(routeID, accessToken = '', options = '', page = '', limit = '', extra = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getFutureByRouteID', routeID, accessToken, options, page, limit, extra, (err, result) => {
            if (err) reject(err);
            else {
                // neu la chuyen di Bao tron
                let p = [];
                // console.log(result)
                result.data.forEach(item => {
                    if (item.type == 1) {
                        p.push(getCustomerTripsByTrip(item._id, accessToken));
                    }
                });
                if (p.length > 0) {
                    p = Promise.all(p);
                    p.then(customerTrips => {
                        result.data.forEach(item => {
                            if (item.type == 1) {
                                item.customerTrips = customerTrips.find(customerTrip => customerTrip[0] && customerTrip[0].tripID == item._id);
                            }
                        });
                        resolve(result);
                    });
                } else {
                    resolve(result);
                }

            }
        });
    });
}

function getTripByRouteIDOneHour(routeID, startTime, accessToken = '', extra = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getByRouteIDOneHour', routeID, startTime, accessToken, extra, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

function getTripsByPage(accessToken = '', page = 1, extra = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getByPage', accessToken, page, extra, (err, result) => {
            resolve(result);
        });
    });
}

function findTripbyCarID(carID, startTime, accessToken = '', extra = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getByCarID', carID, startTime, accessToken, extra, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

function createTrip(trip, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.create', trip, accessToken, (error, result) => {
            if(!trip.routeID) reject('Lỗi cung đường');
            if(!trip.startTime) reject('Lỗi thời gian chuyến đi');
            if (result && result.error) reject(result)
            else if (error) reject(error)
            else resolve(result);
        })
    })
}

function initTripInDay(date, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.dayInit', date, accessToken, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

function getSearchTripsByPage(options, page, limit, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getSearchTripsByPage', options, page, limit, accessToken, (error, result) => {
            if (result && result.error) reject(result)
            else if (error) reject(error)
            else resolve(result);
        })
    })
}

function getFilterLimit(options, page, limit, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getFilterLimit', options, page, limit, accessToken, (error, result) => {
            if (result && result.error) reject(result)
            else if (error) reject(error)
            else resolve(result);
        })
    })
}

function getTripHistoryByDriverID({
    driverID,
    date,
    status
}, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getHistoryByDriverID', {
            driverID,
            date,
            status
        }, accessToken, (error, result) => {
            if (result && result.error) reject(result)
            else if (error) reject(error)
            else resolve(result);
        })
    })
}

function getTripHistoryByDate({
    date,
    status
}, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getHistoryByDate', {
            date,
            status
        }, accessToken, (error, result) => {
            if (result && result.error) reject(result)
            else if (error) reject(error)
            else resolve(result);
        })
    })
}


function getFutureTripByDriverID(driverID, options = '', page = '', limit = '', accessToken = '', extra = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getFutureByDriverID', driverID, options, page, limit, accessToken, extra, (err, result) => {
            if (result.error) reject(result);
            else {
                // neu co thi count so ghe
                let p = []
                result.data.forEach(item => {
                    p.push(countSeats(item._id, accessToken));
                });
                Promise.all(p).then(Seats => {
                    Seats.forEach((item, index) => {
                        result.data[index].seats = item;
                    });
                    resolve(result);
                });
            }
        });
    });
}

function updateTripSync(trip, accessToken = '', opts, updateTaskTrip = true) {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.update', trip, accessToken, opts, updateTaskTrip, (error, result) => {
            if (result && result.error) reject(result)
            else if (error) reject(error)
            else resolve(result);
        });
    });
}

function updateStatusTrip(trip, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.updateStatus', trip, accessToken, (error, result) => {
            if (result.error) {
                reject(result);
            } else {
                resolve(result);
            }
        });
    });
}
/**
 * 
 * @param {Object} trip : {_id, startTime}
 * @param {string} accessToken 
 */
function updateLimitTrip(trip, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.updateLimit', trip, accessToken, (error, result) => {
            if (result && result.error) {
                reject(result);
            } else {
                resolve(result);
            }
        });
    });
}



function syncAssignCar({
    start,
    finish
}, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.syncAssignCar', {
            start,
            finish
        }, accessToken, (error, result) => {
            if (result.error) {
                reject(result);
            } else {
                resolve(result);
            }
        });
    });
}

function cancelTrip(trip, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.cancel', trip, accessToken, (err, result) => {
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

function deleteTrip(tripID, accessToken = '', callback) {
    Meteor.call('trip.delete', tripID, accessToken, callback)
}

function getTripbyDateMeteor({
    date,
    routeID,
    sortBy,
    sortType,
    extra
}) {
    let day = date.split('-')
    let query = {
        isDeleted: false,
        status: {
            $ne: _TRIP.status.nha_xe_huy.number
        }
    };
    if (day.length === 1) {
        day = date.split('/')
    }
    let dateObject = new Date(`${day[1]}-${day[0]}-${day[2]}`)
    let startTime = dateObject.getTime()
    let endTime = dateObject.setDate(dateObject.getDate() + 1)
    extra = (extra == 'false') ? '' : 'car,driver'
    query.startTime = {
        $gte: startTime,
        $lt: endTime
    };
    if (routeID) query.routeID = routeID;
    // console.log(query, sortBy, sortType, extra)
    return get({query}, sortBy, sortType, extra);
}

function getTripByIDsMeteor(tripIDs) {
    let query = {
        isDeleted: false,
        status: { $in: [_TRIP.status.dang_doi.number, _TRIP.status.dang_thuc_hien.number, _TRIP.status.ket_thuc.number] },
        _id: {
            $in: tripIDs.map(e => new Meteor.Collection.ObjectID(e))
        },
    }, options ={
        fields: {
            tripID: 1, status: 1, seats: 1, price: 1 
        }
    };    
    return get({query, ops: options});
}

function findTripByStartTime(routeID, startTime) {
    let query = {
        routeID,
        startTime
    }
    // console.log(Cursor.fetch());
    return get({query, ops}, 'createdTime', '1', 'car,driver');
}

function get({query, ops}, sortBy, sortType, extra) {
    if (query.isDeleted == undefined) query.isDeleted = false;
    let options = {}
    let keyOnList = {}
    if (sortBy) {
        sortBy = sortBy.split(',')
        if (sortType) sortType = sortType.split(',')
        sortBy.forEach((e, i) => {
            keyOnList[e] = sortType ? (Number(sortType[i]) || 1) : 1
        })
        options.sort = keyOnList;
    }
    if(ops) options = ops;
    let trips = COLLECTION_TRIP.find(query, options);
    // console.log(trips.count(), extra)
    if (trips.count() == 0) return []
    if (!extra) return trips.fetch()
    return addExtra(trips.fetch(), extra);
}

function addExtra(trips, extra) {
    extra = extra.split(',');
    // console.log(trips, extra)
    if (Array.isArray(trips)) {
        let routeIDs = [],
            carIDs = [],
            driverIDs = []
        trips.forEach(({
            routeID,
            carID,
            driverID
        }) => {
            if (extra.includes('route') && routeID != null) {
                routeIDs.push(routeID)
            }
            if (extra.includes('car') && carID != null) {
                carIDs.push(carID)
            }
            if (extra.includes('driver') && driverID != null) {
                driverIDs.push(driverID)
            }
        })

        let routes, cars, drivers
        let arr = []
        // if (routeIDs.length > 0) {
        //     routes = getRoutesByIDs(routeIDs, 'carStop')
        // }
        if (carIDs.length > 0) {
            cars = getCarsByIDsMeteor(carIDs, 'carModel,driver')
        }
        if (driverIDs.length > 0) {
            drivers = getDriversByIDsMeteor(driverIDs, 'user')
        }

        trips.forEach(currentValue => {
            // if (routes != undefined && currentValue.routeID != null) {
            //     currentValue.route = routes.find(element => element._id._str == currentValue.routeID)
            //     // delete currentValue.routeID
            // }
            if (cars != undefined && currentValue.carID != null) {
                currentValue.car = cars.find(element => element._id._str == currentValue.carID)
                // delete currentValue.carID
            }
            if (drivers != undefined && currentValue.driverID != null) {
                currentValue.driver = drivers.find(element => element._id._str == currentValue.driverID)
                // delete currentValue.driverID
            }
        })
        return trips
    }
}

function seatAnalysisTripByTripID(tripIDs) {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.seatAnalysis.byTripID', tripIDs, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function getTripsStatisticData(options, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getTripsStatistic', options, accessToken, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
}

function countTripByCarModel({
    tripID,
    carModelID,
    startTime
}, accessToken) {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.countByCarModel', {
            tripID,
            carModelID,
            startTime
        }, accessToken, (err, result) => {
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

function getTripsFutureByCarStop(options, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getFutureByCarStop', options, accessToken, (err, result) => {
            if (result && result.error) {
                reject(result);
            } else if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
}

function getTripLog(tripID, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getLog', tripID, accessToken, (err, result) => {
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

function updateTripsPayment(data, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.updatePayment', data, accessToken, (err, result) => {
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

function getCustomerTripInTrip(tripID, accessToken = '', options = {}) {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.getCustomerTrip', tripID, accessToken, options, (err, result) => {
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


function getCustomerTripInTrips(tripIDs, accessToken = '', options = {}) {
    return new Promise((resolve, reject) => {
        Meteor.call('trips.getCustomerTrip', tripIDs, accessToken, options, (err, result) => {
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


function updateEndTrip({trips, note}, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.updateEndTrip', {trips, note}, accessToken, (err, result) => {
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


function transitDriver(trip, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.transitDriver', trip, accessToken, (err, result) => {
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


function revertTransitDriver(trip, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('trip.revertTransitDriver', trip, accessToken, (err, result) => {
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

// IMPORT

import {
    _CUSTOMERTRIP,
    _TRIP,
    LIMIT_DOCUMENT_DEFAULT
} from '../components/variableConst'

// import collection mongoDB
import {
    COLLECTION_TRIP,
    getTripsStatistic
} from '/imports/api/methods/trip.js';

import {
    countSeats,
    getCustomerTripsByTrip
} from './customerTrip'

import {
    getCarByIDMeteor,
    getCarsByIDsMeteor,
} from './car'

import {
    // getDriverByIDMeteor,
    getDriversByIDsMeteor,
} from './driver'

// import {
//     getCarByIDMeteor,
//     getCarsByIDsMeteor,
// } from './car'

export {
    getTrips,
    getTripByID,
    getTripDataByID,
    getTripByRouteID,
    getTripByRouteIDOneHour,
    getFutureTripByRouteID,
    getFutureTrips,
    getTripsByPage,
    countTripByCarModel,
    createTrip,
    findTrip,
    updateStatusTrip,
    updateLimitTrip,
    deleteTrip,
    findTripbyCarID,
    cancelTrip,
    getTodayTrips,
    initTripInDay,
    getTripsByDate,
    getCurrentTrip,
    getTripsByDateSort,
    getSearchTripsByPage,
    getFilterLimit,
    getTripHistoryByDriverID,
    getTripHistoryByDate,
    getFutureTripByDriverID,
    syncAssignCar,
    getTripbyDateMeteor,
    seatAnalysisTripByTripID,
    getTripsStatisticData,
    findTripByStartTime,
    getTripByIDsMeteor,
    getTripsFutureByCarStop,
    getTripLog,
    updateTripsPayment,
    getCustomerTripInTrip,
    updateEndTrip,
    updateTripSync,
    getCustomerTripInTrips,
    transitDriver,
    revertTransitDriver
}