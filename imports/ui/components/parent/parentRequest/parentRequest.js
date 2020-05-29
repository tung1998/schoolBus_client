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
    _METHODS, _SESSION, _FEEDBACK, _REQUEST
} from '../../../../variableConst'

let accessToken;
Template.parentRequest.onCreated(() => {
    accessToken = Cookies.get('accessToken')
    Session.set('requests', [])
})

Template.parentRequest.helpers({
    students() {
        return Session.get(_SESSION.students)
    },
    requests() {
        return Session.get('requests')
    }
})

Template.parentRequest.onRendered(() => {
    reloadData()
    
    let studentID = FlowRouter.getParam("studentID")
    let tripID = FlowRouter.getParam("tripID")

    $(`#time`).datepicker({
        language: "vi",
        autoclose: true,
        dateFormat: 'DD/MM/YYYY'
    })

    if (studentID) $('#student').val(studentID)
})

Template.parentRequest.events({
    'click #sendRequest': sendRequest,
    'change input[type=radio][name=chooseType]': chooseTypeChange
})

Template.requestHtml.helpers({
    requestType() {
        return getJsonDefault(_REQUEST.type, 'number', this.type)
    },
    requestStatus() {
        return getJsonDefault(_REQUEST.status, 'number', this.status)
    },
    requestTime(){
        return moment(this.time).format("l")
    }
})

// function getFutureTrip

function reloadData() {
    MeteorCall(_METHODS.ParrentRequest.GetAll, null, accessToken).then(result=>{
        console.log(result)
        Session.set('requests', result.data)
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
        MeteorCall(_METHODS.ParrentRequest.Create, data, accessToken).then(result => {
            handleSuccess('Đã gửi yêu cầu thành công, Đợi giáo viên xác nhận!')
        }).catch(handleError)
    else handleError(null, 'Vui lòng điền đầy đủ thông tin!')
}

function chooseTypeChange(e) {
    let value = e.currentTarget.value
    if (value == 1) {
        $('#time').parent().parent().addClass('kt-hidden')
        $('#trip').parent().parent().removeClass('kt-hidden')
    }
    else {
        $('#time').parent().parent().removeClass('kt-hidden')
        $('#trip').parent().parent().addClass('kt-hidden')
    }
}