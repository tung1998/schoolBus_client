import {
  FlowRouter
} from 'meteor/kadira:flow-router';
import {
  BlazeLayout
} from 'meteor/kadira:blaze-layout';

// Import needed templates
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

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', {
      main: 'App_notFound'
    });
  },
};