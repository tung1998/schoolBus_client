import './carMaintenanceReport.html';

Template.carMaintenanceReport.onCreated(() => {

})

Template.carMaintenanceReport.onRendered(() => {
    $(document).ready(() => {
        $(".kt-footer").hide();
        $(".historyTable").hide();
    })
})

Template.carMaintenanceReport.events({
    'click #carMaintenanceReportHistory': carMaintenanceReportHistoryClick
})

function carMaintenanceReportHistoryClick() {
    if ($(".historyTable").is(":hidden")) {
        $(".historyTable").show();
        $(".carMaintenanceReport").hide();
        $("#carMaintenanceReportHistory").html("Khai báo bảo trì, đổ xăng");
    } else {
        $(".historyTable").hide();
        $(".carMaintenanceReport").show();
        $("#carMaintenanceReportHistory").html("Xem lịch sử đổ xăng, bảo trì");
    }
}