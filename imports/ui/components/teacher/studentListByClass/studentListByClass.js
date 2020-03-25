import './studentListByClass.html';
const Cookies = require("js-cookie");

import {
    FlowRouter
} from 'meteor/kadira:flow-router';

import {
    MeteorCall,
    handleError
} from "../../../../functions";

import {
    _METHODS, _URL_images
} from "../../../../variableConst";

let accessToken;

Template.studentListByClass.onCreated(() => {
    accessToken = Cookies.get("accessToken");
    Session.set('classData',{})
    Session.set('studentList',[])
});

Template.studentListByClass.onRendered(() => {
    reloadData()
});

Template.studentListByClass.onDestroyed(() => {
    Session.delete('classData')
    Session.delete('studentList')
});

Template.studentListByClass.helpers({
    classData(){
        return Session.get('classData')
    },
    studentList(){
        return Session.get('studentList')
    }
});

Template.studentListByClass.events({

});

function reloadData(){
    let classID = FlowRouter.getParam('idClass')
    MeteorCall(_METHODS.class.GetById, {
        _id: classID
    }, accessToken).then(result => {
        console.log(result)
        Session.set('classData',result)
    }).catch(handleError)
    MeteorCall(_METHODS.student.GetByClass, {
        classID: classID
    }, accessToken).then(result => {
        result.map((item, index)=>{
            item.index = index+1
            return item
        })
        console.log(result)
        Session.set('studentList',result)
    }).catch(handleError)
}