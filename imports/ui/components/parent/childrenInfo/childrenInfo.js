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
    _TRIP, _TRIP_STUDENT,
    TIME_DEFAULT
} from "../../../../variableConst";

import {
    COLLECTION_TASK
} from '../../../../api/methods/task.js'

let accessToken;

Template.childrenInfo.onCreated(() => {
    accessToken = Cookies.get("accessToken");
    Meteor.subscribe('task.byName', 'Trip');
});

Template.childrenInfo.onRendered(() => {
    this.realTimeTracker = Tracker.autorun(() => {
        let task = COLLECTION_TASK.find({
            name: 'Trip'
        }).fetch()
        if (task.length && task[0].tasks.length && task[0].updatedTime > Date.now() - TIME_DEFAULT.check_task) {
            console.log(task);
            
        }
    });
});

Template.childrenInfo.onDestroyed(() => {
    Session.delete('studentID')
    Session.delete('students')

    if (this.realTimeTracker) this.realTimeTracker.stop()
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
        if (Session.get('tripData')) {
            return moment(Session.get('tripData').startTime).format("DD/MM/YYYY, HH:mm")
        }
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
    },
    reachCarstopTime(){
        let tripData = Session.get('tripData')
        let studentInfo = Session.get('students').filter(item=>item._id==Session.get('studentID'))[0]
        if(studentInfo){
            let carStopDelayTime = tripData.route.carStops.filter(item=>item.carStopID==studentInfo.carStopID)[0].delayTime
            let delayTime = Session.get('tripData').delayTime||0
            if(carStopDelayTime&&Session.get('tripData').delayTime) 
                return moment(Session.get('tripData').startTime+(Number(carStopDelayTime)+delayTime)*60*1000).format("DD/MM/YYYY, HH:mm")
                return moment(Session.get('tripData').startTime).format("DD/MM/YYYY, HH:mm")
        }
        return 
    },
    delayTime(){
        return Session.get('tripData').delayTime
    },
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
        handleError(error, 'Không có chuyến đi sắp tới', 'warning')
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