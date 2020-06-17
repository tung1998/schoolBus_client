import {
    FlowRouter
} from 'meteor/kadira:flow-router';
import {
    BlazeLayout
} from 'meteor/kadira:blaze-layout';

import {
    MeteorCall,
    redirectLogin,
    handleError
} from '../../functions'

import {
    _METHODS,
    _URL_images,
} from '../../variableConst'

Blaze._allowJavascriptUrls()

import {
    _SESSION
} from './../../variableConst'
// Set up all routes in the app

FlowRouter.triggers.enter([function(context, redirect) {
    $('.modal-backdrop').remove()
    let accessToken = Cookies.get('accessToken');
    BlazeLayout.render("login")
    if (!accessToken) FlowRouter.go('/login');
    else {
        MeteorCall(_METHODS.token.GetUserInfo, null, accessToken).then(result => {
            Session.set(_SESSION.modules, result.modules)
                Session.set(_SESSION.userID, result.userID)
                Session.set(_SESSION.username, result.user.username)
                Session.set(_SESSION.userType, result.user.userType)
                if(result.user.userType==0)
                    Session.set(_SESSION.isSuperadmin, result.adminType==0)
                Session.set(_SESSION.name, result.user.name)
                Session.set(_SESSION.avata, `${_URL_images}/${result.user.image}/0`)
                Session.set(_SESSION.schoolID, result.schoolID)
                if(result.students)
                    Session.set(_SESSION.students, result.students)
        }).catch(e => {
            handleError(e)
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
            MeteorCall(_METHODS.token.GetUserInfo, null, accessToken).then(result => {
                Session.set(_SESSION.modules, result.modules)
                Session.set(_SESSION.userID, result.userID)
                Session.set(_SESSION.username, result.user.username)
                Session.set(_SESSION.userType, result.user.userType)
                if(result.user.userType==0)
                    Session.set(_SESSION.isSuperadmin, result.adminType==0)
                Session.set(_SESSION.name, result.user.name)
                Session.set(_SESSION.avata, `${_URL_images}/${result.user.image}/0`)
                Session.set(_SESSION.schoolID, result.schoolID)
                if(result.students)
                    Session.set(_SESSION.students, result.students)
                FlowRouter.go('/profile')
            }).catch(e => {
                handleError(e)
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
        BlazeLayout.render("login"),
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