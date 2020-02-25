import './parrentRequest.html';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'
const Cookies = require('js-cookie');
import {
    MeteorCall,
    handleError
} from '../../../../functions'

import {
    _METHODS
} from '../../../../variableConst'

let accessToken;
Template.absentRequest.onCreated(() => {
    accessToken = Cookies.get('accessToken')
})

Template.absentRequest.rendered = () => {
    setFormHeight()
}

Template.absentRequest.events({
    'submit form': (event) => {
        event.preventDefault();
        $(document).ready(() => {
            let countCheck = 0,
                reportType;
            for (let i = 1; i <= 3; i++) {
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
                let request = {
                    requestID: '5e536e400a36ed5f0c2a5ba0',
                    studentID: '5e536e4012e5f0c2as435ba0',
                    content: document.getElementById("content").value,
                    approve: 0,
                    //createdTime: Date.now(),
                    //updatedTime: Date.now(),
                    // isDeleted: false,
                }
                console.log(request)
                MeteorCall(_METHODS.ParrentRequest.Create, request, accessToken).then(result => {
                    console.log(result)
                }).catch(handleError)
            } else {
                alert("Xin hãy chọn mục.")
            }

        })

    }
})

function setFormHeight() {
    let windowHeight = $(window).height();
    let formHeight = $("#absentRequest").height();
    let footerHeight = $("#kt_footer").height();
    let topBarHeight = $("#kt_header").height();

    if ($(window).width() < 1024) {
        topBarHeight = $("#kt_header_mobile").height();
        $("#absentRequest").css({
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
        $("#absentRequest").css({
                "height": windowHeight - topBarHeight - 2 * footerHeight - 17
            })
            //$("#kt_wrapper").css({
            //  "padding-top": 60
            //  })
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