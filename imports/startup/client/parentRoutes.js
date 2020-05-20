<<<<<<< HEAD
const parentRoutes = FlowRouter.group({
    prefix: "/parent",
    name: "parentRoutes",
});

parentRoutes.route('/childrenInfo', {
    name: 'parent.childrenInfo',
    action() {
        BlazeLayout.setRoot('body');
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'childrenInfo',
        });
    },
});

parentRoutes.route('/feedback', {
    name: 'parent.feedback',
    action() {
        BlazeLayout.setRoot('body');
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'parentFeedback',
        });
    },
});

parentRoutes.route('/request', {
    name: 'parent.request',
    action() {
        BlazeLayout.setRoot('body');
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'parentRequest',
        });
    },
});

parentRoutes.route('/chat', {
    name: 'parent.chat',
    action() {
        BlazeLayout.setRoot('body');
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'chatTeacher',
        });
    },
=======
const parentRoutes = FlowRouter.group({
    prefix: "/parent",
    name: "parentRoutes",
});

parentRoutes.route('/childrenInfo', {
    name: 'car.manager',
    action() {
        BlazeLayout.setRoot('body');
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'childrenInfo',
        });
    },
});

parentRoutes.route('/feedback', {
    name: 'car.manager',
    action() {
        BlazeLayout.setRoot('body');
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'parentFeedback',
        });
    },
});

parentRoutes.route('/request', {
    name: 'car.manager',
    action() {
        BlazeLayout.setRoot('body');
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'parentRequest',
        });
    },
});

parentRoutes.route('/chat', {
    name: 'parents.chat',
    action() {
        BlazeLayout.setRoot('body');
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'chatTeacher',
        });
    },
>>>>>>> a19aa0636d498d2983a7990aa63f507bc4d3a6b5
});