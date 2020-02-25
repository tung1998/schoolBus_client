import './header.html';
import {
    FlowRouter
} from 'meteor/kadira:flow-router';

Template.header.events({
    'click #signOut': sightOutClick
})

function sightOutClick(){
    Cookies.remove('accessToken');
    FlowRouter.go('/login')
}