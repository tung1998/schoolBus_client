import {sendFCMToUser} from '../../api/methods/notification'

const driverRoutes = FlowRouter.group({
    prefix: "/driver",
    name: "driverRoutes",
});

driverRoutes.route('/upCommingTripInfo', {
    name: 'driver.upCommingTripInfo',
    action() {
        sendFCMToUser(Session.get('userID'), "hello",{data:'helo'}).then(status => {
            if (status.error)
                console.log(`tripID: ${customerTrip.tripID} ${status.message}`)
        }).catch(e => console.log(`tripID: ${customerTrip.tripID} ${e.message}`));
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
            content: 'tripList',
        });
    },
});

driverRoutes.route('/futureTrip', {
    name: 'driver.nextTrip',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'tripList',
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
