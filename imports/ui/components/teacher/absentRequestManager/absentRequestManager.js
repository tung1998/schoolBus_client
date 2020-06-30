import './absentRequestManager.html';

import {
    MeteorCall,
    handleError,
    handleConfirm,
    getJsonDefault,
    getSendNotiUserIDs
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
    Session.set("parentRequestList",[])
    Session.set("parentRequestData",{})
})

Template.absentRequestManager.onRendered(() => {
    reloadData()
})

Template.absentRequestManager.onDestroyed(() => {
    Session.delete("parentRequestList")
    Session.delete("parentReqestData")
})

Template.absentRequestManager.helpers({
    parrentRequestList(){
        return Session.get("parentRequestList")
    }
})

Template.parentRequestRow.helpers({
    requestTime(){
        if(this.tripID&&this.trip)
        return moment(this.trip.startTime).format("l")
        return moment(this.time).format("l")
    },
    parentReqestStatus(){
        return getJsonDefault(_REQUEST.status,'number',this.status)
    },
})

Template.absentActionModal.helpers({
    parentReqestData(){
        return Session.get("parentRequestData")
    },
})

Template.absentRequestManager.events({
    'click .parentRequestDataModal':parentRequestDataModalCLick
})

function reloadData() {
    MeteorCall(_METHODS.ParrentRequest.GetAll, null, accessToken).then(result => {
        console.log(result)
        Session.set("parentRequestList",result.data)
    }).catch(handleError)
}

function parentRequestDataModalCLick(e){
    let parentRequestId = e.currentTarget.getAttribute('parentRequestId')
    let parentRequestData = Session.get("parentRequestList").filter(item=>item._id==parentRequestId)
    Session.get("parentRequestData", parentRequestData)
    $("#absentActionModal").modal('show')
}