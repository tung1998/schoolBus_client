import { Meteor } from "meteor/meteor"

export{
    getFeedbacks,
    getFeedbacksByPage,
    deleteFeedback,
    createFeedback,
    updateFeedback,
    responseFeedback,
}

function getFeedbacks(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('feedback.getAll', accessToken, (err, result) => {
            resolve(result);
        });
    });
}

function getFeedbacksByPage(accessToken = '', page  = 1) {
    return new Promise((resolve, reject) => {
        Meteor.call('feedback.getByPage', accessToken, page, (err, result) => {
            resolve(result);
        });
    });
}

function createFeedback(feedback, accessToken = '', callback) {
    Meteor.call('feedback.create', feedback, accessToken, callback)
}

function updateFeedback(input, accessToken = '', callback) {
    Meteor.call('feedback.update', input, accessToken, callback)
}

function responseFeedback(input, accessToken = '', callback) {
    Meteor.call('feedback.response', input, accessToken, callback)
}

function deleteFeedback(accessToken = '', callback) {
    Meteor.call('feedback.delete', accessToken, callback)
}