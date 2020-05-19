import './parentFeedback.html';
const Cookies = require('js-cookie');
import {
    MeteorCall,
    handleError,
    handleSuccess,
    removeDuplicated,
    getJsonDefault
} from '../../../../functions'

import {
    _METHODS,
    _FEEDBACK
} from '../../../../variableConst'

let accessToken;
Template.parentFeedback.onCreated(() => {
    accessToken = Cookies.get('accessToken')
    Session.set('feedback', [1, 2])
})

Template.parentFeedback.onRendered(() => {
    MeteorCall(_METHODS.token.GetUserInfo, null, accessToken).then(result => {
        let listSchool = removeDuplicated(result.students.map(item => item.school), '_id')
        $('#school').html(listSchool.map(item => `<option value="${item._id}">${item.name}</option>`).join(''))
    }).catch(handleError)
    reloadData()
})

Template.parentFeedback.onDestroyed(() => {
    Session.delete('feedback')
})

Template.parentFeedback.events({
    'click #sendFeedback': sendFeedbackClick,
    'click .show-content': showReplyFeedBackClick
})

Template.parentFeedback.helpers({
    feedback() {
        return Session.get('feedback')
    },
})

Template.feedbackHtml.helpers({
    feedbackType() {
        return  feedbackType = getJsonDefault(_FEEDBACK.type, 'number', this.type)
    },
    feedbackStatus() {
        return  feedbackType = getJsonDefault(_FEEDBACK.status, 'number', this.status)
    },
    response() {
        return  this.status==_FEEDBACK.status.response.number
    },
})

function reloadData(limit = 10) {
    MeteorCall(_METHODS.feedback.GetByPage, {
        page: 1,
        limit
    }, accessToken).then(result => {
        console.log(result)
        Session.set('feedback', result.data)
    }).catch(handleError)
}

function sendFeedbackClick(e) {
    let data = {
        title: $('#title').val(),
        type: parseInt($("input[name='feedbackType']:checked").val()),
        content: $('#content').val(),
        schoolID: $('#school').val(),
    }
    if (data.title && data.type && data.content && data.schoolID)
        MeteorCall(_METHODS.feedback.Create, data, accessToken).then(result => {
            handleSuccess('Gủi phản hồi thành công')
            resetInput()
            reloadData()
        }).catch(handleError)
    else handleError(null, "Vui lòng điền đầy đủ thông tin")
}

function resetInput() {
    $('#title').val('')
    $('#content').val('')
}

function showReplyFeedBackClick(e) {
    let responseUser = e.currentTarget.getAttribute('responseUser')
    let responseContent = e.currentTarget.getAttribute('responseContent')
    Swal.fire({
        title: `Người xác nhận: ${responseUser}`,
        text: `Nội dung: ${responseContent}`,
    })
}