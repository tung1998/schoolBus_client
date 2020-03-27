import './carManager.html'

const Cookies = require("js-cookie");

import {
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm,
    addRequiredInputLabel,
    addPaging,
    tablePaging,
    handlePaging
} from "../../../../functions";

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE,
    _SESSION
} from "../../../../variableConst";

let accessToken;
let currentPage = 1;

Template.carManager.onCreated(() => {
    accessToken = Cookies.get("accessToken");
    Session.set('schools', [])
});

Template.carManager.onRendered(() => {
    addRequiredInputLabel();
    addPaging($('#carTable'));
    reloadTable();
    renderModelOption();

    if (Session.get(_SESSION.isSuperadmin))
            initSchoolSelect2()

})
Template.editCarManagerModal.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    },
    schools() {
        return Session.get('schools')
    },
});

Template.carManager.events({
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

Template.carFilter.onRendered(() => {
    $('#school-filter').select2({
        width: "100%",
        placeholder: "Chọn"
    })
})

Template.carFilter.events({
    'click #filter-button': carFilter,
    'click #refresh-button': refreshFilter,
    'keypress .filter-input': (e) => {
        if (e.which == 13 || e.keyCode == 13) {
            carFilter()
        }
    },
    'change #school-filter': (e) => {
        let options = [{
            text: "adminType",
            value: $('#school-filter').val()
        }]
        reloadTable(1, getLimitDocPerPage(), options)
    }
})

Template.carFilter.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    },
    schools() {
        return Session.get('schools')
    },
});


function renderModelOption() {
    MeteorCall(_METHODS.carModel.GetAll, null, accessToken)
        .then(result => {
            let optionSelects = result.data.map(res => {
                return `<option value="${res._id}">${res.brand}-${res.model}</option>`;
            });
            $("#model-select").html('<option></option>').append(optionSelects.join(" "));
            $("#model-select").select2({
                placeholder: "Chọn model",
                width: "100%"
            })
        })
        .catch(handleError);
}

function ClickAddmoreButton(event) {
    $(".modal-title").html("Thêm mới");
    $(".confirm-button").html("Thêm");

    $("#editCarManagerModal").modal("show");
    $("#editCarManagerModal").attr("carID", "");
    clearForm();
}

function ClickModifyButton(event) {
    $(".modal-title").html("Chỉnh sửa");
    $(".confirm-button").html("Sửa");

    let carData = $(event.currentTarget).data("json");
    $("#editCarManagerModal").attr("carID", carData._id);
    $("#editCarManagerModal").modal("show");

    $("#model-select").val(carData.carModelID).trigger('change')
    $('input[name="licensePlate-input"]').val(carData.numberPlate);
    $('input[name="status-input"]').val(carData.status);

}

function ClickDeleteButton(event) {
    handleConfirm().then(result => {
        console.log(result);
        if (result.value) {
            let data = $(event.currentTarget).data("json");
            MMeteorCall(_METHODS.car.Delete, data, accessToken)
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
            carModelID: $("#model-select").val(),
            status: $('input[name="status-input"]').val(),
            modelName: $(".model-result").html(),
            numberPlate: $('input[name="licensePlate-input"]').val()
        };

        if (Session.get(_SESSION.isSuperadmin)) {
            data.schoolID = $('#school-input').val()
        }

        let modify = $("#editCarManagerModal").attr("carID");
        if (modify == "") {
            MeteorCall(_METHODS.car.Create, data, accessToken)
                .then(result => {
                    handleSuccess("Thêm").then(() => {
                        $("#editStudentModal").modal("hide");
                        reloadTable(1, getLimitDocPerPage())
                        clearForm()
                    })
                })
                .catch(handleError);
        } else {
            data._id = modify;
            MeteorCall(_METHODS.car.Update, data, accessToken)
                .then(result => {
                    handleSuccess("Cập nhật").then(() => {
                        $("#editStudentModal").modal("hide");
                        reloadTable(1, getLimitDocPerPage())
                        clearForm()
                    })
                })
                .catch(handleError);
        }
    }

}

function checkInput() {
    let carModelID = $("#model-select").val();
    let status = $('input[name="status-input"]').val();
    let numberPlate = $('input[name="licensePlate-input"]').val();

    if (!carModelID || !status || !numberPlate) {
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

function clearForm() {
    $(".model-result").attr("carModelID", "");
    $(".model-result").html("Chọn Model");
    $('input[name="licensePlate-input"]').val();
    $('input[name="status-input"]').val();

    if (Session.get(_SESSION.isSuperadmin)) {
        $('#school-input').val('').trigger('change')
    }
}

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE, options = null) {
    let table = $('#table-body');
    MeteorCall(_METHODS.car.GetByPage, {
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
        return createRow(key);
    });
    table.html(htmlRow.join(''))
}

function createRow(result) {
    console.log(result);
    let data = {
        modelName: result.carModel.model,
        brandName: result.carModel.brand,
        numberPlate: result.numberPlate,
        status: result.status
    }
    return `
        <tr id="${data._id}">
            <th scope="row">${result.index + 1}</th>
            <td>${data.modelName}</td>
            <td>${data.brandName}</td>
            <td>${data.numberPlate}</td>
            <td>${data.status}</td>
            <td>
            <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(result)}\'>Sửa</button>
            <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(result)}\'>Xóa</button>
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

function carFilter() {
    let options = [{
        text: "carModel/model",
        value: $('#car-model-filter').val()
    }, {
        text: "carModel/brand",
        value: $('#car-brand-filter').val()
    }, {
        text: "numberPlate",
        value: $('#car-numberPlate-filter').val()
    }, {
        text: "status",
        value: $('#car-status-filter').val()
    }, {
        text: "schoolID",
        value: $('#school-filter').val()
    }]
    console.log(options);
    reloadTable(1, getLimitDocPerPage(), options)
}

function refreshFilter() {
    $('#car-model-filter').val('')
    $('#car-brand-filter').val('')
    $('#car-numberPlate-filter').val('')
    $('#car-status-filter').val('')
    $('#school-filter').val('').trigger('change')
    reloadTable(1, getLimitDocPerPage(), null)
}