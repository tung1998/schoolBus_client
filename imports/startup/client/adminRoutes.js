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
            panel: 'panel'
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
            panel: 'panel'
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
    name: 'tripManager',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'tripDetail',
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

FlowRouter.route('/parrentRequest', {
    name: 'feedback',
    action() {
        BlazeLayout.setRoot("body")
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'absentRequest',
        });
    },
});

FlowRouter.route('/moduleManager', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'moduleManager',
            panel: 'panel'
        })
    }
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
            panel: 'panel'
            });
    },
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

//teacher
//xem danh sách học sinh
FlowRouter.route('/teacher/class', {
    name: 'teacher',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'listClass',
        });
    },
});

FlowRouter.route('/teacher/class/:idClass([0-9a-fA-F]{24})', {
    name: 'teacher',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'studentListByClass',
        });
    },
});

//xem danh sách yêu cầu xin nghỉ
FlowRouter.route('/teacher/listAbsentRequest', {
    name: 'teacher',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'absentRequestManager',
        });
    },
});
//nhắn tin
FlowRouter.route('/teacher/chat', {
    name: 'teacher',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'chatParent',
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
            panel: 'panel'
        });
    },
});