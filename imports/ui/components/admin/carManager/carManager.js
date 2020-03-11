import './carManager.html'

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

Template.carManager.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.carManager.onRendered(() => {
    addRequiredInputLabel();
    addPaging();
    reloadTable(1);
    renderModelOption();
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

function renderModelOption() {
    MeteorCall(_METHODS.carModel.GetAll, null, accessToken)
        .then(result => {
            let optionSelects = result.data.map(res => {
                return `<option value="${res._id}">${res.brand}-${res.model}</option>`;
            });
            $("#model-select").html(optionSelects.join(" "));
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

    $(".button-model-selected").attr("title", carData.modelName);
    $(".model-result").attr("carModelID", carData.carModelID);
    $(".model-result").html(carData.modelName);
    $('input[name="licensePlate-input"]').val(carData.numberPlate);
    $('input[name="status-input"]').val(carData.status);

}

function ClickDeleteButton(event) {
    let data = $(event.currentTarget).data("json");
    console.log(data._id)
    MeteorCall(_METHODS.car.Delete, data, accessToken)
        .then(result => {
            reloadTable(currentPage, getLimitDocPerPage())
        })
        .catch(handleError);
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

        let modify = $("#editCarManagerModal").attr("carID");
        if (modify == "") {
            MeteorCall(_METHODS.car.Create, data, accessToken)
                .then(result => {
                    $("#editCarManagerModal").modal("hide");
                    reloadTable(1, getLimitDocPerPage());
                })
                .catch(handleError);
        } else {
            data._id = modify;
            MeteorCall(_METHODS.car.Update, data, accessToken)
                .then(result => {
                    $("#editCarManagerModal").modal("hide");
                    reloadTable(currentPage, getLimitDocPerPage());
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
            text: "Làm ơn điền đầy đủ thông tin",
            timer: 3000
        })
        return false;
    } else {
        return true;
    }
}

function clearForm() {
    $(".model-result").attr("carModelID", "");
    $(".model-result").html("Chọn Model");
    $('input[name="licensePlate-input"]').val();
    $('input[name="status-input"]').val();
}

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
    let table = $('#table-body');
    let emptyWrapper = $('#empty-data');
    table.html('');
    MeteorCall(_METHODS.car.GetByPage, { page: page, limit: limitDocPerPage }, accessToken).then(result => {
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
    let data = {
        modelName: result.carModel.model,
        numberPlate: result.numberPlate,
        status: result.status
    }
    return `
        <th scope="row">${result.index}</th>
        <td>${data.modelName}</td>
        <td>${data.numberPlate}</td>
        <td>${data.status}</td>
        <td>
        <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(result)}\'>Sửa</button>
        <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(result)}\'>Xóa</button>
        </td>
    `;
}