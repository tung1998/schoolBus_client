import {Meteor} from "meteor/meteor";

import { getTripByID } from "./trip";
import { LogBy } from "../components/variableConst.js";

export{
    getLogByObject,
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