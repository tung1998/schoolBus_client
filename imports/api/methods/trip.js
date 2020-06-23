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

const BASE_TRIP = `${BASE}/Trip`
const AUTH_TRIP = `${AUTH_PATH}/Trip`

if (Meteor.isServer) {
    Meteor.methods({
        'trip.getAll': getAllTrip,
        'trip.getByID': getTripByID,
        'trip.getAllNext': getAllNextTrip,
        'trip.getByStudent': getByStudent,
        'trip.getByTime': getTripByTime,
        'trip.getByPage': getTripByPage,
        'trip.getNext': getNextTrip,
        'trip.getLogByTripID': getTripLogByTripID,
        'trip.getStudentTripLog': getStudentTripLog,
        'trip.create': createTrip,
        'trip.update': updateTrip,
        'trip.delete': deleteTrip,
        'trip.attendance': attendanceTrip,
        'trip.image': imageTrip,
        'trip.updateTripStatus': updateTripStatus,
        'trip.updateCarStop': updateTripCarStop,
        'trip.updateStudentNote': updateStudentNote
    });
}

function getAllTrip(data, accessToken = '') {
    let url = `${AUTH_TRIP}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getTripByID(data, accessToken = '') {
    let url = `${AUTH_TRIP}/${data._id}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getTripByPage(data, accessToken = '') {
    let url = `${AUTH_TRIP}/${data.page}?limit=${data.limit}`
    if (data.options && data.options.length)
        data.options.forEach(item => {
            if (item.value) url += `&${encodeURIComponent(item.text)}=${encodeURIComponent(item.value)}`
        })
        console.log(url)
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getTripByTime(data, accessToken = '') {
    let url = `${AUTH_TRIP}/byTime?`;
    if (data.startTime) url += `startTime=${data.startTime}`
    if (data.endTime) url += `&endTime=${data.endTime}`
    if (data.extra) url += `extra=${data.extra}`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createTrip(data, accessToken = '') {
    let url = `${AUTH_TRIP}`
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}

function updateTrip(data, accessToken = '') {
    let url = `${AUTH_TRIP}/${data._id}`
    return httpDefault(METHOD.put, url, {
        body: data,
        token: accessToken
    });
}

function deleteTrip(data, accessToken = '') {
    let url = `${AUTH_TRIP}/${data._id}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    });
}

function attendanceTrip(data, accessToken = '') {
    let url = `${AUTH_TRIP}/${data.tripID}/student/${data.studentID}/status`
    return httpDefault(METHOD.put, url, {
        body: {
            status: data.status
        },
        token: accessToken
    })
}

function imageTrip(data, accessToken = '') {
    let url = `${AUTH_TRIP}/${data.tripID}/student/${data.studentID}/image`
    return httpDefault(METHOD.put, url, {
        body: {
            image: data.image
        },
        token: accessToken
    })
}

function getNextTrip(data, accessToken = '') {
    let url = `${AUTH_TRIP}/next`
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    })
}

function getAllNextTrip(data, accessToken = '') {
    let url = `${AUTH_TRIP}/allNext`
    return httpDefault(METHOD.get, url, {
        body: data,
        token: accessToken
    })
}

function getTripLogByTripID(data, accessToken = '') {
    let url = `${AUTH_TRIP}/${data.tripID}/log`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function getStudentTripLog(data, accessToken = '') {
    let url = `${AUTH_TRIP}/${data.tripID}/student/${data.studentID}/log`
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}

function updateTripStatus(data, accessToken = '') {
    let url = `${AUTH_TRIP}/${data.tripID}/status`
    return httpDefault(METHOD.put, url, {
        body: data,
        token: accessToken
    })
}

function updateTripCarStop(data, accessToken = '') {
    let url = `${AUTH_TRIP}/${data.tripID}/carstop/${data.carStopID}`
    return httpDefault(METHOD.put, url, {
        body: data,
        token: accessToken
    })
}

function getByStudent(data, accessToken = '') {
    let url = `${AUTH_TRIP}/byStudent?page=${data.page}&limit=${data.limit}&studentID=${data.studentID}`
    if (data.options && data.options.length)
        data.options.forEach(item => {
            if (item.value) url += `&${encodeURIComponent(item.text)}=${encodeURIComponent(item.value)}`
        })
        console.log(url)
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function updateStudentNote(data, accessToken = '') {
    let url = `${AUTH_TRIP}/${data.tripID}/student/${data.studentID}/note`
    return httpDefault(METHOD.put, url, {
        body: data,
        token: accessToken
    })
}