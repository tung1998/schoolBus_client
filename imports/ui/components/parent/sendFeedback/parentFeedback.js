import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'
import './parentFeedback.html';
const Cookies = require('js-cookie');
import {
    MeteorCall,
    handleError
} from '../../functions'

import {
    _METHODS
} from '../../variableConst'

let accessToken;
Template.parentFeedback.onCreated(() => {
    accessToken = Cookies.get('accessToken')
})

Template.parentFeedback.rendered = () => {
    setFormHeight()
}

Template.parentFeedback.events({
    'submit form': (event) => {
        event.preventDefault();
        $(document).ready(() => {
            let countCheck = 0,
                reportType;
            for (let i = 1; i <= 4; i++) {
                if (document.getElementById(`feedback${i}`).checked) {
                    reportType = i;
                    countCheck++;
                }
                if (countCheck > 1) {
                    alert("Chỉ được chọn một mục! Vui lòng thử lại.")
                    break;
                }
            }
            if (countCheck == 1) {
                let feedback = {
                    userID: '123456',
                    type: reportType,
                    feedback: document.getElementById("content").value,
                    status: 0,
                    responseBy: null,
                    responseTime: null,
                    response: null,
                    createdTime: Date.now(),
                    updatedTime: Date.now(),
                    isDeleted: false,
                }
                MeteorCall(_METHODS.feedback.Create, feedback, accessToken).then(result => {
                    alert("Gửi phản hồi thành công!")
                }).catch(handleError)
            } else {
                alert("Xin hãy chọn mục.")
            }

        })

    }
})

function setFormHeight() {
    let windowHeight = $(window).height();
    let formHeight = $("#parentFeedback").height();
    let footerHeight = $("#kt_footer").height();
    let topBarHeight = $("#kt_header").height();

    if ($(window).width() < 1024) {
        topBarHeight = $("#kt_header_mobile").height();
        $("#parentFeedback").css({
            "height": windowHeight - topBarHeight - 2 * footerHeight + 17
        })
        $('#kt_content').css({
            "padding-top": 0,
            "padding-bottom": 0
        })
    } else {
        $("#parentFeedback").css({
            "height": windowHeight - topBarHeight - 2 * footerHeight - 17
        })
        $("#kt-portlet__body").css({
                "height": windowHeight - topBarHeight - 2 * footerHeight - 17
            })
            //$("#kt_wrapper").css({
            //  "padding-top": 60
            //})
        $('#kt_content').css({
            "padding-top": 0,
            "padding-bottom": 0
        })
    }
    console.log(windowHeight)
    console.log(formHeight)
    console.log(footerHeight)
    console.log(topBarHeight)
}