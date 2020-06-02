import './childrenInfo.html';
const Cookies = require("js-cookie");

import {
    MeteorCall,
    handleError,
    handleConfirm
} from "../../../../functions";

import {
    _METHODS,
    _URL_images
} from "../../../../variableConst";

let accessToken;

Template.childrenInfo.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.childrenInfo.onRendered(() => {

});

Template.childrenInfo.events({
    'click .next-tripBtn': getNextTripData,
    'click .chat-btn': chatBtnClick,
    'click #absentRequest': absentRequestBtnClick
});

Template.childrenInfo.helpers({
    students() {
        return Session.get('students')
    }
});

Template.childrenNextripModal.helpers({
    nextTripData() {
        return Session.get('nextTripData')
    },
    _URL_images() {
        return _URL_images
    }
});

Template.childrenHtml.helpers({
    _URL_images() {
        return _URL_images
    }
});


function getNextTripData(e) {
    let studentID = e.currentTarget.getAttribute('studentID')
    MeteorCall(_METHODS.trip.GetNext, {
        studentID
    }, accessToken).then(result => {
        if (result) {
            result.startTime = moment(result.startTime).locale('vi').format('LLLL')
            Session.set('nextTripData', result)
            console.log(Session.get('nextTripData'));
            $("#childrenNextripModal").attr('studentID', studentID).modal('show')
        } else {
            handleError(null, 'Không có chuyến đi sắp tới')
        }
    }).catch(error => {
        handleError(error, 'Không có chuyến đi sắp tới')
    })
}

function chatBtnClick(e) {
    let teacherID = e.currentTarget.getAttribute('teacherID')
    console.log(teacherID)
    handleConfirm('Chuyển sang trang trao đổi với giáo viên?').then(result=>{
        if(result.value)
            FlowRouter.go(`/parent/chat?teacherID=${teacherID}`)
    })
}

function absentRequestBtnClick(e) {
    let studentID = $("#childrenNextripModal").attr('studentID')
    let tripID = $("#childrenNextripModal").attr('tripID')

    $("#childrenNextripModal").modal('hide')
    console.log(studentID, tripID)
    handleConfirm('Bạn muốn xin nghỉ cho con?').then(result => {
        if (result.value) {
            FlowRouter.go(`/parent/request?studentID=${studentID}&tripID=${tripID}`)
        }
    })
}