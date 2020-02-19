function getUsers(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('user.getAll', accessToken, (error, result) => {
            resolve(result);
        });
    });
}

function getUserByID(userID, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('user.getByID', userID, accessToken, (error, result) => {
            resolve(result);
        });
    });
}

function getUsersByPage(accessToken = '', page) {
    return new Promise((resolve, reject) => {
        Meteor.call('user.getByPage', accessToken, page, (error, result) => {
            resolve(result);
        });
    });
}

function createUser(user, accessToken = '') {
    return new Promise((resolve, reject) => {
        if (!user._id) {
            Meteor.call('user.create', user, accessToken, (error, result) => {
                // console.log(error, result);
                if (result && result.error) {
                    reject(result);
                } else {
                    resolve(result);
                }
            });
        } else {
            Meteor.call('user.update', {
                _id: user.userID,
                name: user.name,
                address: user.address
            }, accessToken, (error, result) => {
                if (result && result.error) {
                    reject(result);
                } else {
                    resolve({
                        _id: user.userID
                    })
                }
            });
        }
    })
}

function getUserByPhone(userPhone, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('user.getByPhone', userPhone, accessToken, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result);
            }
        });
    });
}

function getUserByTypeAndPhone(userType, userPhone, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('user.getByTypeAndPhone', userType, userPhone, accessToken, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result);
            }
        });
    });
}


function getUserByPhone_new(userPhone, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('user.getByPhone.new', userPhone, accessToken, (err, result) => {
            if (err) reject(err)
            else if (result && result.error) reject(result)
            else resolve(result);
        });
    });
}

function getUserByEmail(email, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('user.getByEmail', email, accessToken, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result);
            }
        });
    });
}

function changePasswordByAdmin(user, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('user.changePasswordByAdmin', user, accessToken, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result);
            }
        });
    });
}

function updateUser(user, accessToken = '', callback) {
    Meteor.call('user.update', user, accessToken, callback);
}

function deleteUser(userID, accessToken = '', callback) {
    Meteor.call('user.delete', userID, accessToken, callback)
}

function blockUser({
    userID,
    blockReason
}, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('user.block', {
            userID,
            blockReason
        }, accessToken, (error, result) => {
            if (result.error) {
                reject(result)
            } else {
                resolve(result);
            }
        });
    });
}

function unBlockUser(userID, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('user.unBlock', userID, accessToken, (error, result) => {
            if (result.error) {
                reject(result)
            } else {
                resolve(result);
            }
        });
    });
}

/**
 * Hàm lấy User theo ID
 * @param {String} userID
 * @return {Object}
 */
function getUserByIDMeteor(userID) {
    return COLLECTION_USER
        .find({
            isDeleted: false,
            _id: new Meteor.Collection.ObjectID(userID)
        })
}

/**
 * Hàm lấy tất cả User theo nhiều ID
 * @param {Array} userIDs
 * @return {Object}
 */
function getUsersByIDsMeteor(userIDs) {
    return COLLECTION_USER
        .find({
            isDeleted: false,
            isBlocked: false,
            _id: {
                $in: userIDs.map(e => new Meteor.Collection.ObjectID(e))
            }
        })
        .fetch()
}

function updateUserProfile(user, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('user.updateProfile', user, accessToken, (err, result) => {
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

function updateUsers(options, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('user.updateUsers', options, accessToken, (error, result) => {
            if (result && result.error) reject(result)
            else if (error) reject(error)
            else resolve(result);
        })
    })
}
function getUserSearch(options, page, limit, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('user.getUserSearch', options, page, limit, accessToken, (error, result) => {
            if (result && result.error) reject(result)
            else if (error) reject(error)
            else resolve(result);
        })
    })
}

export {
    getUsers,
    getUserByID,
    getUserByPhone,
    getUsersByPage,
    createUser,
    updateUser,
    deleteUser,
    getUserByEmail,
    changePasswordByAdmin,
    blockUser,
    unBlockUser,
    getUsersByIDsMeteor,
    getUserByIDMeteor,
    getUserByPhone_new,
    getUserByTypeAndPhone,
    updateUserProfile,
    getUserSearch,
    updateUsers
}

// import collection mongoDB
import {
    COLLECTION_USER
} from '/imports/api/methods/user.js';