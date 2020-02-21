import './body.html';


Template.App_body.onCreated(function () {
    $('body').addClass('kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--fixed kt-subheader--solid kt-aside--enabled kt-aside--fixed kt-footer--fixed kt-page--loading')
});
Template.App_body.onRendered(function () {
    KTLayout.init();
});