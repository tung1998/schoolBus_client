import './carFuel.html';

const Cookies = require("js-cookie");

import {
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm,
    addRequiredInputLabel,
    addPaging,
    tablePaging,
    initDropzone,
    handlePaging
} from "../../../../functions";

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE,
    _SESSION,

} from "../../../../variableConst";

let accessToken;
let currentPage = 1;
let isSuperadmin

Template.carFuel.onCreated(() => {
    accessToken = Cookies.get("accessToken");
    isSuperadmin = Session.get(_SESSION.isSuperadmin)
    Session.set('schools', [])
});

Template.carFuel.onRendered(() => {
    if (isSuperadmin)
        initSchoolSelect2()
    reloadTable();
    addRequiredInputLabel()
    addPaging($('#carFuelTable'))
    $("#car-select").select2({
        placeholder: "Chọn Xe",
        width: "100%",
        minimumResultsForSearch: Infinity,
    })
    renderCarOption();
});

Template.editCarFuelModal.helpers({
    isSuperadmin() {
        return isSuperadmin
    },
    schools() {
        return Session.get('schools')
    },
});

Template.carFuel.events({
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
    },
});

Template.carFuelFilter.events({
    'click #filter-button': carFuelFilter,
    'click #refresh-button': refreshFilter,
    'keypress .filter-input': (e) => {
        if (e.which === 13) {
            carFuelFilter()
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

Template.carFuelFilter.helpers({
    isSuperadmin() {
        return isSuperadmin
    },
    schools() {
        return Session.get('schools')
    },
});


function renderCarOption() {
    MeteorCall(_METHODS.car.GetAll, null, accessToken)
        .then(result => {
            let optionSelects = result.data.map(res => {
                return `<option value=${res._id}>Biển số:&nbsp;${res.numberPlate}&nbsp&nbsp${res.carModel.brand}-${res.carModel.model}</option>`;
            });
            $("#car-select").html('<option></option>').append(optionSelects.join(" "));
        })
        .catch(handleError);
}

function ClickAddmoreButton(event) {
    $(".modal-title").html("Thêm mới");
    $(".confirm-button").html("Thêm");

    $("#editCarFuelModal").modal("show");
    $("#editCarFuelModal").attr("carFuelID", "");
    clearForm();
}

function ClickModifyButton(event) {
    $(".modal-title").html("Chỉnh sửa");
    $(".confirm-button").html("Sửa");

    let carFuelData = $(event.currentTarget).data("json");
    $("#editCarFuelModal").attr("carFuelID", carFuelData._id);
    $("#editCarFuelModal").modal("show");

    if (Session.get(_SESSION.isSuperadmin)) {
        $('#school-input').val(carFuelData.schoolID).trigger('change')
    }

    $('#car-select').val(carFuelData.carID).trigger('change')
    $('input[name="volume-input"]').val(carFuelData.volume);
    $('input[name="cost-input"]').val(carFuelData.price);
}

function ClickDeleteButton(event) {
    let data = $(event.currentTarget).data("json");
    console.log(data._id)
    MeteorCall(_METHODS.carFuel.Delete, data, accessToken)
        .then(result => {
            reloadTable(currentPage, getLimitDocPerPage())
        })
        .catch(handleError);
}

function SubmitForm(event) {
    event.preventDefault();
    if (checkInput()) {
        let data = {
            carID: $("#car-select").val(),
            volume: $('input[name="volume-input"]').val(),
            price: $('input[name="cost-input"]').val()
        };

        if (Session.get(_SESSION.isSuperadmin)) {
            data.schoolID = $('#school-input').val()
        }

        let modify = $("#editCarFuelModal").attr("carFuelID");
        if (modify == "") {
            MeteorCall(_METHODS.carFuel.Create, data, accessToken)
                .then(result => {
                    $("#editCarFuelModal").modal("hide");
                    reloadTable(1, getLimitDocPerPage())
                })
                .catch(handleError);
        } else {
            data._id = modify;
            MeteorCall(_METHODS.carFuel.Update, data, accessToken)
                .then(result => {
                    $("#editCarFuelModal").modal("hide");
                    reloadTable(currentPage, getLimitDocPerPage())
                })
                .catch(handleError);
        }
    }

}

function checkInput() {
    let volume = $('input[name="volume-input"]').val();
    let cost = $('input[name="cost-input"]').val();
    let car = $("#car-select").val();


    if (!volume || !cost || !car) {
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
    $('input[name="volume-input"]').val("");
    $('input[name="cost-input"]').val("");
    if (Session.get(_SESSION.isSuperadmin)) {
        $('#school-input').val('').trigger('change')
    }
}

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE, options = null) {
    let table = $('#table-body');
    MeteorCall(_METHODS.carFuel.GetByPage, {
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
        _id: result._id,
        carID: result.carID,
        numberPlate: result.car.numberPlate,
        volume: result.volume,
        price: result.price,
        createdTime: result.createdTime,
        updatedTime: result.updatedTime
    }
    return `
        <tr id="${data._id}" class="table-row">
            <th scope="row">${result.index + 1}</th>
            <td>${data.numberPlate}</td>
            <td>${data.volume}</td>
            <td>${data.price}</td>
            <td>${moment(data.createdTime).format('L')}</td>
            <td>${moment(data.updatedTime).format('L')}</td>
            <td>
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

function carFuelFilter() {
    let options = [{
        text: "car/numberPlate",
        value: $('#carFuel-numberPlate-filter').val()
    }, {
        text: "schoolID",
        value: $('#school-filter').val()
    }]
    console.log(options);
    reloadTable(1, getLimitDocPerPage(), options)
}

function refreshFilter() {
    $('#carFuel-numberPlate-filter').val('')
    $('#school-filter').val('')
    reloadTable(1, getLimitDocPerPage(), null)
}