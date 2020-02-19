import { Meteor } from "meteor/meteor"

export{
    getConfigs,
    deleteConfig,
    createConfig,
    updateConfig,
}

function getConfigs(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('config.getAll', accessToken, (error, result) => {
            if(error){
                reject(error)
            } else {
                resolve(result)
            }
        });
    })
}

function createConfig(input, accessToken = '', callback) {
    Meteor.call('config.create', input, accessToken, callback);
}

function updateConfig(input, accessToken = '', callback) {
    Meteor.call('config.update', input, accessToken, callback);
}

function deleteConfig(configID, accessToken = '', callback ) {
    Meteor.call('config.delete', configID, accessToken, callback);
}