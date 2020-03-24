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

teacherRoutes.route('/class/:id([0-9a-fA-F]{24})', {
    name: 'teacher.studentListByClass',
    action() {
        BlazeLayout.setRoot('body');
        BlazeLayout.render('App_body', {
            main: 'App_home',
            content: 'studentListByClass',
        });
    },
});
