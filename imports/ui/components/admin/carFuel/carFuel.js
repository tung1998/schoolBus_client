import './carFuel.html';

const Cookies = require("js-cookie");

import {
    MeteorCall,
    handleError,
    addRequiredInputLabel,
    addPaging,
    tablePaging,
} from "../../../../functions";

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE
} from "../../../../variableConst";

let accessToken;
let currentPage = 1;

Template.carFuel.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.carFuel.onRendered(() => {
    reloadTable(1);
    addRequiredInputLabel()
    addPaging()
    $("#car-select").select2()
    renderCarOption();
});

Template.carFuel.events({
    "submit form": SubmitForm,
    "click .modify-button": ClickModifyButton,
    "click .add-more": ClickAddmoreButton,
    "click .delete-button": ClickDeleteButton,
});

function renderCarOption() {
    MeteorCall(_METHODS.car.GetAll, null, accessToken)
        .then(result => {
            let optionSelects = result.data.map(res => {
                return `<option value=${res._id}>Biển số:&nbsp;${res.numberPlate}&nbsp&nbsp${res.carModel.brand}-${res.carModel.model}</option>`;
            });
            $("#car-select").html(optionSelects.join(" "));
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
            text: "Làm ơn điền đầy đủ thông tin",
            timer: 3000
        })
        return false;
    } else {
        return true;
    }

}

function clearForm() {
    $('input[name="volume-input"]').val("");
    $('input[name="cost-input"]').val("");
}

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
    let table = $('#table-body');
    let emptyWrapper = $('#empty-data');
    table.html('');
    MeteorCall(_METHODS.carFuel.GetByPage, { page: page, limit: limitDocPerPage }, accessToken).then(result => {
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
        <tr id="${data._id}" class="table-row">
          ${data_row}
        </tr>
        `
}

function dataRow(data) {
    return `
            <th scope="row">${data.index}</th>
            <td>${data.car.numberPlate}</td>
            <td>${data.volume}</td>
            <td>${data.price}</td>
            <td>${moment(data.createdTime).format('L')}</td>
            <td>${moment(data.updatedTime).format('L')}</td>
            <td>
            <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(data)}\'>Sửa</button>
            <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(data)}\'>Xóa</button>
            </td>
            `
}