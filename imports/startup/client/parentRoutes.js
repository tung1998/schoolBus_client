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

parentRoutes.route('/tripHistory/:studentID([0-9a-fA-F]{24})', {
    name: 'parent.tripHistoryStudent',
    action() {
        BlazeLayout.setRoot('body');
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'tripList',
        });
    },
});

parentRoutes.route('/nextTrip/:studentID([0-9a-fA-F]{24})', {
    name: 'parent.nextTripStudent',
    action() {
        BlazeLayout.setRoot('body');
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'tripList',
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
});

parentRoutes.route('/tripTracking/:tripID([0-9a-fA-F]{24})', {
    name: 'parent.tripTracking',
    action() {
        BlazeLayout.setRoot('body');
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'tripTracking',
        });
    },
});