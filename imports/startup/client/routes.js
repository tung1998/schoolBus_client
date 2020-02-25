import {
    FlowRouter
} from 'meteor/kadira:flow-router';
import {
    BlazeLayout
} from 'meteor/kadira:blaze-layout';
import {
    MeteorCall
} from '../../functions';

Blaze._allowJavascriptUrls()

// Set up all routes in the app

FlowRouter.route('/', {
    name: 'App.home',
    action() {
        BlazeLayout.setRoot('body');
        let accessToken = Cookies.get('accessToken');
        console.log(123)
        MeteorCall('user.getCurrentInfor', null, accessToken).then(result => {
            if (result && result.user) {
                FlowRouter.go('/profile');
            } else {
                alertify.error('Đã có lỗi xảy ra');
            }
        }).catch(e => {
            if (e && e.error) {
                console.log("1ss23", e)
                FlowRouter.redirect('/login');
                redirectLogin();
            }
        });
    },
});

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

FlowRouter.route('/profile', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'profile',
        });
    },
});


function getUserInfo() {
    let accessToken = Cookies.get('accessToken')
    console.log(accessToken)
    return MeteorCall('user.getCurrentInfor')
}