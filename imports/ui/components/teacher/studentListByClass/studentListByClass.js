import './studentListByClass.html';
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

Template.studentListByClass.onCreated(() => {
    accessToken = Cookies.get("accessToken");
    Session.set('classData', {})
    Session.set('studentList', [])
    Session.set('studenInfoData', {})
});

Template.studentListByClass.onRendered(() => {
    reloadData()
});

Template.studentListByClass.onDestroyed(() => {
    Session.delete('classData')
    Session.delete('studentList')
});

Template.studentListByClass.helpers({
    classData() {
        return Session.get('classData')
    },
    studentList() {
        return Session.get('studentList')
    }
});

Template.studentListByClass.events({
    'click .info-button': showStudentInfo
});

Template.studentInfoModal2.helpers({
    studenInfoData(){
        return Session.get('studenInfoData')
    }
});

function reloadData() {
    let classID = FlowRouter.getParam('idClass')
    MeteorCall(_METHODS.class.GetById, {
        _id: classID
    }, accessToken).then(result => {
        console.log(result)
        Session.set('classData', result)
    }).catch(handleError)
    MeteorCall(_METHODS.student.GetByClass, {
        classID: classID
    }, accessToken).then(result => {
        result.map((item, index) => {
            item.index = index + 1
            return item
        })
        console.log(result)
        Session.set('studentList', result)
    }).catch(handleError)
}

function showStudentInfo(e) {
    let studentID = e.currentTarget.getAttribute('studentID')
    console.log(studentID)
    MeteorCall(_METHODS.student.GetById, { _id: studentID }, accessToken).then(studenInfoData => {
        console.log(studenInfoData)
        if(studenInfoData.student.user.image){
            studenInfoData.image = `${_URL_images}/${studenInfoData.student.user.image}/0`
        }else{
            studenInfoData.image = `/assets/media/users/user5.jpg`
        }
        $("#studentInfoModal").modal("show")
    }).catch(handleError)
}