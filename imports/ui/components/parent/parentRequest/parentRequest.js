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
}