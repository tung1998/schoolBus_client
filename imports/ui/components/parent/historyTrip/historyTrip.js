import './historyTrip.html';
const Cookies = require("js-cookie");
import {
    MeteorCall,
    handleError,
    handleConfirm
} from "../../../../functions";

import {
    _METHODS,
    _URL_images
} from "../../../../variableConst";

Template.tripHistoryStudent.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.tripHistoryStudent.onRendered(() => {
    // MeteorCall(_METHODS.trip.tripHistoryStudent)
})


Template.tripHistoryStudent.events({

});

Template.tripHistoryStudent.helpers({
    studentInfo() {
        return Session.get('studentInfo')
    }
});