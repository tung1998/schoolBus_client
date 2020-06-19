const teacherRoutes = FlowRouter.group({
    prefix: "/teacher",
    name: "teacherRoutes",
});

teacherRoutes.route('/listClass', {
    name: 'teacher.listClass',
    action() {
        BlazeLayout.setRoot('body');
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'listClass',
        });
    },
});

teacherRoutes.route('/class/:idClass([0-9a-fA-F]{24})', {
    name: 'teacher.studentListByClass',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'studentListByClass',
        });
    },
})

teacherRoutes.route('/student/:studentID([0-9a-fA-F]{24})', {
    name: 'teacher.studentInfo',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'studentInfo',
        });
    },
})

teacherRoutes.route('/student/:studentID([0-9a-fA-F]{24})/tripHistory', {
    name: 'teacher.studentTripHistory',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'tripList',
        });
    },
})

teacherRoutes.route('/student/:studentID([0-9a-fA-F]{24})/nextTrip', {
    name: 'teacher.studentNextTrip',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'tripList',
        });
    },
})

//xem danh sách yêu cầu xin nghỉ
teacherRoutes.route('/listAbsentRequest', {
    name: 'teacher.absentRequestManager',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'absentRequestManager',
        });
    },
});
//nhắn tin
teacherRoutes.route('/chat', {
    name: 'teacher.chatParent',
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'chatParent',
        });
    },
});