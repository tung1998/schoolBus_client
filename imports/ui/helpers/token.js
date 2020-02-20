export {
    getUserInfo,
    getInfo,
    checkAccessToken,
    //getTokensByPage,
    deleteTokenByID,
    //deleteTokenLogout,
    getByUserID
}

function checkAccessToken(accessToken) {
    return new Promise((resolve, reject) => {
        Meteor.call('token.checkAccessToken', accessToken, (err, result) => {
            if (result && result.error) {
                reject(result)
            } else resolve(result);
        });
    });
}

function getUserInfo(accessToken) {
    return new Promise((resolve, reject) => {
        Meteor.call('token.getUserInfo', accessToken, (err, result) => {
            if (result && result.error) reject(result);
            else resolve(result);
        });
    });
}

function getInfo(accessToken) {
    return new Promise((resolve, reject) => {
        Meteor.call('token.getUserInfo', accessToken, (err, result) => {
            if (result && result.error) reject(result);
            else resolve(result);
        });
    });
}


/*function getTokensByPage(page, limit, options, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('token.getByPage', {
            page,
            limit,
            options
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
}*/

function deleteTokenByID(_id, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('token.deleteByID', _id, accessToken, (err, result) => {
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

/*function deleteTokenLogout(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('token.deleteLogout', accessToken, (err, result) => {
            if (result && result.error) {
                reject(result);
            } else if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}*/

function getByUserID(userID, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('token.getByUserID', userID, accessToken, (err, result) => {
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