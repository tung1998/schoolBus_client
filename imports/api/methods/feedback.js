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
        'feedback.getByPage': getFeedbacksByPage,
        'feedback.update': updateFeedback,
        'feedback.delete': deleteFeedback,
        'feedback.response': responseFeedback,
    });
}

function getFeedbacks(accessToken = '') {
    let url = BASE_FEEDBACK;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

function getFeedbacksByPage(accessToken = '', page = 1) {
    let url = `${BASE_FEEDBACK}/${page}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

function createFeedback(feedback, accessToken = '') {
    let url = BASE_FEEDBACK;
    return httpDefault(METHOD.post, url, { token: accessToken });
}


function updateFeedback(feedback, accessToken = '') {
    let url = `${BASE_FEEDBACK}/${feedback._id}/content`;
    return httpDefault(METHOD.put, url, { token: accessToken });
}

function responseFeedback(feedback, accessToken = '') {
    let url = `${BASE_FEEDBACK}/${feedback._id}/response`;
    return httpDefault(METHOD.put, url, { token: accessToken });
}

function deleteFeedback(feedbackID, accessToken = '') {
    let url = `${BASE_FEEDBACK}/${feedbackID}`;
    return httpDefault(METHOD.del, url, { token: accessToken });
}