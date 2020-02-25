import './profile.html';

const Cookies = require("js-cookie");

import { MeteorCall, handleError } from "../../../../functions";

import { _METHODS } from "../../../../variableConst";

let accessToken;

Template.profile.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.profile.onRendered(() => {

});