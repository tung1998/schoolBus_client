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