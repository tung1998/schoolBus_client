import { Meteor } from "meteor/meteor"
export {
    getAdmin,
    deleteadmin,
    createadmin,
    updateadmin,
}

function getAdmin(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('admin.getAll', accessToken, (err, result) => {
            if (result && result.error) reject(result)
            else if (err) reject(err);
            else resolve(result);
        });
    });
}

function createadmin(input, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('admin.create', input, accessToken, (err, result) => {
            if (result && result.error) reject(result)
            else if (err) reject(err);
            else resolve(result);
        });
    });
}

function updateadmin(Admin, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('admin.update', Admin, accessToken, (err, result) => {
            if (result && result.error) reject(result)
            else if (err) reject(err);
            else resolve(result);
        });
    });
}

function deleteadmin(_ids, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('admin.delete', _ids, accessToken, (err, result) => {
            if (result && result.error) reject(result)
            else if (err) reject(err);
            else resolve(result);
        });
    });
}