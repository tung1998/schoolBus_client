import {
    Meteor
} from 'meteor/meteor';

import {
    AUTH_PATH
} from '../config'
import {
    isStatusCodeError,
    msgError,
    httpDefault,
    METHOD
} from '../checkAPI';

const BASE_INFO = `${AUTH_PATH}/Info`;
const BASE_TOKEN = `${AUTH_PATH}/Token`;

if (Meteor.isServer) {
    Meteor.methods({
        'token.checkAccessToken': checkAccessToken,
        //'token.getUserType': getUserType,
        'token.getUserInfo': getUserInfo,
        //'token.getByPage': getTokensByPage,
        'token.getByUserID': getByUserID,
        'token.deleteByID': deleteTokenByID,
        //'token.deleteLogout': deleteTokenLogout,
    });
}


function checkAccessToken(accessToken) {
    let url = `${BASE_INFO}`
    return httpDefault(METHOD.get, url, {
        token: accessToken,
        body: {
            _id
        }
    })
}

/*function getUserType(accessToken) {
    let url = `${BASE_INFO}`
    return httpDefault(METHOD.get, url, {
        token: accessToken,
        body: {
            _id
        }
    })
}*/

function getUserInfo(accessToken) {
    let url = `${BASE_INFO}`;
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}


/*function getTokensByPage({
    page,
    limit,
    options
}, accessToken = '') {
    let url = `${BASE_TOKEN}/filter?limit=${limit}&page=${page}`;
    if (options.sortBy) {
        url += `&sortBy=${options.sortBy}`
    }
    if (options.sortType) {
        url += `&sortType=${options.sortType}`
    }
    if (options.username) {
        url += `&username=${options.username}`
    }
    if (options.userID) {
        url += `&userID=${options.userID}`
    }
    if (options.type) {
        url += `&type=${options.type}`
    }
    if (options.phone) {
        url += `&phone=${options.phone}`
    }
    if (options.expires_at_start) {
        url += `&expires_at_start=${options.expires_at_start}`
    }
    if (options.expires_at_end) {
        url += `&expires_at_end=${options.expires_at_end}`
    }
    // console.log(url);
    return httpDefault(METHOD.get, url, {
        token: accessToken
    })
}*/

function deleteTokenByID(_id, accessToken = '') {
    let url = `${BASE_TOKEN}/byID`
    return httpDefault(METHOD.del, url, {
        token: accessToken,
        body: {
            _id
        }
    })
}

/*function deleteTokenLogout(accessToken = '') {
    let url = `${BASE_TOKEN}/logout`
    return httpDefault(METHOD.del, url, {
        token: accessToken,
    })
}*/



function getByUserID(userID, accessToken = '') {
    let url = `${BASE_TOKEN}/byUser`
    return httpDefault(METHOD.get, url, {
        token: accessToken,
        body: {
            userID
        }
    })
}