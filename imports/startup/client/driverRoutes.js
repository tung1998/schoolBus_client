const driverRoutes = FlowRouter.group({
    prefix: "/driver",
    name: "driverRoutes",
});

driverRoutes.route('/upCommingTripInfo', {
    name: 'driver.upCommingTripInfo',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'upCommingTripInfo',
        });
    },
});

driverRoutes.route('/carMaintenanceReport', {
    name: 'driver.carMaintenanceReport',
    action() {
        BlazeLayout.setRoot("body"),
            BlazeLayout.render('App_body', {
                main: 'App_home',
                content: 'carMaintenanceReport',
                panel: 'panel'
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
