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
    parentRequestList() {
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
    isConfirmed(){
        return Session.get("parentRequestData").status==_REQUEST.status.confirmed.number
    }
})

Template.absentRequestManager.events({
    'click .parentRequestDataModal': parentRequestDataModalCLick,
    'click #confirmRequestBtn': confirmRequestBtnCLick,
})

function reloadData() {
    MeteorCall(_METHODS.ParentRequest.GetAll, null, accessToken).then(result => {
        Session.set("parentRequestList", result.data)
    }).catch(handleError)
}

function parentRequestDataModalCLick(e) {
    let parentRequestId = e.currentTarget.getAttribute('parentRequestId')
    let parentRequestData = Session.get("parentRequestList").filter(item => item._id == parentRequestId)[0]
    if (parentRequestData.tripID && parentRequestData.trip)
        parentRequestData.requestTime = moment(parentRequestData.trip.startTime).format("l")
    else parentRequestData.requestTime = moment(parentRequestData.time).format("l")
    parentRequestData.parentRequestStatus = getJsonDefault(_REQUEST.status, 'number', parentRequestData.status)
    Session.set("parentRequestData", parentRequestData)
    $("#absentActionModal").modal('show')
}

function confirmRequestBtnCLick(e) {
    let requestID = e.currentTarget.getAttribute("requestID")
    handleConfirm("Xác nhận học sinh xin nghỉ").then(result => {
        if (result.value)
            return MeteorCall(_METHODS.ParentRequest.Confirm, {
                _id: requestID
            }, accessToken)
    }).then(result => {
        handleSuccess("Đã xin nghỉ thành công")
        let parentRequestData = Session.get("parentRequestData")
        let parentIDs = parentRequestData.student.parents.map(item => item._id)
        MeteorCall(_METHODS.notification.sendFCMToMultiUser, {
            userIds: parentIDs,
            title: "Xác nhận xin nghỉ",
            text: `Học sinh ${parentRequestData.student.user.name} được phép nghỉ!`
        }, accessToken)
        reloadData()
        $("#absentActionModal").modal('hide')
    }).catch(e => {
        handleError(e, "Không tìm thấy chuyến đi phù hợp!")
    })
}