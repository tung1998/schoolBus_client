import {
    FlowRouter
} from 'meteor/kadira:flow-router';
import {
    BlazeLayout
} from 'meteor/kadira:blaze-layout';

import {
    MeteorCall
} from '../../functions'

<<<<<<< HEAD
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
import '../../ui/components/admin/studentListManager/studentListManager.js';
import '../../ui/components/admin/module/module.js';
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
=======
import {
    _METHODS
} from '../../variableConst'
>>>>>>> fe41cbf14fa16482c0ff7def37f2d5aee12b89e1

Blaze._allowJavascriptUrls()


// Set up all routes in the app
<<<<<<< HEAD
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
//module manager
FlowRouter.route('/moduleManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'moduleManager',
        })
    }
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

FlowRouter.route('/parentManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'parentManager',
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
=======
>>>>>>> fe41cbf14fa16482c0ff7def37f2d5aee12b89e1

FlowRouter.triggers.enter([function(context, redirect) {
    let accessToken = Cookies.get('accessToken');
    if (!accessToken) FlowRouter.go('/login');
    else {
        MeteorCall(_METHODS.user.GetCurrentInfor, null, accessToken).then(result => {}).catch(e => {
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
        if (accessToken) {
            MeteorCall(_METHODS.user.GetCurrentInfor, null, accessToken).then(result => {
                FlowRouter.go('/profile')
            }).catch(e => {
                BlazeLayout.setRoot('body');
                BlazeLayout.render('App_body', {
                    main: 'login'
                });
            });
        } else {}
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