import './studentInfo.html';
const Cookies = require("js-cookie");

import {
    FlowRouter
} from 'meteor/kadira:flow-router';

import {
    MeteorCall,
    handleError,
    handleConfirm
} from "../../../../functions";

import {
    _METHODS, _URL_images
} from "../../../../variableConst";

let accessToken;

Template.studentInfo.onCreated(() => {
    accessToken = Cookies.get("accessToken");
    Session.set('studentInfo', {})
});

Template.studentInfo.onRendered(() => {
    reloadData()
});

Template.studentInfo.onDestroyed(() => {
    Session.delete('studentInfo')
});

Template.studentInfo.helpers({
    studentInfo() {
        return Session.get('studentInfo')
    },
    _URL_images() {
        return _URL_images
    },
});


function reloadData() {
    let studentID = FlowRouter.getParam('studentID')
    console.log(studentID)
    MeteorCall(_METHODS.student.GetById, { _id: studentID }, accessToken).then(result => {
        console.log(result)
        Session.set('studentInfo', result)
    })
}