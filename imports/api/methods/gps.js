// Methods related to links

import { Meteor } from 'meteor/meteor';
import { request } from "meteor/froatsnook:request";

import { BASE } from '../config'
import { METHOD, httpDefault } from '../checkAPI'

const BASE_GPS= `${BASE}/gps`
const url_binhAnh_login = 'https://taxi.binhanhcorp.com/Auth/Auth';
const user_agent ='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36';
let cookie_BA;

if (Meteor.isServer) {
    Meteor.methods({
        'gps.getAll': getGPSs,
        'gps.convertIntoAddress': convertGeoIntoAddress,
        'gps.convertIntoAddressClone': convertGeoIntoAddressClone,
        'gps.login': login,
        'gps.requestSync': requestSync,
        'gps.searchByAddress': searchByAddress,
    });
    // login();
    // Meteor.setInterval(function() {
    //     requestSync();
    // },5000);
}


function getGPSs() {
    let url =  BASE_GPS;
    // console.log(lat, lng, accessToken)
    return httpDefault(METHOD.get, url, {});
}

/**
 *
 * @param {float} lat
 * @param {float} lng
 * @returns {Promise<any>}
 */
function convertGeoIntoAddress(lat,lng) {
    return new Promise((resolve, reject) => {
        HTTP.call('GET', `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&region=vi&key=AIzaSyDa-epGk5gYdpYf_jXwItwGKaygniRQIl8`, (error, result) => {
            if (error) {
                reject({error})
            } else {
                resolve(result.data);
                // {result: [array], status: 'string'}
            }
        });
    });
}

function cutStr(str, start, end){
    const startPos = str.indexOf(start);
    if(startPos >= 0){
        let temp = str.slice(startPos + start.length);
        return temp.slice(0, temp.indexOf(end));
    } else
        return '';
}

function login() {
    return new Promise((resolve, reject) => {
        try {
            var res = request.sync(url_binhAnh_login, {
                headers: {
                    'user-agent': user_agent
                }
            });
            if (res.response.statusCode == 200) {
                const body = res.body;
                let formData = {
                    __RequestVerificationToken: cutStr(body, `name="__RequestVerificationToken" type="hidden" value="`, `" />`),
                    Username: 'hangthuonggia',
                    Password: '12341234',
                    LoginFailTime: '',
                    Captcha: '',
                    RememberMe: 'true',
                }
                try {
                    let res_login = request.postSync(`http://taxi.binhanhcorp.com/Auth/Auth`, {
                        form: formData,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            'user-agent': user_agent
                        }
                    });
                    resolve(res_login.response.headers['set-cookie']);

                } catch (error) {
                    reject({error});
                }
            }
        } catch (error) {
            // See below for info on errors
            console.log({error});
        }
    });

}

function requestSync(cookie) {
    return new Promise((resolve, reject) => {
        let res_get_address = request.sync(`http://taxi.binhanhcorp.com/Online/RequestSyn?_=${Date.now()}`, {
            headers: {
                Cookie: cookie,
                'user-agent': user_agent
            }
        });
        resolve(res_get_address.body);
    });
}


function convertGeoIntoAddressClone(lat = 20.98401256772633, lng = 105.83264302105715, Cookie) {
    return new Promise((resolve, reject) => {
        HTTP.call('GET', `https://taxi.binhanhcorp.com/Address/GetAddressByLatLng?latitude=${Number(lat)}&longitude=${Number(lng)}`,{
            headers: {
                Cookie: Cookie,
                'user-agent': user_agent
            }
        }, (error, result) => {
            if (error) {
                reject({error})
            } else {
                resolve(result.data);
                // string
            }
        });
    });
}

// clone lat lon from open street map
function searchByAddress(keySearch) {
    const borders = encodeURIComponent(`20.111742399019096,104.19461349726498,21.587559080805477,107.21860031367123`);
    return new Promise((resolve, reject) => {
        HTTP.call('GET', `https://map.coccoc.com/map/search.json?query=${encodeURIComponent(keySearch)}&borders=${borders}`,{
            headers: {
                'user-agent': user_agent,
            }
        }, (error, result) => {
            if (error) {
                reject({error})
            } else {
                let data = []
                if (result && result.content) {
                    const content = JSON.parse(result.content);
                    if(content.result && content.result.poi) {
                        content.result.poi.forEach(key => {
                            if(key && key.gps && key.address){
                                key = {
                                    location: {
                                        lat: Number(key.gps.latitude),
                                        lng: Number(key.gps.longitude)
                                    },
                                    address: key.address
                                }
                                data.push(key);
                            }
                        })
                    }
                }
                resolve(data);
            }
        });
    });
}
