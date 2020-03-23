import './childrenInfo.html';
const Cookies = require("js-cookie");

import {
    MeteorCall,
    handleError
} from "../../../../functions";

import {
    _METHODS, _URL_images
} from "../../../../variableConst";

let accessToken;

Template.childrenInfo.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.childrenInfo.onRendered(() => {
    MeteorCall(_METHODS.token.GetUserInfo, null, accessToken).then(result => {
        let childrenInfo = result.student
        console.log(childrenInfo)
        $('#childrenList').html(htmlChilrent(childrenInfo))
    }).catch(handleError)
});

Template.childrenInfo.events({

});

function htmlChilrent(childrenInfo) {
    return `<div class="kt-portlet kt-portlet--height-fluid">
                <div class="kt-portlet__head kt-portlet__head--noborder"></div>
                <div class="kt-portlet__body">
                    <!--begin::Widget -->
                    <div class="kt-widget kt-widget--user-profile-2">
                        <div class="kt-widget__head">
                            <div class="kt-widget__media">
                                <img class="kt-widget__img kt-hidden-" src="${_URL_images}/${childrenInfo.user.image}/0" alt="image">
                            </div>
                            <div class="kt-widget__info">
                                <a href="#" class="kt-widget__username">
                                    ${childrenInfo.user?childrenInfo.user.name||'':''}
                                </a>
                                <span class="kt-widget__desc">
                                    ${childrenInfo.class?childrenInfo.class.name||'':''}
                                </span>
                            </div>
                        </div>
                        <div class="kt-widget__body">
                            <div class="kt-widget__section">
                                ${childrenInfo.class&&childrenInfo.class.school?childrenInfo.class.school.name||'':''}
                            </div>                                        

                            <div class="kt-widget__item">
                                <div class="kt-widget__contact">
                                    <span class="kt-widget__label">Email:</span>
                                    <a href="#" class="kt-widget__data">${childrenInfo.user?childrenInfo.user.email||'':''}</a>
                                </div>
                                <div class="kt-widget__contact">
                                    <span class="kt-widget__label">Số điện thoại:</span>
                                    <a href="#" class="kt-widget__data">${childrenInfo.user?childrenInfo.user.phone||'':''}</a>
                                </div>
                                <div class="kt-widget__contact">
                                    <span class="kt-widget__label">Điểm đón:</span>
                                    <span class="kt-widget__data">${childrenInfo.carStop?childrenInfo.carStop.name||'':''}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="kt-widget__footer">
                            <button type="button" class="btn btn-label-warning btn-lg btn-upper">Thông tin chi tiết</button>
                        </div>
                    </div>         
                    <!--end::Widget -->
                </div>
            </div>`
}