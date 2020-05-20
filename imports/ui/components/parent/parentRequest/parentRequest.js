<<<<<<< HEAD
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
=======
import './parentRequest.html';
import {
    Meteor
} from 'meteor/meteor';
import {
    Tracker
} from 'meteor/tracker'
const Cookies = require('js-cookie');
import {
    MeteorCall,
    handleError
} from '../../../../functions'

import {
    _METHODS
} from '../../../../variableConst'

let accessToken;
Template.parentRequest.onCreated(() => {
    accessToken = Cookies.get('accessToken')
})

Template.parentRequest.rendered = () => {}

Template.parentRequest.events({
    'click #sendRequest': sendRequest
})

function sendRequest(e) {
    let data = {
        studentID: $('#student').val(),
        tripID: $('#trip').val(),
        type: parseInt($("input[name='requestType']:checked").val()),
        note: $('#note').val(),
    }
    console.log(data)
}

function renderRequest(request) {
    return `<div class="kt-portlet kt-portlet--height-fluid">
    <div class="kt-portlet__head kt-portlet__head--noborder"></div>
    <div class="kt-portlet__body">
        <!--begin::Widget -->
        <div class="kt-widget kt-widget--user-profile-2">
            <div class="kt-widget__head">
                <div class="kt-widget__media">
                    <img class="kt-widget__img kt-hidden-" src="${_URL_images}/${request.user.image}/0" alt="image">
                </div>
                <div class="kt-widget__info">
                    <a href="#" class="kt-widget__username">
                        ${request.user?request.user.name||'':''}
                    </a>
                    <span class="kt-widget__desc">
                        ${request.class?request.class.name||'':''}
                    </span>
                </div>
            </div>
            <div class="kt-widget__body">
                <div class="kt-widget__section">
                    ${request.class&&request.class.school?request.class.school.name||'':''}
                </div>                                        

                <div class="kt-widget__item">
                    <div class="kt-widget__contact">
                        <span class="kt-widget__label">Ngày:</span>
                        <a href="#" class="kt-widget__data">${request.user?request.user.email||'':''}</a>
                    </div>
                    <div class="kt-widget__contact">
                        <span class="kt-widget__label">Lý do:</span>
                        <a href="#" class="kt-widget__data">${request.user?request.user.phone||'':''}</a>
                    </div>
                    <div class="kt-widget__contact">
                        <span class="kt-widget__label">Tình trạng:</span>
                        <span class="kt-widget__data">${request.carStop?request.carStop.name||'':''}</span>
                    </div>
                </div>
            </div>
        </div>         
        <!--end::Widget -->
    </div>
</div>`
>>>>>>> a19aa0636d498d2983a7990aa63f507bc4d3a6b5
}