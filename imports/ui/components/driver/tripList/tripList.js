import './tripList.html';
import { MeteorCall, getJsonDefault, handleError } from '../../../../functions';
import { _METHODS, _TRIP, _URL_images, LIMIT_DOCUMENT_PAGE, _USER } from '../../../../variableConst';

Template.tripList.onCreated(() => {
    accessToken = Cookies.get('accessToken')
    Session.set('tripList', [])
})

Template.tripList.onRendered(() => {
    reloadData()
})

Template.tripList.onDestroyed(() => {
    Session.delete('tripList')
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
        return moment(this.startTime).format("DD/MM/YYYY, HH:MM")
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
                tripList = await MeteorCall(_METHODS.trip.GetByPage, {
                    page: page,
                    limit: limitDocPerPage,
                    options: [{
                        text: "status",
                        value: _TRIP.status.finish.number,
                    }]
                }, accessToken)
            case 'parent.tripHistoryStudent':
                tripList = await MeteorCall(_METHODS.trip.GetByStudent, {
                    page: page,
                    limit: limitDocPerPage,
                    studentID: FlowRouter.getParam("studentID"),
                    options: [{
                        text: "status",
                        value: _TRIP.status.finish.number,
                    }]
                }, accessToken)
            case 'parent.nextTripStudent':
                tripList = await MeteorCall(_METHODS.trip.GetAllNext, {
                    studentID: FlowRouter.getParam("studentID"),
                }, accessToken)
            case 'teacher.studentTripHistory':
                tripList = await MeteorCall(_METHODS.trip.GetByStudent, {
                    page: page,
                    limit: limitDocPerPage,
                    studentID: FlowRouter.getParam("studentID"),
                    options: [{
                        text: "status",
                        value: _TRIP.status.finish.number,
                    }]
                }, accessToken)
            case 'teacher.studentNextTrip':
                tripList = await MeteorCall(_METHODS.trip.GetAllNext, {
                    studentID: FlowRouter.getParam("studentID"),
                }, accessToken)
            default:
                tripList = await MeteorCall(_METHODS.trip.GetAllNext, {}, accessToken)
        }
        Session.set('tripList', tripList)
    } catch (e) {
        handleError(e)
    }
}

function openStudentTripModalBtnClick(e) {
    let tripList = Session.get('tripList')
    let tripID = e.currentTarget.getAttribute('tripID')
    let tripData = tripList.filter(item=>item._id==tripID)[0]
    Session.set('tripData', tripData)
    $('#childrenNextripModal').modal('show')
}