// Methods related to links

import { Meteor } from 'meteor/meteor';

import {
    BASE,
    AUTH_PATH
} from '../config'
import { httpDefault, METHOD } from '../checkAPI';
const BASE_FEEDBACK = `${AUTH_PATH}/Feedback`

if (Meteor.isServer) {
    Meteor.methods({
        'feedback.create': createFeedback,
        'feedback.getAll': getFeedbacks,
        'feedback.getByID': getFeedbackById,
        'feedback.getByPage': getFeedbackByPage,
        'feedback.update': updateFeedback,
        'feedback.delete': deleteFeedback,
    });
}

function getFeedbacks(data, accessToken = '') {
    let url = `${BASE_FEEDBACK}?extra=${data.extra}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

function getFeedbackById(data, accessToken = '') {
    let url = `${BASE_FEEDBACK}/${data._id}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

function getFeedbackByPage(data, accessToken = '') {
    let url = `${BASE_FEEDBACK}/${data.page}?limit=${data.limit}`
    if (data.options && data.options.length) {
        data.options.forEach(item => {
            if (item.value !== '') url += `&${encodeURIComponent(item.text)}=${encodeURIComponent(item.value)}`
        })
    }
    return httpDefault(METHOD.get, url, {
        token: accessToken
    });
}

function createFeedback(data, accessToken = '') {
    let url = BASE_FEEDBACK;
    return httpDefault(METHOD.post, url, { body: data, token: accessToken });
}


function updateFeedback(data, accessToken = '') {
    let url = `${BASE_FEEDBACK}/${data._id}/content`;
    return httpDefault(METHOD.put, url, { token: accessToken });
}

function deleteFeedback(data, accessToken = '') {
    let url = `${BASE_FEEDBACK}/${data._id}`;
    return httpDefault(METHOD.del, url, { token: accessToken });
}