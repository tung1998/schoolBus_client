const driverRoutes = FlowRouter.group({
    prefix: "/driver",
    name: "driverRoutes",
});

driverRoutes.route('/upCommingTripInfo', {
    name: 'driver.upCommingTripInfo',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'tripDetail',
        });
    },
});

driverRoutes.route('/carMaintenanceReport', {
    name: 'driver.carMaintenanceReport',
    action() {
        BlazeLayout.setRoot("body"),
            BlazeLayout.render('App_body', {
                main: 'App_home',
                content: 'carMaintenanceReportHistory',
            });
    },
});


driverRoutes.route('/tripHistory', {
    name: 'driver.tripHistory',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'tripHistoryDriver',
        });
    },
});

driverRoutes.route('/tripInfo/:tripID([0-9a-fA-F]{24})', {
    name: 'driver.tripInfo',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'tripDetailNoButton',
        });
    },
});
