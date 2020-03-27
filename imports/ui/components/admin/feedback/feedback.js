import "./feedback.html";

const Cookies = require("js-cookie");

import {
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm,
    addPaging,
    getLimitDocPerPage,
    handlePaging,
    getJsonDefault
} from "../../../../functions";

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE,
    _SESSION,
    _URL_images,
    _FEEDBACK
} from "../../../../variableConst";

let accessToken;
let currentPage = 1;

Template.feedback.onCreated(() => {
    accessToken = Cookies.get("accessToken");
    Session.set('feedback', [])
});

Template.feedback.onRendered(() => {
    addPaging($('#feedbackTable'));
    reloadData(1, getLimitDocPerPage())
});

Template.feedback.onDestroyed(() => {
    Session.delete('feedback')
});

Template.feedback.events({

});

Template.feedback.helpers({
    feedback() {
        return Session.get('feedback')
    }
});

Template.feedbackRow.helpers({
    feedbackType() {
        return feedbackType = getJsonDefault(_FEEDBACK.type, 'number', this.type)
    },
    feedbackStatus() {
        return feedbackType = getJsonDefault(_FEEDBACK.status, 'number', this.status)
    },
    createdTime() {
        return moment(this.createdTime).format('l')
    },
});


function reloadData(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE, options = null) {
    let table = $('#table-body');
    MeteorCall(_METHODS.feedback.GetByPage, {
        page: page,
        limit: limitDocPerPage,
        options
    }, accessToken).then(result => {
        console.log(result)
        handlePaging(table, result.count, page, limitDocPerPage)
        Session.set('feedback', result.data.map((key, index) => {
            key.index = index + (result.page - 1) * limitDocPerPage + 1;
            return key;
        }))
    })
}