import './panel.html';
import {
    MeteorCall,
    handleError
} from '../../../../functions'

import {
    _METHODS
} from '../../../../variableConst'

Template.panel.events({
    "click .kt_demo_panel_toggle": openPanel,
    "click #kt_demo_panel_close": closePanel
});

Template.panel.onCreated(function () {

});

Template.panel.onRendered(function () {

});

Template.panel.helpers({

});

function openPanel(e) {
    $("#kt_demo_panel").addClass('kt-demo-panel--on')
}


function closePanel(e) {
    $("#kt_demo_panel").removeClass('kt-demo-panel--on')
}