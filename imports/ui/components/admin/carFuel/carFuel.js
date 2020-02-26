import './carFuel.html';

const Cookies = require("js-cookie");

import { MeteorCall, handleError } from "../../../../functions";

import { _METHODS } from "../../../../variableConst";

let accessToken;

Template.carFuel.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.carFuel.onRendered(() => {
    // reloadTable();
    renderCarOption();
});

Template.carFuel.events({
    "submit form": SubmitForm,
    "click .modify-button": ClickModifyButton,
    "click .add-more": ClickAddmoreButton,
    "click .delete-button": ClickDeleteButton,
    "click .car-option": ClickSelectCarOption,
});

function renderCarOption() {
    MeteorCall(_METHODS.car.GetAll, null, accessToken)
        .then(result => {
            let optionSelects = result.data.map(res => {
                return `<li>
                      <a
                        role="option"
                        class="dropdown-item car-option"
                        id=${res._id}
                        tabindex="0"
                        aria-setsize="6"
                        aria-posinset="1" licensePlate=${res.licensePlate}
                        ><span class="text"><b>Biển số</b>:&nbsp;${res.licensePlate}&nbsp;&nbsp;&nbsp;<b>Hãng xe</b>:&nbsp;${res.carModel.brand}&nbsp;&nbsp;&nbsp;<b>Loại xe</b>:&nbsp;&nbsp;&nbsp;${res.carModel.model}</span></a
                      >
                    </li>`;
            });
            $("#car-select").html(optionSelects.join(" "));
        })
        .catch(handleError);
}

function ClickSelectCarOption(event) {
    let id = $(event.currentTarget).attr("id");
    let licensePlate = $(event.currentTarget).attr("licensePlate");
    $(".car-result").html(licensePlate);
    $(".button-car-selected").attr("title", licensePlate);
    $(".car-result").attr("carID", id);
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

    $(".button-car-selected").attr("title", carFuelData.licensePlate);
    $(".car-result").attr("carID", carFuelData.carID);
    $(".car-result").html(carFuelData.licensePlate);
    $('input[name="volume-input"]').val(carFuelData.volume);
    $('input[name="cost-input"]').val(carFuelData.price);
}

function ClickDeleteButton(event) {
    let data = $(event.currentTarget).data("json");
    console.log(data._id)
    MeteorCall(_METHODS.carFuel.Delete, data, accessToken)
        .then(result => {
            deleteRow(data);
        })
        .catch(handleError);
}

function SubmitForm(event) {
    event.preventDefault();
    let data = {
        licensePlate: $(".car-result").html(),
        carID: $(".car-result").attr("carID"),
        volume: $('input[name="volume-input"]').val(),
        price: $('input[name="cost-input"]').val()
    };

    let modify = $("#editCarFuelModal").attr("carFuelID");
    if (modify == "") {
        MeteorCall(_METHODS.carFuel.Create, data, accessToken)
            .then(result => {
                $("#editCarFuelModal").modal("hide");
                addToTable(data, result)
            })
            .catch(handleError);
    } else {
        data._id = modify;
        MeteorCall(_METHODS.carFuel.Update, data, accessToken)
            .then(result => {
                $("#editCarFuelModal").modal("hide");
                modifyTable(data)
            })
            .catch(handleError);
    }
}

function addToTable(data, result) {
    data._id = result._id;
    $("#table-body").prepend(`<tr id=${data._id}>
                                <th scope="row"></th>
                                <td>${data.licensePlate}</td>
                                <td>${data.volume}</td>
                                <td>${data.price}</td>
                                <td>${Date.now()}</td>
                                <td>${Date.now()}</td>
                                <td>
                                <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(data)}\'>Sửa</button>
                                <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(data)}\'>Xóa</button>
                                </td>
                            </tr>`
    )
}

function modifyTable(data) {
    $(`#${data._id}`).html(`<th scope="row"></th>
                            <td>${data.licensePlate}</td>
                            <td>${data.volume}</td>
                            <td>${data.price}</td>
                            <td>${Date.now()}</td>
                            <td>${Date.now()}</td>
                            <td>
                            <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(data)}\'>Sửa</button>
                            <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(data)}\'>Xóa</button>
                            </td>`
    )
}

function deleteRow(data) {
    $(`#${data._id}`).remove();
}

async function reloadTable() {
    try {
        let carFuelData = await MeteorCall(_METHODS.carFuel.GetAll, null, accessToken);
        carFuelData.data.map(carFuel => {
            carFuel.modelName = car.carModel.model;
            let html = htmlRow(car);
            $("#table-body").append(html);
        })
    }
    catch (err) {
        handleError(err)
    }
}

function htmlRow(data) {
    return `<tr id=${data._id}>
                <th scope="row"></th>
                <td>${data.modelName}</td>
                <td>${data.licensePlate}</td>
                <td>${data.status}</td>
                <td>
                <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(data)}\'>Sửa</button>
                <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(data)}\'>Xóa</button>
                </td>
            </tr>`
}

function clearForm() {
    $(".button-car-selected").attr("title", "chọn xe");
    $(".car-result").attr("carID", "");
    $(".car-result").html("Chọn Xe");
    $('input[name="volume-input"]').val();
    $('input[name="cost-input"]').val();
}
