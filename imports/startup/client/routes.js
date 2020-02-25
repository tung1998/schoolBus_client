import {
    FlowRouter
} from 'meteor/kadira:flow-router';
import {
    BlazeLayout
} from 'meteor/kadira:blaze-layout';

import {
    MeteorCall
} from '../../functions'

import {
    _METHODS
} from '../../variableConst'

Blaze._allowJavascriptUrls()


// Set up all routes in the app

FlowRouter.triggers.enter([function(context, redirect) {
    let accessToken = Cookies.get('accessToken');
    if (!accessToken) FlowRouter.go('/login');
    else {
        MeteorCall(_METHODS.user.GetCurrentInfor, null, accessToken).then(result => {}).catch(e => {
            FlowRouter.redirect('/login');
        });
    }
}], {
    except: ["App.login"]
});


FlowRouter.route('/', {
    name: 'App.home',
    action() {
        FlowRouter.redirect('/profile');
    },
});

FlowRouter.route('/login', {
    name: 'App.login',
    action() {
        let accessToken = Cookies.get('accessToken');
        if (accessToken) {
            MeteorCall(_METHODS.user.GetCurrentInfor, null, accessToken).then(result => {
                FlowRouter.go('/profile')
            }).catch(e => {
                BlazeLayout.setRoot('body');
                BlazeLayout.render('App_body', {
                    main: 'login'
                });
            });
        } else {}
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