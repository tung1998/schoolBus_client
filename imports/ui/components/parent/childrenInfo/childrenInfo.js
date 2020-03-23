import './childrenInfo.html';
const Cookies = require("js-cookie");

import {
    MeteorCall,
    handleError
} from "../../../../functions";

import {
    _METHODS
} from "../../../../variableConst";

let accessToken;

Template.childrenInfo.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.childrenInfo.onRendered(() => {
    MeteorCall(_METHODS.token.GetUserInfo,null,accessToken).then(result=>{
        console.log(result)
    }).catch(handleError)
});

Template.childrenInfo.events({

});