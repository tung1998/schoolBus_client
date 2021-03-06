import './parentRequest.html';
import {
    Meteor
} from 'meteor/meteor';
import {
    MeteorCall,
    handleError,
    handleSuccess,
    getJsonDefault
} from '../../../../functions'

import {
    _METHODS,
    _SESSION,
    _FEEDBACK,
    _REQUEST
} from '../../../../variableConst'

let accessToken;
Template.parentRequest.onCreated(() => {
    accessToken = Cookies.get('accessToken')
    Session.set('requests', [])
    Session.set('nextTrip', [])
})

Template.parentRequest.helpers({
    students() {
        return Session.get(_SESSION.students)
    },
    nextTrip() {
        return Session.get('nextTrip')
    },
    requests() {
        return Session.get('requests')
    }
})

Template.parentRequest.onRendered(() => {
    reloadData()
    $(`#time`).datepicker({
        language: "vi",
        autoclose: true,
        dateFormat: 'DD/MM/YYYY',
        disableTouchKeyboard: true,
        ignoreReadonly: true,
    })
})

Template.parentRequest.onDestroyed(() => {
    Session.delete('nextTrip')
    Session.delete('requests')
})

Template.parentRequest.events({
    'click #sendRequest': sendRequest,
    'change input[type=radio][name=chooseType]': chooseTypeChange,
    'change #student': studentChange,
})

Template.requestHtml.helpers({
    requestType() {
        return getJsonDefault(_REQUEST.type, 'number', this.type)
    },
    requestStatus() {
        return getJsonDefault(_REQUEST.status, 'number', this.status)
    },
    requestTime() {
        if (this.tripID && this.trip)
            return moment(this.trip.startTime).format("l")
        return moment(this.time).format("l")
    }
})

// function getFutureTrip

function reloadData() {
    MeteorCall(_METHODS.ParentRequest.GetAll, null, accessToken).then(result => {
        Session.set('requests', result.data)
    }).catch(handleError)
    let studentID = FlowRouter.getQueryParam("studentID")
    if (studentID) $('#student').val(studentID)
    MeteorCall(_METHODS.trip.GetAllNext, {
        studentID: $('#student').val()
    }, accessToken).then(result => {
        let tripHtml = result.map(item => {
            let startTime = moment(item.startTime).format('llll')
            return `<option value="${item._id}">${item.route.name}-${startTime}</option>`
        })
        $('#trip').html(tripHtml.join(''))
        if (FlowRouter.getQueryParam("tripID"))
            $('#trip').val(FlowRouter.getQueryParam("tripID"))
    }).catch(handleError)
}

function sendRequest(e) {
    let data = {
        studentID: $('#student').val(),
        type: parseInt($("input[name='requestType']:checked").val()),
        note: $('#note').val(),
    }
    let chooseType = parseInt($("input[name='chooseType']:checked").val())
    if (chooseType == 1) data.tripID = $('#trip').val()
    else data.time = moment($("#time").val(), "DD/MM/YYYY").valueOf()
    if (data.time || data.tripID)
        MeteorCall(_METHODS.ParentRequest.Create, data, accessToken).then(result => {
            handleSuccess('Đã gửi yêu cầu thành công, Đợi giáo viên xác nhận!')
            let studentData = Session.get(_SESSION.students).filter(item => item._id == data.studentID)[0]
            MeteorCall(_METHODS.notification.sendFCMToMultiUser, {
                userIds: [studentData.class.teacher._id],
                title: "Học sinh xin nghỉ",
                text: `Học sinh ${studentData.user.name} muốn xin nghỉ!`
            }, accessToken)
            reloadData()
        }).catch(handleError)
    else handleError(null, 'Vui lòng điền đầy đủ thông tin!')
}

function chooseTypeChange(e) {
    let value = e.currentTarget.value
    if (value == 1) {
        $('#time').parent().parent().addClass('kt-hidden')
        $('#trip').parent().parent().removeClass('kt-hidden')
    } else {
        $('#time').parent().parent().removeClass('kt-hidden')
        $('#trip').parent().parent().addClass('kt-hidden')
    }
}

function studentChange(e) {
    let studentID = $('#student').val()
    MeteorCall(_METHODS.trip.GetAllNext, {
        studentID
    }, accessToken).then(result => {
        let tripHtml = result.map(item => {
            let startTime = moment(item.startTime).format('llll')
            return `<option value="${item._id}">${item.route.name}-${startTime}</option>`
        })
        $('#trip').html(tripHtml.join(''))
    }).catch(handleError)
}