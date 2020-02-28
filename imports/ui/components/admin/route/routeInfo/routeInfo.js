import './routeInfo.html';

import {
    FlowRouter
} from 'meteor/kadira:flow-router';

import {
    MeteorCall,
    handleError,
    handleConfirm,
    handleSuccess
} from '../../../../../functions';

import {
    _METHODS
} from '../../../../../variableConst';

let accessToken

Template.routeInfo.onCreated(() => {
    accessToken = Cookies.get('accessToken');
});

Template.routeInfo.onRendered(() => {
    reloadTable();
});

Template.routeInfo.events({
    // 'click #addRouteButton': clickAddRouteButton,
})

function reloadTable() {
    let routeID = FlowRouter.getParam('id')
    MeteorCall(_METHODS.route.GetById, {
        _id: routeID
    }, accessToken).then(result => {
        console.log(result)
    }).catch(handleError)
}