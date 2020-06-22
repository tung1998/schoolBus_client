import './childrenInfo.html';
const Cookies = require("js-cookie");

import {
    MeteorCall,
    handleError,
    handleConfirm,
    getJsonDefault
} from "../../../../functions";

import {
    _METHODS,
    _URL_images,
    _TRIP, _TRIP_STUDENT
} from "../../../../variableConst";

let accessToken;

Template.childrenInfo.onCreated(() => {
    accessToken = Cookies.get("accessToken");
    Session.delete('studentID')
    Session.delete('students')
});

Template.childrenInfo.onRendered(() => {

});

Template.childrenInfo.onDestroyed(() => {
    Session.delete('studentID')
    Session.delete('students')
});

Template.childrenInfo.events({
    'click .next-tripBtn': gettripData,
    'click .chat-btn': chatBtnClick,
    'click #absentRequest': absentRequestBtnClick
});

Template.childrenInfo.helpers({
    students() {
        return Session.get('students')
    }
});

Template.childrenNextripModal.helpers({
    startTime() {
        return moment(Session.get('tripData').startTime).format("DD/MM/YYYY, HH:MM")
    },
    tripData() {
        return Session.get('tripData')
    },
    tripStatus() {
        let tripData = Session.get('tripData')
        if (!tripData) return
        return getJsonDefault(_TRIP.status, 'number', tripData.status)
    },
    studentStatus() {
        let tripData = Session.get('tripData')
        if (!tripData) return
        let student = tripData.students.filter(item => item.studentID)[0]
        if (!student) return
        return getJsonDefault(_TRIP_STUDENT.status, 'number', student.status)
    },
    _URL_images() {
        return _URL_images
    },
    tripStudentLog() {
        return Session.get('tripStudentLog')
    },
    isShowPosition() {
        let tripData = Session.get('tripData')
        if (tripData)
            return tripData.status == _TRIP.status.moving.number || tripData.status == _TRIP.status.accident.number
        return false
    },
    isShowRequest() {
        let tripData = Session.get('tripData')
        if (tripData)
            return tripData.status == _TRIP.status.ready.number
        return false
    }
});

Template.childrenHtml.helpers({
    _URL_images() {
        return _URL_images
    }
});


function gettripData(e) {
    let studentID = e.currentTarget.getAttribute('studentID')
    MeteorCall(_METHODS.trip.GetNext, {
        studentID
    }, accessToken).then(result => {
        if (result) {
            result.startTime = moment(result.startTime).locale('vi').format('LLLL')
            Session.set('tripData', result)
            Session.set('studentID', studentID)
            $("#childrenNextripModal").modal('show')
            return MeteorCall(_METHODS.trip.GetStudentTripLog, {
                tripID: result._id,
                studentID
            }, accessToken)
        } else {
            handleError(null, 'Không có chuyến đi sắp tới')
        }
    }).then(tripStudentLog => {
        Session.set('tripStudentLog', tripStudentLog)
    }).catch(error => {
        handleError(error, 'Không có chuyến đi sắp tới')
    })
}

function chatBtnClick(e) {
    let teacherID = e.currentTarget.getAttribute('teacherID')
    handleConfirm('Chuyển sang trang trao đổi với giáo viên?').then(result => {
        if (result.value)
            FlowRouter.go(`/parent/chat?teacherID=${teacherID}`)
    })
}

function absentRequestBtnClick(e) {
    let studentID = Session.get('studentID')
    let tripID = Session.get('tripData')._id

    $("#childrenNextripModal").modal('hide')
    handleConfirm('Bạn muốn xin nghỉ cho con?').then(result => {
        if (result.value) {
            FlowRouter.go(`/parent/request?studentID=${studentID}&tripID=${tripID}`)
        }
    })
}