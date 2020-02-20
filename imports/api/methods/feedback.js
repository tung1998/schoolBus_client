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
        'feedback.getById': getFeedbackById,
        'feedback.update': updateFeedback,
        'feedback.delete': deleteFeedback,
    });
}

function getFeedbacks(accessToken = '') {
    let url = BASE_FEEDBACK;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

function getFeedbackById(data, accessToken = '') {
    let url = `${BASE_FEEDBACK}/${data._id}`;
    return httpDefault(METHOD.get, url, { token: accessToken });
}

function createFeedback(data, accessToken = '') {
    let url = BASE_FEEDBACK;
    return httpDefault(METHOD.post, url, { token: accessToken });
}


function updateFeedback(data, accessToken = '') {
    let url = `${BASE_FEEDBACK}/${data._id}/content`;
    return httpDefault(METHOD.put, url, { token: accessToken });
}

function deleteFeedback(data, accessToken = '') {
    let url = `${BASE_FEEDBACK}/${data._id}`;
    return httpDefault(METHOD.del, url, { token: accessToken });
}