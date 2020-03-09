import './carModelManager.html'

const Cookies = require("js-cookie");

import {
    MeteorCall,
    handleError,
    addRequiredInputLabel,
    addPaging,
    tablePaging
} from "../../../../functions";

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE
} from "../../../../variableConst";

let accessToken;
let currentPage = 1;

Template.carModelManager.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.carModelManager.onRendered(() => {
    addRequiredInputLabel()
    addPaging()
    reloadTable(1);
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

}

function ClickDeleteButton(event) {
    let data = $(event.currentTarget).data("json");
    console.log(data._id)
    MeteorCall(_METHODS.carModel.Delete, data, accessToken)
        .then(result => {
            reloadTable(currentPage, getLimitDocPerPage())
        })
        .catch(handleError);
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

        let modify = $("#editCarModelModal").attr("carID");
        console.log(data)
        if (modify == "") {
            MeteorCall(_METHODS.carModel.Create, data, accessToken)
                .then(result => {
                    console.log(result);
                    $("#editCarModelModal").modal("hide");
                    reloadTable(1, getLimitDocPerPage())
                }).catch(handleError);
        } else {
            data._id = modify;
            MeteorCall(_METHODS.carModel.Update, data, accessToken)
                .then(result => {
                    console.log(result);
                    $("#editCarModelModal").modal("hide");
                    reloadTable(currentPage, getLimitDocPerPage())
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
            text: "Làm ơn điền đầy đủ thông tin",
            timer: 3000
        })
        return false;
    } else {
        return true;
    }

}

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
    let table = $('#table-body');
    let emptyWrapper = $('#empty-data');
    table.html('');
    MeteorCall(_METHODS.carModel.GetByPage, { page: page, limit: limitDocPerPage }, accessToken).then(result => {
        console.log(result)
        tablePaging(".tablePaging", result.count, page, limitDocPerPage)
        $("#paging-detail").html(`Hiển thị ${limitDocPerPage} bản ghi`)
        if (result.count === 0) {
            $('.tablePaging').addClass('d-none');
            table.parent().addClass('d-none');
            emptyWrapper.removeClass('d-none');
        } else if (result.count > limitDocPerPage) {
            $('.tablePaging').removeClass('d-none');
            table.parent().removeClass('d-none');
            emptyWrapper.addClass('d-none');
            // update số bản ghi
        } else {
            $('.tablePaging').addClass('d-none');
            table.parent().removeClass('d-none');
            emptyWrapper.addClass('d-none');
        }
        createTable(table, result, limitDocPerPage)
    })

}

function renderTable(data, page = 1) {
    let table = $('#table-body');
    let emptyWrapper = $('#empty-data');
    table.html('');
    tablePaging('.tablePaging', data.count, page);
    if (carStops.count === 0) {
        $('.tablePaging').addClass('d-none');
        table.parent().addClass('d-none');
        emptyWrapper.removeClass('d-none');
    } else {
        $('.tablePaging').addClass('d-none');
        table.parent().removeClass('d-none');
        emptyWrapper.addClass('d-none');
    }

    createTable(table, data);
}

function createTable(table, result, limitDocPerPage) {
    result.data.forEach((key, index) => {
        key.index = index + (result.page - 1) * limitDocPerPage;
        const row = createRow(key);
        table.append(row);
    });
}

function createRow(data) {
    const data_row = dataRow(data);
    // _id is tripID
    return `
        <tr id="${data._id}">
          ${data_row}
        </tr>
        `
}

function dataRow(result) {
    return `
        <th scope="row">${result.index}</th>
        <td>${result.brand}</td>
        <td>${result.model}</td>
        <td>${result.seatNumber}</td>
        <td>${result.fuelType}</td>
        <td>${result.fuelCapacity}</td>
        <td>${result.maintenanceDay}</td>
        <td>${result.maintenanceDistance}</td>
        <td>
        <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(result)}\'>Sửa</button>
        <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(result)}\'>Xóa</button>
        </td>
    `;
}