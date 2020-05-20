import './mobileHeader.html';
import {
    FlowRouter
} from 'meteor/kadira:flow-router';
import {
    _SESSION
} from '../../../../variableConst';
Template.mobileHeader.events({
    'click #signOut': sightOutClick
})

Template.mobileHeader.helpers({
    username() {
        return Session.get(_SESSION.username)
    },
    avata() {
        return Session.get(_SESSION.avata)
    },
    name() {
        return Session.get(_SESSION.name)
    },
})

function sightOutClick() {
    Cookies.remove('accessToken');
    Session.set(_SESSION.name, null)
    Session.set(_SESSION.avata, null)
    Session.set(_SESSION.username, null)
    Session.set(_SESSION.userID, null)
    FlowRouter.go('/login')
}