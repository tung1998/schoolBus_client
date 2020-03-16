import {
    FlowRouter
} from 'meteor/kadira:flow-router';
import {
    BlazeLayout
} from 'meteor/kadira:blaze-layout';

import {
    MeteorCall,
    redirectLogin
} from '../../functions'

import {
    _METHODS,
} from '../../variableConst'

Blaze._allowJavascriptUrls()

import {
    _SESSION
} from './../../variableConst'
// Set up all routes in the app

FlowRouter.triggers.enter([function (context, redirect) {
    let accessToken = Cookies.get('accessToken');
    if (!accessToken) FlowRouter.go('/login');
    else {
        console.log(accessToken)
        MeteorCall(_METHODS.token.GetUserInfo, null, accessToken).then(result => {
            console.log(result)
            localStorage.setItem(_SESSION.modules, JSON.stringify(result.modules))
            Session.set(_SESSION.userID, result.userID)
            Session.set(_SESSION.username, result.user.username)
        }).catch(e => {
            console.log(e)
            Cookies.remove('accessToken');
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
        BlazeLayout.setRoot('body');
        if (accessToken) {
            console.log(accessToken)
            MeteorCall(_METHODS.token.GetUserInfo, null, accessToken).then(result => {
                console.log(result)
                localStorage.setItem(_SESSION.modules, JSON.stringify(result.modules))
                Session.set(_SESSION.userID, result.userID)
                Session.set(_SESSION.username, result.user.username)
                FlowRouter.go('/profile')
            }).catch(e => {
                console.log(e)
                BlazeLayout.render('App_body', {
                    main: 'login'
                });
            });
        } else {
            BlazeLayout.render('App_body', {
                main: 'login'
            });
        }
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

FlowRouter.notFound = {
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_notFound'
        });
    },
};