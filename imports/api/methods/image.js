import {
    Meteor
} from 'meteor/meteor';

import {
    BASE,
    AUTH_PATH
} from '../config'
import {
    httpDefault,
    METHOD
} from '../checkAPI';

const AUTH_IMAGE = `${AUTH_PATH}/Image`

if (Meteor.isServer) {
    Meteor.methods({
        'image.getAll': getImage,
        'image.getByID': getImageByID,
        'image.import': importImage,
    });
}

function getImage(data, accessToken) {
    let url = `${AUTH_IMAGE}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function getImageByID(data, accessToken) {
    let url = `${AUTH_IMAGE}/${data.imageID}/0`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function importImage(data, accessToken) {
    let url = `${AUTH_IMAGE}/${data._id}`;
    return httpDefault(METHOD.post, url, {
        body: data,
        token: accessToken
    });
}