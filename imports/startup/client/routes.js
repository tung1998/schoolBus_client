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
import '../../ui/pages/not-found/not-found.js';
// shared component template
import '../../ui/components/mobileHeader/mobileHeader.js'
import '../../ui/components/aside/aside.js'
import '../../ui/components/header/header.js'
import '../../ui/components/footer/footer.js'
// admin template
import '../../ui/components/admin/sample/sample.js'
import '../../ui/components/admin/studentManager/studentManager.js'
import '../../ui/components/admin/teacherManager/teacherManager.js'
import '../../ui/components/admin/schoolManager/schoolManager.js'
import '../../ui/components/admin/classManager/classManager.js'

//login
import '../../ui/pages/login/login.js'
import '../../ui/components/admin/administratorManager/administratorManager.js'
import '../../ui/components/admin/driverManager/driverManager.js'
import '../../ui/components/admin/parentManager/parentManager.js'
import '../../ui/components/admin/nannyManager/nannyManager.js'
import '../../ui/components/admin/carModelManager/carModelManager.js'

//route
import '../../ui/components/admin/route/route.js'
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