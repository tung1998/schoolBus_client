import './carModelManager.html'

const Cookies = require("js-cookie");

import {
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm,
    addRequiredInputLabel,
    addPaging,
    handlePaging
} from "../../../../functions";

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE,
    _SESSION
} from "../../../../variableConst";

let accessToken;
let currentPage = 1;

Template.carModelManager.onCreated(() => {
    accessToken = Cookies.get("accessToken");
    Session.set('schools', [])
});

Template.carModelManager.onRendered(() => {
    addRequiredInputLabel()
    addPaging($('#carModelTable'))
    reloadTable();
    if (Session.get(_SESSION.isSuperadmin))
        initSchoolSelect2()
})

Template.carModelManager.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    }
})

Template.carModelManager.events({
    "submit form": SubmitForm,
    "click .modify-button": ClickModifyButton,
    "click .add-more": ClickAddmoreButton,
    "click .delete-button": ClickDeleteButton,
    "click .kt-datatable__pager-link": (e) => {
        reloadTable(parseInt($(e.currentTarget).data('page')), getLimitDocPerPage());
        $(".kt-datatable__pager-link").removeClass("kt-datatable__pager-link--active");
        $(e.currentTarget).addClass("kt-datatable__pager-link--active")
        currentPage = parseInt($(e.currentTarget).data('page'));
    },
    "change #limit-doc": (e) => {
        reloadTable(1, getLimitDocPerPage());
    }
});

Template.editCarModelModal.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    },
    schools() {
        return Session.get('schools')
    },
});

Template.carModelFilter.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    },
    schools() {
        return Session.get('schools')
    },
});

Template.carModelFilter.onRendered(() => {
    $('#school-filter').select2({
        placeholder: "Chọn trường",
        width: "100%"
    })
})

Template.carModelFilter.events({
    'click #filter-button': carModelilter,
    'click #refresh-button': refreshFilter,
    'keypress .filter-input': (e) => {
        if (e.which === 13 || e.keyCode == 13) {
            carModelilter()
        }
    },
    'change #school-filter': (e) => {
        let options = [{
            text: "schoolID",
            value: $('#school-filter').val()
        }]
        reloadTable(1, getLimitDocPerPage(), options)
    }
})

function ClickAddmoreButton(event) {
    $(".modal-title").html("Thêm mới");
    $(".confirm-button").html("Thêm");

    $("#editCarModelModal").modal("show");
    $("#editCarModelModal").attr("carID", "");
    clearForm();
}

function ClickModifyButton(event) {
    $(".modal-title").html("Chỉnh sửa");
    $(".confirm-button").html("Sửa");

    let carData = $(event.currentTarget).data("json");
    $("#editCarModelModal").attr("carID", carData._id);
    $("#editCarModelModal").modal("show");

    $('input[name="brand-input"]').val(carData.brand);
    $('input[name="model-input"]').val(carData.model);
    $('input[name="seat-input"]').val(carData.seatNumber);
    $('input[name="fuelType-input"]').val(carData.fuelType);
    $('input[name="capacity-input"]').val(carData.fuelCapacity);
    $('input[name="maintenance-input"]').val(carData.maintenanceDay);
    $('input[name="km-input"]').val(carData.maintenanceDistance);
    if (Session.get(_SESSION.isSuperadmin)) {
        $('#school-input').val(carData.schoolID).trigger('change')
    }
}

function ClickDeleteButton(event) {
    handleConfirm().then(result => {
        console.log(result);
        if (result.value) {
            let data = $(event.currentTarget).data("json");
            MeteorCall(_METHODS.carModel.Delete, data, accessToken)
                .then(result => {
                    console.log(result);
                    Swal.fire({
                        icon: "success",
                        text: "Đã xóa thành công",
                        timer: 3000
                    })
                    reloadTable(currentPage, getLimitDocPerPage())
                }).catch(handleError)
        } else {

        }
    })
}

function SubmitForm(event) {
    event.preventDefault();
    if (checkInput()) {
        let data = {
            brand: $('input[name="brand-input"]').val(),
            model: $('input[name="model-input"]').val(),
            seatNumber: $('input[name="seat-input"]').val(),
            fuelType: $('input[name="fuelType-input"]').val(),
            fuelCapacity: $('input[name="capacity-input"]').val(),
            maintenanceDay: $('input[name="maintenance-input"]').val(),
            maintenanceDistance: $('input[name="km-input"]').val()
        }
        if (Session.get(_SESSION.isSuperadmin)) {
            data.schoolID = $('#school-input').val()
        }

        let modify = $("#editCarModelModal").attr("carID");
        console.log(data)
        if (modify == "") {
            MeteorCall(_METHODS.carModel.Create, data, accessToken)
                .then(result => {
                    handleSuccess("Thêm", "loại xe").then(() => {
                        $("#editCarModelModal").modal("hide");
                        reloadTable(1, getLimitDocPerPage())
                    })
                }).catch(handleError);
        } else {
            data._id = modify;
            MeteorCall(_METHODS.carModel.Update, data, accessToken)
                .then(result => {
                    console.log(result);
                    handleSuccess("Cập nhật", "loại xe").then(() => {
                        $("#editStudentModal").modal("hide");
                        reloadTable(currentPage, getLimitDocPerPage())
                    })
                })
                .catch(handleError);
        }
    }

}

