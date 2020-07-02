import './absentRequestManager.html';

import {
    MeteorCall,
    handleError,
    handleConfirm,
    getJsonDefault,
    getSendNotiUserIDs,
    handleSuccess
} from '../../../../functions'

import {
    _METHODS,
    _URL_images,
    _TRIP,
    TIME_DEFAULT,
    _SESSION,
    _REQUEST
} from '../../../../variableConst'
const Cookies = require("js-cookie");

let accessToken

Template.absentRequestManager.onCreated(() => {
    accessToken = Cookies.get("accessToken");
    Session.set("parentRequestList", [])
    Session.set("parentRequestData", {})
})

Template.absentRequestManager.onRendered(() => {
    reloadData()
})

Template.absentRequestManager.onDestroyed(() => {
    Session.delete("parentRequestList")
    Session.delete("parentReqestData")
})

Template.absentRequestManager.helpers({
    parrentRequestList() {
        return Session.get("parentRequestList")
    }
})

Template.parentRequestRow.helpers({
    requestTime() {
        if (this.tripID && this.trip)
            return moment(this.trip.startTime).format("l")
        return moment(this.time).format("l")
    },
    parentReqestStatus() {
        return getJsonDefault(_REQUEST.status, 'number', this.status)
    },
})

Template.absentActionModal.helpers({
    parentReqestData() {
        return Session.get("parentRequestData")
    },
})

Template.absentRequestManager.events({
    'click .parentRequestDataModal': parentRequestDataModalCLick,
    'click #confirmRequestBtn': confirmRequestBtnCLick,
})

function reloadData() {
    MeteorCall(_METHODS.ParrentRequest.GetAll, null, accessToken).then(result => {
        console.log(result)
        Session.set("parentRequestList", result.data)
    }).catch(handleError)
}

function parentRequestDataModalCLick(e) {
    let parentRequestId = e.currentTarget.getAttribute('parentRequestId')
    let parentRequestData = Session.get("parentRequestList").filter(item => item._id == parentRequestId)[0]
    Session.set("parentRequestData", parentRequestData)
    $("#absentActionModal").modal('show')
}

function confirmRequestBtnCLick(e) {
    let tripID = e.currentTarget.getAttribute("tripID")
    let time = e.currentTarget.getAttribute("time")
    let studentID = e.currentTarget.getAttribute("studentID")
    handleConfirm("Xác nhận học sinh xin nghỉ").then(result => {
        if (result.value)
            return MeteorCall(_METHODS.trip.ParentRequestByTime, {
                tripID, time, studentID
            }, accessToken)
    }).then(result => {
        handleSuccess("Đã xin nghỉ thành công")
        let parentRequestData = Session.get("parentRequestData")
        let parentIDs= parentRequestData.student.parents.map(item=>item._id)
        MeteorCall(_METHODS.notification.sendFCMToMultiUser, {
            userIds: parentIDs,
            title: "Xác nhận xin nghỉ",
            text: `Học sinh ${parentRequestData.student.user.name} được phép nghỉ!`
        }, accessToken)
    }).catch(e => {
        handleError(e, "Không tìm thấy chuyến đi phù hợp!")
    })
}