const driverRoutes = FlowRouter.group({
    prefix: "/nanny",
    name: "nannyRoutes",
});

driverRoutes.route('/upCommingTripInfo', {
    name: 'nanny.upCommingTripInfo',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'tripDetail',
        });
    },
});


driverRoutes.route('/tripHistory', {
    name: 'nanny.tripHistory',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'tripList',
        });
    },
});
