import {Meteor} from "meteor/meteor";

import { getTripByID } from "./trip";
import { LogBy } from "../components/variableConst.js";

export{
    getLogCustomerTripByPage, getLogCustomerTripLast, getLogCustomerTripByID, getLogByObject,
}

function getLogCustomerTripLast(accessToken) {
    return new Promise((resolve, reject) => {
        Meteor.call('log.customerTrip.getLast', accessToken, (err, result) => {
            resolve(result);
        });
    });
}

function getLogCustomerTripByPage(options, page, limit, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('log.customerTrip.getByPage', options, page, limit, accessToken, (err, result) => {
            if(result.error){
                reject(result);
            }else {
                if(result){
                    let p = [];
                    result.data.forEach(item => {
                        p.push(getTripByID(item.data.tripID, accessToken));
                    });
                    p = Promise.all(p);
                    p.then(trips => {
                        result.data.forEach((item, index) => {
                            if(trips[index]){
                                item.data.startTime = trips[index].startTime;
                            }
                        });
                        resolve(result);
                    });
                }
            }
        });
    });
}

function getLogCustomerTripByID(options, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('log.customerTrip.getByID', options, accessToken, (err, result) => {
            resolve(result);
        });
    });
}

/**
 * 
 * @param {object} options {objectID, type}
 * @param {*} accessToken 
 */

function getLogByObject({objectID, type = LogBy.customerTrip}, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('log.getByObject', {objectID, type}, accessToken, (err, result) => {
            if(result.error) reject(result);
            else resolve(result);
        });
    });
}