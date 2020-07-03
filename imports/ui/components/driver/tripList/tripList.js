import './tripList.html';
import { MeteorCall, getJsonDefault, handleError } from '../../../../functions';
import { _METHODS, _TRIP, _URL_images, LIMIT_DOCUMENT_PAGE, _USER, TIME_DEFAULT } from '../../../../variableConst';
import {
    COLLECTION_TASK
} from '../../../../api/methods/task.js'

Template.tripList.onCreated(() => {
    accessToken = Cookies.get('accessToken')
    Session.set('tripList', [])
    
    Meteor.subscribe('task.byName', 'Trip');
})

Template.tripList.onRendered(() => {
    reloadData()

    this.realTimeTracker = Tracker.autorun(() => {
        let task = COLLECTION_TASK.find({
            name: 'Trip'
        }).fetch()
        if (task.length && task[0].tasks.length && task[0].updatedTime > Date.now() - TIME_DEFAULT.check_task) {
            reloadData()
        }
    });
})

Template.tripList.onDestroyed(() => {
    Session.delete('tripList')
    Session.delete('tripStudentLog')

    if (this.realTimeTracker) this.realTimeTracker.stop()

})

Template.tripList.helpers({
    tripList() {
        return Session.get('tripList')
    },
    hasData() {
        return Session.get('tripList').length
    },
})

Template.tripList.events({
    'click .openStudentTripModalBtn': openStudentTripModalBtnClick
})

Template.tripHtml2.helpers({
    _URL_images() {
        return _URL_images
    },
    startTime() {
        if (this)
            return moment(this.startTime).format("DD/MM/YYYY, HH:mm")
    },
    tripStatus() {
        return getJsonDefault(_TRIP.status, 'number', this.status)
    },
    isParent() {
        return Session.get('userType') == _USER.type.parent.number
    },
})

async function reloadData(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
    let routeName = FlowRouter.getRouteName()
    let tripList
    try {
        switch (routeName) {
            case 'driver.tripHistory':
                $("#tripListTitle").html('Lịch sử chuyến đi')
                tripList = await MeteorCall(_METHODS.trip.GetByPage, {
                    page: page,
                    limit: limitDocPerPage,
                    options: [{
                        text: "status",
                        value: _TRIP.status.finish.number,
                    }]
                }, accessToken)
                tripList = tripList.data
                break
            case 'parent.tripHistoryStudent':
                $("#tripListTitle").html('Lịch sử chuyến đi')
                tripList = await MeteorCall(_METHODS.trip.GetByStudent, {
                    page: page,
                    limit: limitDocPerPage,
                    studentID: FlowRouter.getParam("studentID"),
                    options: [{
                        text: "status",
                        value: _TRIP.status.finish.number,
                    }]
                }, accessToken)
                break
            case 'parent.nextTripStudent':
                $("#tripListTitle").html('Chuyến đi tiếp theo')
                tripList = await MeteorCall(_METHODS.trip.GetAllNext, {
                    studentID: FlowRouter.getParam("studentID"),
                }, accessToken)
                break
            case 'teacher.studentTripHistory':
                $("#tripListTitle").html('Lịch sử chuyến đi')
                tripList = await MeteorCall(_METHODS.trip.GetByStudent, {
                    page: page,
                    limit: limitDocPerPage,
                    studentID: FlowRouter.getParam("studentID"),
                    options: [{
                        text: "status",
                        value: _TRIP.status.finish.number,
                    }]
                }, accessToken)
                break
            case 'teacher.studentNextTrip':
                $("#tripListTitle").html('Chuyến đi tiếp theo')
                tripList = await MeteorCall(_METHODS.trip.GetAllNext, {
                    studentID: FlowRouter.getParam("studentID"),
                }, accessToken)
                break
            default:
                $("#tripListTitle").html('Chuyến đi tiếp theo')
                tripList = await MeteorCall(_METHODS.trip.GetAllNext, {}, accessToken)
                break
        }
        Session.set('tripList', tripList)
    } catch (e) {
        console.log(e);
        
        handleError(e)
    }
}

function openStudentTripModalBtnClick(e) {
    let tripList = Session.get('tripList')
    let tripID = e.currentTarget.getAttribute('tripID')
    let tripData = tripList.filter(item => item._id == tripID)[0]
    Session.set('tripData', tripData)
    if (tripData.status != _TRIP.status.ready.number) {
        MeteorCall(_METHODS.trip.GetStudentTripLog, {
            tripID,
            studentID: FlowRouter.getParam("studentID")
        }, accessToken).then(tripStudentLog => {
            Session.set('tripStudentLog', tripStudentLog)
        })
    }
    $('#childrenNextripModal').modal('show')
}