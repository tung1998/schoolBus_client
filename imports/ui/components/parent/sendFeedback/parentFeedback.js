import './parentFeedback.html';
const Cookies = require('js-cookie');
import {
    MeteorCall,
    handleError
} from '../../../../functions'

import {
    _METHODS
} from '../../../../variableConst'

let accessToken;
Template.parentFeedback.onCreated(() => {
    accessToken = Cookies.get('accessToken')
})

Template.parentFeedback.rendered = () => {
}

Template.parentFeedback.events({
    'click #sendFeedback': sendFeedbackClick
})


function sendFeedbackClick(e) {
    let data = {
        title: $('#title').val(),
        type: parseInt($("input[name='feedbackType']:checked").val()),
        content: $('#content').val(),
    }
    console.log(data)
}