// Methods related to links

import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';
import {
    httpDefault,
    METHOD
} from '../checkAPI';
import {
    AUTH_PATH,
    BASE
} from '../config'

import {
    USER_TYPE
} from '../../ui/components/variableConst'

const BASE_USER = `${BASE}/User`;
const AUTH_PATH_USER = `${AUTH_PATH}/User`;

// render data truc tiep tu mongodb
export const COLLECTION_USER = new Mongo.Collection('User', {
    idGeneration: 'MONGO'
});

if (Meteor.isServer) {
    Meteor.methods({
        //'user.init': initUsers,
        'user.getAll': getUsers,
        'user.getByID': getUserByID,
        //'user.getByPhone': getUserByPhone,
        //'user.getByTypeAndPhone': getUserByTypeAndPhone,
        //'user.getByPhone.new': getUserByPhoneNew,
        //'user.getByEmail': getUserByEmail,
        //'user.getByPage': getUsersByPage,
        'user.create': createUser,
        //'user.update': updateUserByID,
        'user.delete': deleteUser,
        //'user.updateProfile': updateUserProfile,
        //'user.changePassword': changeUserPassword,
        //'user.changePasswordByAdmin': changeUserPasswordByAdmin,
        'user.updateUsers': updateUsers,
        //'user.block': blockUser,
        //'user.unBlock': unBlockUser,
        //'user.getUserSearch': getUserSearch,
        /*'user.resetPasswordCode': function(email, emailData) {
            let user = {
                email: email
            };
            new Promise((resolve, reject) => {
                getResetPasswordCode(user, function(data) {
                    // console.log(data);
                }).then(data => {
                    if (data && data.resetCode) {
                        emailData.resetPasswordLink = Meteor.absoluteUrl() + 'reset-password/?code=' + data.resetCode;
                        // console.log(emailData);
                        Meteor.call('sendMailForgotPassword',
                            email,
                            'Đổi mật khẩu - Phiệt Học Thương Gia',
                            SSR.render('htmlEmailForgotPassword', emailData),
                            function(error, result) {
                                if (error) {
                                    console.log(error.reason);
                                } else {
                                    console.log('Send mail success');
                                }
                            }
                        );
                    }
                }).catch(reject)
            })
        },
        'user.resetPassword': function(password, resetCode) {
            let user = {
                password: password,
                resetCode: resetCode
            };
            return new Promise((resolve, reject) => {
                resetPassword(user).then(data => {
                    if (data) {
                        console.log(data);
                        resolve(data)
                    }
                }).catch(reject)
            })
        }
        */
    });

    // public cho client subscribe
    /*Meteor.publish('user.getAll.meteor', () => {
        return COLLECTION_USER.find({
            isDeleted: false,
        });
    });
    // public cho client subscribe
    Meteor.publish('user.getNotBlocked.meteor', () => {
        return COLLECTION_USER.find({
            isDeleted: false,
            isBlocked: false
        });
    });

    // public cho client subscribe
    Meteor.publish('user.getByIDs.meteor', (ids) => {
        return COLLECTION_USER.find({
            isDeleted: false,
            isBlocked: false,
            _id: {
                $in: ids.map(e => new Meteor.Collection.ObjectID(e))
            }
        });
    });
}
*/
    function getUsers(accessToken = '') {

        let url = AUTH_PATH_USER;
        return httpDefault(METHOD.get, url, {
            body,
            token: accessToken
        });
    }

    function getUserByID(user_id, accessToken = '') {

        let url = `${AUTH_PATH_USER}/${user_id}`;
        return httpDefault(METHOD.get, url, {
            body,
            token: accessToken
        });
    }
    /*
        function getUserByPhone(userPhone, accessToken = '') {
            let url = `${AUTH_PATH_USER}/byPhone/${userPhone}`;
            return httpDefault(METHOD.get, url, {
                body,
                token: accessToken
            });
        }

        function getUserByTypeAndPhone(userType, phone, accessToken = '') {
            // console.log(`${AUTH_PATH_USER}/byUserType?userType=${userType}&phone=${phone}`)

            let url = `${AUTH_PATH_USER}/byUserType?userType=${userType}&phone=${phone}`;
            return httpDefault(METHOD.get, url, {
                body,
                token: accessToken
            });
        }

        function getUserByPhoneNew(userPhone, accessToken = '') {
            let url = `${AUTH_PATH_USER}/byPhone/${userPhone}`;
            return httpDefault(METHOD.get, url, {
                token: accessToken,
            })
        }

        function getUserByEmail(userEmail, accessToken = '') {
            let url = `${AUTH_PATH_USER}/byEmail?email=${userEmail}`;
            return httpDefault(METHOD.get, url, {
                body,
                token: accessToken
            });
        }

        function getUsersByPage(accessToken = '', page = 1) {
            let url = `${AUTH_PATH_USER}/${page}`;
            return httpDefault(METHOD.get, url, {
                body,
                token: accessToken
            });
        }
        */
    function createUser(user, accessToken = '') {
        let url = AUTH_PATH_USER;
        let body = user;
        return httpDefault(METHOD.post, url, {
            body,
            token: accessToken
        });
    }

    /*function updateUserByID(user, accessToken = '') {
        let url = `${AUTH_PATH_USER}/${user._id}`;
        let body = user;
        return httpDefault(METHOD.put, url, {
            body,
            token: accessToken
        });
    }*/

    function deleteUser(user_id, accessToken = '') {
        let url = `${AUTH_PATH_USER}/${user_id}`;
        return httpDefault(METHOD.del, url, {
            body,
            token: accessToken
        });
    }

    /*function updateUserProfile(user, accessToken) {
        let url = `${AUTH_PATH_USER}/profile`;
        return httpDefault(METHOD.put, url, {
            body: user,
            token: accessToken
        });
    }

    function changeUserPassword(user, accessToken) {
        console.log(user, accessToken)
        let url = `${AUTH_PATH_USER}/password`;
        return httpDefault(METHOD.put, url, {
            body,
            token: accessToken
        });
    }

    function changeUserPasswordByAdmin(user, accessToken) {
        let url = `${AUTH_PATH_USER}/${user.userID}/password`;
        return httpDefault(METHOD.put, url, {
            body,
            token: accessToken
        });
    }

    function getResetPasswordCode(user) {
        let url = `${AUTH_PATH_USER}/forgot-password`;
        return httpDefault(METHOD.put, url, {
            body,
            token: accessToken
        });
    }

    function resetPassword(user) {
        let url = `${AUTH_PATH_USER}/reset-password`;
        return httpDefault(METHOD.put, url, {
            body,
            token: accessToken
        });
    }

    function initUsers() {
        let url = `${AUTH_PATH}/init`;
        return httpDefault(METHOD.get, url, {
            body,
            token: accessToken
        });
    }
    */
    /*function blockUser({
        userID,
        blockReason
    }, accessToken = '') {
        let url = `${AUTH_PATH_USER}/${userID}/block`;
        let body = {
            blockReason
        };
        return httpDefault(METHOD.put, url, {
            body,
            token: accessToken
        });
    }*/

    /*function unBlockUser(userID, accessToken = '') {
        let url = `${AUTH_PATH_USER}/${userID}/unblock`;
        let body = null;
        return httpDefault(METHOD.put, url, {
            body,
            token: accessToken
        });
    }*/

    function updateUsers(options, accessToken = '') {
        let url = `${AUTH_PATH_USER}`;
        return httpDefault(METHOD.put, url, {
            body: options,
            token: accessToken
        });
    }


    /*function getUserSearch(options, page, limit, accessToken) {
        let sortby = 'createdTime';
        let sortType = '-1';
        let query = `sortBy=${sortby}&sortType=${sortType}`;
        if (options.userType) query += `&userType=${options.userType}`
        if (options.name) query += `&name=${options.name}`
        if (options.username) query += `&username=${options.username}`
        if (options.phone) query += `&phone=${options.phone}`
        if (options.email) query += `&email=${options.email}`
        if (limit) query += `&limit=${limit}`
        if (page) query += `&page=${page}`
        let url = `${AUTH_PATH_USER}/search?${query}`;
        // console.log(url);
        return httpDefault(METHOD.get, url, {
            token: accessToken
        })*/
}