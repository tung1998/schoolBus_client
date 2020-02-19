import {capitalizeFirstLetter} from '../components/functions';

export{
    getGPSs, convertGeoIntoAddress, gpsLogin, gpsRequestSync, convertGeoIntoAddressClone, searchByAddress,
}

function getGPSs() {
    return new Promise((resolve, reject) => {
        Meteor.call('gps.getAll', null, (err, result) => {
            // if(result.error) reject(result);
            // console.log(result);
            if(result && result.length){
                result = result.sort((a,b) => {
                    if(a.plate.toLowerCase() < b.plate.toLowerCase()) return -1;
                    if(a.plate.toLowerCase() > b.plate.toLowerCase()) return 1;
                    return 0;
                });
                resolve(result);
            }
        });
    });
}

function convertGeoIntoAddress(lat, lng) {
    return new Promise((resolve, reject) => {
        Meteor.call('gps.convertIntoAddress', lat, lng, (err, result) => {
            // if(result.error) reject(result);
            // console.log(result);
            let arrayAddress = result.results;
            if(arrayAddress && arrayAddress[0] && arrayAddress[0].formatted_address){
                arrayAddress[0].formatted_address = capitalizeFirstLetter(arrayAddress[0].formatted_address);
                arrayAddress[0].location = arrayAddress[0].geometry.location;
                delete arrayAddress[0].address_components;
                delete arrayAddress[0].geometry.viewport;
                delete arrayAddress[0].geometry.location;
                delete arrayAddress[0].geometry.bounds;
                resolve(arrayAddress);
            }
            // [array]
        });
    });
}

function gpsLogin() {
    return new Promise((resolve, reject) => {
        Meteor.call('gps.login', null, (err, result) => {
            if(err) reject({err});
            else resolve(result);
        //  cookie
        });
    });
}

function gpsRequestSync() {
    return new Promise((resolve, reject) => {
        Meteor.call('gps.requestSync', null, (err, result) => {
            if(err) reject({err});
            else resolve(result);
        //  cookie
        });
    });
}

function convertGeoIntoAddressClone(lat, lng, cookie) {
    return new Promise((resolve, reject) => {
        Meteor.call('gps.convertIntoAddressClone', lat, lng, cookie, (err, result) => {
            if(err) reject({err});
            else resolve(result);
            // string
        });
    });
}

function searchByAddress(address) {
    return new Promise((resolve, reject) => {
        Meteor.call('gps.searchByAddress', address, (err, result) => {
            if(err) reject({err});
            else resolve(result);
            // string
        });
    });
}