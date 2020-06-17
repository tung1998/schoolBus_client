import './listClass.html'
const Cookies = require("js-cookie");

import {
    MeteorCall,
    handleError
} from "../../../../functions";

import {
    _METHODS, _URL_images
} from "../../../../variableConst";

let accessToken;

Template.listClass.onCreated(() => {
    accessToken = Cookies.get("accessToken");
    Session.set('classesInfo',[])
});

Template.listClass.onRendered(() => {
    MeteorCall(_METHODS.class.GetAll, null, accessToken).then(result => {
        Session.set('classesInfo',result.data)
    }).catch(handleError)
});

Template.listClass.helpers({
    classesInfo(){
        return Session.get('classesInfo')
    }
});

Template.listClass.events({

});