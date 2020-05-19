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
});