function clearForm() {
    $('input[name="brand-input"]').val("");
    $('input[name="model-input"]').val("");
    $('input[name="seat-input"]').val("");
    $('input[name="fuelType-input"]').val("");
    $('input[name="capacity-input"]').val("");
    $('input[name="maintenance-input"]').val("");
    $('input[name="km-input"]').val("");

    if (Session.get(_SESSION.isSuperadmin)) {
        $('#school-input').val('').trigger('change')
    }
}

function checkInput() {
    let brand = $('input[name="brand-input"]').val();
    let model = $('input[name="model-input"]').val();
    let seatNumber = $('input[name="seat-input"]').val();
    let fuelType = $('input[name="fuelType-input"]').val();
    let fuelCapacity = $('input[name="capacity-input"]').val();
    let maintenanceDay = $('input[name="maintenance-input"]').val();
    let maintenanceDistance = $('input[name="km-input"]').val();

    if (!brand || !model || !seatNumber || !fuelType || !fuelCapacity || !maintenanceDay || !maintenanceDistance) {
        Swal.fire({
            icon: "error",
            text: "Chưa đủ thông tin!",
            timer: 3000
        })
        return false;
    } else {
        if (Session.get(_SESSION.isSuperadmin)) {
            let schoolID = $('#school-input').val()
            if (!schoolID) {
                Swal.fire({
                    icon: "error",
                    text: "Chưa chọn trường!",
                    timer: 2000
                })
                return false;
            }

        }
        return true;
    }

}

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE, options = null) {
    let table = $('#table-body');
    MeteorCall(_METHODS.carModel.GetByPage, {
        page: page,
        limit: limitDocPerPage,
        options
    }, accessToken).then(result => {
        handlePaging(table, result.count, page, limitDocPerPage)
        createTable(table, result, limitDocPerPage)
    })

}

function createTable(table, result, limitDocPerPage) {
    let htmlRow = result.data.map((key, index) => {
        key.index = index + (result.page - 1) * limitDocPerPage;
        return createRow(key)
    });
    table.html(htmlRow.join(''))
}

function createRow(result) {
    console.log(result);
    let data = {
        _id: result._id,
        brand: result.brand,
        model: result.model,
        seatNumber: result.seatNumber,
        fuelType: result.fuelType,
        fuelCapacity: result.fuelCapacity,
        maintenanceDay: result.maintenanceDay,
        maintenanceDistance: result.maintenanceDistance,
        schoolID: result.schoolID,
        schoolName: result.school.name
    }
    return `
        <tr id="${data._id}">
            <th class="text-center">${result.index + 1}</th>
            ${Session.get(_SESSION.isSuperadmin) ? `<td>${data.schoolName}</td>`: ''}
            <td>${data.brand}</td>
            <td>${data.model}</td>
            <td>${data.seatNumber}</td>
            <td>${data.fuelType}</td>
            <td>${data.fuelCapacity}</td>
            <td>${data.maintenanceDay}</td>
            <td>${data.maintenanceDistance}</td>
            <td class="text-center">
            <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(data)}\'>Sửa</button>
            <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(data)}\'>Xóa</button>
            </td>
        </tr>
        `
}

function initSchoolSelect2() {
    MeteorCall(_METHODS.school.GetAll, null, accessToken).then(result => {
        Session.set('schools', result.data)
        $('#school-input').select2({
            width: '100%',
            placeholder: "Chọn trường"
        })
    }).catch(handleError)
}


function carModelilter() {
    let options = [{
        text: "model",
        value: $('#carModel-model-filter').val()
    }, {
        text: "brand",
        value: $('#carModel-brand-filter').val()
    }, {
        text: "seatNumber",
        value: $('#carModel-seatNumber-filter').val()
    }, {
        text: "fuelType",
        value: $('#carModel-fuelType-filter').val()
    }, {
        text: "fuelCapacity",
        value: $('#carModel-fuelCapacity-filter').val()
    }, {
        text: "schoolID",
        value: $('#school-filter').val()
    }]
    console.log(options);
    reloadTable(1, getLimitDocPerPage(), options)
}

function refreshFilter() {
    $('#carModel-model-filter').val('')
    $('#carModel-brand-filter').val('')
    $('#carModel-seatNumber-filter').val('')
    $('#carModel-fuelType-filter').val('')
    $('#carModel-fuelCapacity-filter')
    $('#school-filter').val('').trigger('change')
    reloadTable(1, getLimitDocPerPage(), null)
}