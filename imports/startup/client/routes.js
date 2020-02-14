import {
    FlowRouter
} from 'meteor/kadira:flow-router';
import {
    BlazeLayout
} from 'meteor/kadira:blaze-layout';

Blaze._allowJavascriptUrls()
    // Import needed templates
    // layout template
import '../../ui/layouts/body/body.js';

// page template
import '../../ui/pages/home/home.js';
import '../../ui/pages/login/login.js'
import '../../ui/pages/not-found/not-found.js';
// shared component template
import '../../ui/components/shared/profile/profile.js'
// import '../../ui/components/shared/mobileHeader/mobileHeader.js'
// import '../../ui/components/shared/aside/aside.js'
// import '../../ui/components/shared/header/header.js'
// import '../../ui/components/shared/footer/footer.js'
// admin template
import '../../ui/components/admin/sample/sample.js'
import '../../ui/components/admin/studentManager/studentManager.js'
import '../../ui/components/admin/teacherManager/teacherManager.js'
import '../../ui/components/admin/schoolManager/schoolManager.js'
import '../../ui/components/admin/classManager/classManager.js'
import '../../ui/components/admin/administratorManager/administratorManager.js'
import '../../ui/components/admin/driverManager/driverManager.js'
import '../../ui/components/admin/parentManager/parentManager.js'
import '../../ui/components/admin/nannyManager/nannyManager.js'
import '../../ui/components/admin/carModelManager/carModelManager.js'
import '../../ui/components/admin/route/route.js'
import '../../ui/components/admin/tripLocation/tripLocation.js';
import '../../ui/components/admin/carFuel/carFuel.js';
import '../../ui/components/admin/feedback/feedback.js';
import '../../ui/components/admin/notification/notification.js';
import '../../ui/components/admin/carMaintenance/carMaintenance.js';
// import '../../ui/components/admin/admin/admin.js';
// driver template
import '../../ui/components/driver/upCommingTripInfo/upCommingTripInfo.js';
import '../../ui/components/driver/carMaintenanceReport/carMaintenanceReport.js';
import '../../ui/components/driver/tripHistoryDriver/tripHistoryDriver.js';
// parent template
import '../../ui/components/parent/tripTracking/tripTracking.js';
import '../../ui/components/parent/sendFeedback/parentFeedback.js';
import '../../ui/components/parent/absentRequest/absentRequest.js';
import '../../ui/components/parent/absentHistory/absentHistory.js';
import '../../ui/components/parent/historyTrip/historyTrip.js';
// nanny template
import '../../ui/components/nanny/tripHistory/tripHistory.js';
import '../../ui/components/nanny/tripListStudent/tripListStudent.js';

// Set up all routes in the app
FlowRouter.route('/', {
    name: 'App.home',
    action() {
        BlazeLayout.setRoot('body');
        BlazeLayout.render('App_body', {
            main: 'login'
        });
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

FlowRouter.route('/studentManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'studentManager',
        });
    },
});

FlowRouter.route('/teacherManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'teacherManager',
        });
    },
});

FlowRouter.route('/schoolManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'schoolManager',
        });
    },
});

FlowRouter.route('/classManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'classManager',
        });
    },
});

FlowRouter.route('/administratorManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'administratorManager',
        });
    },
});

FlowRouter.route('/driverManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'driverManager',
        });
    },
});

FlowRouter.route('/parentManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'parentManager',
        });
    },
});

FlowRouter.route('/nannyManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'nannyManager',
        });
    },
});

FlowRouter.route('/carModelManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'carModelManager',
        });
    },
});

FlowRouter.route('/studentListManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'studentListManager',
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

//ROUTE
FlowRouter.route('/route', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'route',
        });
    },
});

FlowRouter.route('/tripLocation', {
    name: 'tripLocation',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'tripLocation',
        });
    },
});

FlowRouter.route('/carFuel', {
    name: 'carFuel',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'carFuel',
        });
    },
});

FlowRouter.route('/feedback', {
    name: 'feedback',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'feedback',
        });
    },
});

FlowRouter.route('/notification', {
    name: 'notification',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'notification',
        });
    },
});

FlowRouter.route('/carMaintenance', {
    name: 'notification',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'carMaintenance',
        });
    },
});

FlowRouter.route('/admin', {
    name: 'notification',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'admin',
        });
    },
});

FlowRouter.route('/tripTracking', {
    name: 'tripTracking',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'tripTracking',
        });
    },
});

FlowRouter.route('/parentFeedback', {
    name: 'feedback',
    action() {
        BlazeLayout.setRoot("body")
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'parentFeedback',
        });
    },
});

FlowRouter.route('/absentRequest', {
    name: 'feedback',
    action() {
        BlazeLayout.setRoot("body")
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'absentRequest',
        });
    },
});
//DRIVER

FlowRouter.route('/upCommingTripInfo', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'upCommingTripInfo',
        });
    },
});

FlowRouter.route('/carMaintenanceReport', {
    name: 'App.home',
    action() {
        BlazeLayout.setRoot("body"),
            BlazeLayout.render('App_body', {
                main: 'App_home',
                content: 'carMaintenanceReport',
            });
    },
});

FlowRouter.route('/tripHistoryDriver', {
    name: 'notification',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'tripHistoryDriver',
        });
    },
});

FlowRouter.route('/absentHistory', {
    name: 'feedback',
    action() {
        BlazeLayout.setRoot("body")
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'absentHistory',
        });
    },
});

FlowRouter.route('/tripHistory', {
    name: 'notification',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'tripHistory',
        });
    },
});

FlowRouter.route('/historyTrip', {
    name: 'feedback',
    action() {
        BlazeLayout.setRoot("body")
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'historyTrip',
        });
    },
});

FlowRouter.route('/trip/listStudent', {
    name: 'notification',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'tripListStudent',
        });
    },
});