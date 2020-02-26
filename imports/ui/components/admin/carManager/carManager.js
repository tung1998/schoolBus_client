import './carManager.html'

const Cookies = require("js-cookie");

import { MeteorCall, handleError } from "../../../../functions";

import { _METHODS } from "../../../../variableConst";

let accessToken;

Template.carManager.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.carManager.onRendered(() => {
    reloadTable();
    renderModelOption();
});

Template.carManager.events({
    "submit form": SubmitForm,
    "click .modify-button": ClickModifyButton,
    "click .add-more": ClickAddmoreButton,
    "click .delete-button": ClickDeleteButton,
    "click .model-option": ClickSelectModelOption,
});

function renderModelOption() {
    MeteorCall(_METHODS.carModel.GetAll, null, accessToken)
    .then(result => {
      let optionSelects = result.data.map(res => {
        return `<li>
                      <a
                        role="option"
                        class="dropdown-item model-option"
                        id=${res._id}
                        tabindex="0"
                        aria-setsize="6"
                        aria-posinset="1"
                        ><span class="text">${res.model}</span></a
                      >
                    </li>`;
      });
      $("#model-select").html(optionSelects.join(" "));
    })
    .catch(handleError);
}

function ClickSelectModelOption(event) {
    let id = $(event.currentTarget).attr("id");
    let model = $(event.currentTarget).text();
    $(".model-result").html(model);
    $(".button-model-selected").attr("title", model);
    $(".model-result").attr("carModelID", id);
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
            deleteRow(data);
        })
        .catch(handleError);
}

function SubmitForm(event) {
    event.preventDefault();
    let data = {
        carModelID: $(".model-result").attr("carModelID"),
        status: $('input[name="status-input"]').val(),
        modelName: $(".model-result").html(),
        numberPlate: $('input[name="licensePlate-input"]').val()
    };

    let modify = $("#editCarManagerModal").attr("carID");
    if (modify == "") {
        MeteorCall(_METHODS.car.Create, data, accessToken)
            .then(result => {
                $("#editCarManagerModal").modal("hide");
                addToTable(data, result)
            })
            .catch(handleError);
    } else {
        data._id = modify;
        MeteorCall(_METHODS.car.Update, data, accessToken)
            .then(result => {
                $("#editCarManagerModal").modal("hide");
                modifyTable(data)
            })
            .catch(handleError);
    }
}

function addToTable(data, result) {
    data._id = result._id;
    $("#table-body").prepend(`<tr id=${data._id}>
                                <th scope="row"></th>
                                <td>${data.modelName}</td>
                                <td>${data.numberPlate}</td>
                                <td>${data.status}</td>
                                <td>
                                <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(data)}\'>Sửa</button>
                                <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(data)}\'>Xóa</button>
                                </td>
                            </tr>`
    )
}

function modifyTable(data) {
    $(`#${data._id}`).html(`<th scope="row"></th>
                            <td>${data.modelName}</td>
                            <td>${data.numberPlate}</td>
                            <td>${data.status}</td>
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
        let carData = await MeteorCall(_METHODS.car.GetAll, null, accessToken);
        carData.data.map(car => {
            car.modelName = car.carModel.model;
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
                <td>${data.numberPlate}</td>
                <td>${data.status}</td>
                <td>
                <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(data)}\'>Sửa</button>
                <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(data)}\'>Xóa</button>
                </td>
            </tr>`
}


function clearForm() {
    $(".button-model-selected").attr("title", "chọn model");
    $(".model-result").attr("carModelID", "");
    $(".model-result").html("Chọn Model");
    $('input[name="licensePlate-input"]').val();
    $('input[name="status-input"]').val();
}
