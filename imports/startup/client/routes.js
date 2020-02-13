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
// module template
import '../../ui/components/module/sample/sample.js'
import '../../ui/components/module/studentManager/studentManager.js'
import '../../ui/components/module/teacherManager/teacherManager.js'
import '../../ui/components/module/schoolManager/schoolManager.js'
import '../../ui/components/module/classManager/classManager.js'
import '../../ui/components/module/studentListManager/studentListManager.js'


// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', {
      main: 'App_home',
      content: 'sample',
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