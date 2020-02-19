// Methods related to links

import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';

import {
    BASE,
    AUTH_PATH
} from '../config'


import {
    METHOD,
    httpDefault
} from '../checkAPI'

const BASE_CONFIG = `${AUTH_PATH}/Config`

// render data truc tiep tu mongodb
export const COLLECTION_CONFIG = new Mongo.Collection('Config', {
    idGeneration: 'MONGO'
});

if (Meteor.isServer) {
    Meteor.methods({
        'config.create': createConfig,
        'config.getAll': getConfigs,
        'config.update': updateConfig,
        'config.delete': deleteConfig,
    });
    // public cho client subscribe
    Meteor.publish('config.getAll.meteor', () => {
        return COLLECTION_CONFIG.find({
            isDeleted: false
        });
    });
}

function getConfigs(accessToken = '') {
    let url = BASE_CONFIG
    return httpDefault(METHOD.get, url, {
        token: accessToken
    }).then(result => result.data).catch(err => err);
}

function createConfig(config, accessToken = '') {
    let url = BASE_CONFIG
    return httpDefault(METHOD.post, url, {
        body: config,
        token: accessToken
    })
}

function updateConfig(config, accessToken = '') {
    let url = `${BASE_CONFIG}/${config._id}`
    return httpDefault(METHOD.put, url, {
        body: config,
        token: accessToken
    })
}

function deleteConfig(configID, accessToken = '') {
    let url = `${BASE_CONFIG}/${configID}`
    return httpDefault(METHOD.del, url, {
        token: accessToken
    })
}