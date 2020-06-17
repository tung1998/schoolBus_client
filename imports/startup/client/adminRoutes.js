// Set up all routes in the app
FlowRouter.route('/studentManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'studentManager',
            panel: 'panel',
            panelData: 'studentFilter',
        });
    },
});

FlowRouter.route('/teacherManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'teacherManager',
            panel: 'panel',
            panelData: 'teacherFilter'
        });
    },
});

FlowRouter.route('/schoolManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'schoolManager',
            panel: 'panel',
            panelData: 'schoolFilter'
        });
    },
});

FlowRouter.route('/classManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'classManager',
            panel: 'panel',
            panelData: 'classFilter'
        });
    },
});

FlowRouter.route('/administratorManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'administratorManager',
            panel: 'panel',
            panelData: 'administratorFilter'
        });
    },
});

FlowRouter.route('/driverManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'driverManager',
            panel: 'panel',
            panelData: 'driverFilter'
        });
    },
});

FlowRouter.route('/parentManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'parentManager',
            panel: 'panel',
            panelData: 'parentFilter'
        });
    },
});

FlowRouter.route('/carStopList', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'carStopList',
            panel: 'panel',
            panelData: 'carStopListFilter'
        });
    },
});

FlowRouter.route('/carModelManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'carModelManager',
            panel: 'panel',
            panelData: 'carModelFilter'
        });
    },
});

FlowRouter.route('/monitoring', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'monitoring',
        });
    },
});

FlowRouter.route('/nannyManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'nannyManager',
            panel: 'panel',
            panelData: 'nannyFilter'
        });
    },
});


FlowRouter.route('/studentListManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'studentListManager',
            panel: 'panel',
            panelData: 'studentListFilter'
        });
    },
});

FlowRouter.route('/studentListManager/:id([0-9a-fA-F]{24})', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'studentListInfo',
        });
    },
});



//ROUTE
FlowRouter.route('/routeManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'route',
            panel: 'panel',
            panelData: 'routeFilter'
        });
    },

});

FlowRouter.route('/routeManager/:id([0-9a-fA-F]{24})', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'routeInfo',
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

FlowRouter.route('/tripManager', {
    name: 'tripManager',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'tripManager',
        });
    },
});

FlowRouter.route('/tripManager/:tripID', {
    name: 'tripManager.tripDetail',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'tripDetail',
        });
    },
});

FlowRouter.route('/tripSummary', {
    name: 'user',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'tripSummary',
            panel: 'panel',
            panelData: 'tripSummaryFilter'
        });
    },
});

FlowRouter.route('/carFuelManager', {
    name: 'carFuel',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'carFuel',
            panel: 'panel',
            panelData: 'carFuelFilter'
        });
    },
});

FlowRouter.route('/feedbackManager', {
    name: 'feedback',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'feedback',
            panel: 'panel',
            panelData: 'feedbackFilter'
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
            panel: 'panel'
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

FlowRouter.route('/carStop', {
    name: 'carStop',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'carStop',
        });
    },
});

FlowRouter.route('/moduleManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'moduleManager',
            panel: 'panel',
            panelData: 'moduleFilter'
        })
    }
});

FlowRouter.route('/carManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'carManager',
            panel: 'panel',
            panelData: 'carFilter'
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

FlowRouter.route('/routeManager', {
    name: 'route',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'route',
            panel: 'panel'
        });
    },
});

FlowRouter.route('/userManager', {
    name: 'user',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'userManager',
            panel: 'panel',
            panelData: 'userFilter'
        });
    },
});

FlowRouter.route('/dashboard', {
    name: 'home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'dashboard',
        });
    },
});

