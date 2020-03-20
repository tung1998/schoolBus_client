import './carMaintenanceReport.html';

const Cookies = require("js-cookie");

import {
    MeteorCall,
    handleError,
    handleSuccess,
    addRequiredInputLabel,
} from "../../../../functions";

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE
} from "../../../../variableConst";

let accessToken;
let currentPage = 1;

Template.carMaintenanceReport.onCreated(() => {

})

Template.carMaintenanceReport.onRendered(() => {
    $(document).ready(() => {
        $(".kt-footer").hide();
        $(".historyTable").hide();
    })
    $('.noteRow').hide();
    addRequiredInputLabel();
    initSelect2();
})

Template.carMaintenanceReport.events({
    'click #carMaintenanceReportHistory': carMaintenanceReportHistoryClick,
    'submit form': submitForm,
    'change #selectType': function(e) {
        if ($("#selectType").val() == 0) {
            $(".volumeRow").show();
            $('.noteRow').hide();

        } else {
            $(".volumeRow").hide();
            $('.noteRow').show();
        }
    }
})

function initSelect2() {
    MeteorCall(_METHODS.car.GetAll, null, accessToken).then(result => {
        let select = $("#carSelect")
        let optionSelects = result.data.map((key) => {
            console.log(key._id)
            return `<option value="${key._id}">${key.numberPlate}</option>`
        })
        select.append(optionSelects.join(" "))
        console.log("init2")
    }).catch(handleError)

}

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

function submitForm(e) {
    e.preventDefault();

    if (checkInput()) {
        // let name = $('#name').val();
        let carID = $('#numberPlate').val();
        // let date = $('#kt_datepicker').val();
        let cost = $('#cost').val();
        let type = $('#selectType').val();
        let note = $('#note').val();
        let data = {
            carID: carID,
            price: cost,
            description: note
        }
        if (type == 0) {
            data.volume = $("#volume");
            MeteorCall(_METHODS.carFuel.Create, data, accessToken)
                .then(result => {
                    handleSuccess();
                    clearForm();
                })
                .catch(handleError)
        } else {
            data.type = 1;
            MeteorCall(_METHODS.carMaintenance.Create, data, accessToken)
                .then(result => {
                    handleSuccess();
                    clearForm();
                })
                .catch(handleError)
        }

    }
}

function checkInput() {
    // let name = $('#name').val();
    let carID = $('#carSelect').val();
    // let date = $('#kt_datepicker').val();
    let cost = $('#cost').val();
    let type = $('#selectType').val();
    let note;
    let volume;
    console.log(type)
    if (type == 0) {
        volume = $("#volume").val();
        note = "note";
    } else {
        volume = 1;
        note = $('#note').val();
    }
    console.log(carID, cost, note, volume)
    if (!cost || !carID || !note || !volume) {
        Swal.fire({
            icon: "error",
            text: "Làm ơn điền đầy đủ thông tin",
            timer: 3000
        })
        return false;
    } else {
        return true;
    }
}

function clearForm() {
    $('#carSelect').val("");
    $('#cost').val("");
    $('#selectType').val("");
    $('#note').val("");
    $("#volume").val("");
}