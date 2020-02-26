import './carModelManager.html'

const Cookies = require("js-cookie");

import { MeteorCall, handleError } from "../../../../functions";

import { _METHODS } from "../../../../variableConst";

let accessToken;

Template.carModelManager.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.carModelManager.onRendered(() => {
    reloadTable();
})

Template.carModelManager.events({
    "submit form": SubmitForm,
    "click .modify-button": ClickModifyButton,
    "click .add-more": ClickAddmoreButton,
    "click .delete-button": ClickDeleteButton
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
            deleteRow(data);
        })
        .catch(handleError);
}

function SubmitForm(event) {
    event.preventDefault();
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
                addToTable(data, result);
            }).catch(handleError);
    } else {
        data._id = modify;
        MeteorCall(_METHODS.carModel.Update, data, accessToken)
            .then(result => {
                console.log(result);
                $("#editCarModelModal").modal("hide");
                modifyTable(data);
            })
            .catch(handleError);
    }
}

function addToTable(data, result) {
    data._id = result._id;
    $("#table-body").prepend(`<tr id=${data._id}>
                                <th scope="row"></th>
                                <td>${data.brand}</td>
                                <td>${data.model}</td>
                                <td>${data.seatNumber}</td>
                                <td>${data.fuelType}</td>
                                <td>${data.fuelCapacity}</td>
                                <td>${data.maintenanceDay}</td>
                                <td>${data.maintenanceDistance}</td>
                                <td>
                                <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(data)}\'>Sửa</button>
                                <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(data)}\'>Xóa</button>
                                </td>
                            </tr>`
    )
}

function modifyTable(data) {
    $(`#${data._id}`).html(`<th scope="row"></th>
                            <td>${data.brand}</td>
                            <td>${data.model}</td>
                            <td>${data.seatNumber}</td>
                            <td>${data.fuelType}</td>
                            <td>${data.fuelCapacity}</td>
                            <td>${data.maintenanceDay}</td>
                            <td>${data.maintenanceDistance}</td>
                            <td>
                            <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(data)}\'>Sửa</button>
                            <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(data)}\'>Xóa</button>
                            </td>`
    )
}

function deleteRow(data) {
    $(`#${data._id}`).remove();
}

function reloadTable() {
    MeteorCall(_METHODS.carModel.GetAll, null, accessToken)
        .then(result => {
            let htmlTable = result.data.map(htmlRow);
            $("#table-body").html(htmlTable.join(" "));
        })
        .catch(handleError);
}

function htmlRow(data) {
    return `<tr id=${data._id}>
                <th scope="row"></th>
                <td>${data.brand}</td>
                <td>${data.model}</td>
                <td>${data.seatNumber}</td>
                <td>${data.fuelType}</td>
                <td>${data.fuelCapacity}</td>
                <td>${data.maintenanceDay}</td>
                <td>${data.maintenanceDistance}</td>
                <td>
                <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(data)}\'>Sửa</button>
                <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(data)}\'>Xóa</button>
                </td>
            </tr>`
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