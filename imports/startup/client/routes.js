import {
    FlowRouter
} from 'meteor/kadira:flow-router';
import {
    BlazeLayout
} from 'meteor/kadira:blaze-layout';
import { MeteorCall } from '../../ui/components/functions';

Blaze._allowJavascriptUrls()

// Set up all routes in the app

FlowRouter.triggers.enter([function (context, redirect) {
    getUserInfo()
    console.log(context, redirect)
}]);


FlowRouter.route('/login', {
    name: 'App.login',
    triggersEnter: [function() {
        
    }],
    action() {
        BlazeLayout.setRoot('body');
        BlazeLayout.render('App_body', {
            main: 'login'
        });
    },
});

FlowRouter.route('/', {
    name: 'App.home',
    action() {
        BlazeLayout.setRoot('body');
        BlazeLayout.render('App_body', {
            main: 'login'
        });
    },
});

FlowRouter.route('/profile', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'profile',
        });
    },
});


function getUserInfo(){
    let accessToken = Cookies.get('accessToken')
    console.log(accessToken)
    // MeteorCall('user.getByAccessToken')
}