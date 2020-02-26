import './nannyManager.html'

const Cookies = require("js-cookie");

import { MeteorCall, handleError } from "../../../../functions";

import { _METHODS } from "../../../../variableConst";

let accessToken;

Template.nannyManager.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.nannyManager.onRendered(() => {
    reloadTable();
});

Template.nannyManager.events({
    "submit form": SubmitForm,
    "click .modify-button": ClickModifyButton,
    "click .add-more": ClickAddmoreButton,
    "click .delete-button": ClickDeleteButton,
});

function ClickAddmoreButton(event) {
    $(".modal-title").html("Thêm mới");
    $(".confirm-button").html("Thêm");

    $("#editNannyModal").modal("show");
    $("#editNannyModal").attr("nannyID", "");
    $("#password-input").parent().parent().show();
    clearForm();
}

function ClickModifyButton(event) {
    $(".modal-title").html("Chỉnh sửa");
    $(".confirm-button").html("Sửa");

    let nannyData = $(event.currentTarget).data("json");
    $("#editNannyModal").attr("nannyID", nannyData._id);
    $("#editNannyModal").modal("show");

    $("#name-input").val(nannyData.name);
    $("#phone-input").val(nannyData.phone);
    $("#username-input").val(nannyData.username);
    $("#password-input").parent().parent().hide();
    $("#email-input").val(nannyData.email);
    $("#address-input").val(nannyData.address);
    $("#identityCard-input").val(nannyData.IDNumber);
    $("#identityCardDate-input").val(nannyData.IDIssueDate);
    $("#identityCardBy-input").val(nannyData.IDIssueBy);
    $("#status-input").val(nannyData.status);
    $("#image-input").val(nannyData.image);
}

function ClickDeleteButton(event) {
    let data = $(event.currentTarget).data("json");
    console.log(data._id)
    MeteorCall(_METHODS.Nanny.Delete, data, accessToken)
        .then(result => {
            deleteRow(data);
        })
        .catch(handleError);
}

function SubmitForm(event) {
    event.preventDefault();
    let data = {
        name: $("#name-input").val(),
        phone: $("#phone-input").val(),
        email: $("#email-input").val(),
        username: $("#username-input").val(),
        password: $("#password-input").val(),
        address: $("#address-input").val(),
        IDNumber: $("#identityCard-input").val(),
        IDIssueDate: $("#identityCardDate-input").val(),
        IDIssueBy: $("#identityCardBy-input").val(),
        status: $("#status-input").val(),
        image: $("#image-input").val()
    };

    let modify = $("#editNannyModal").attr("nannyID");
    if (modify == "") {
        MeteorCall(_METHODS.Nanny.Create, data, accessToken)
            .then(result => {
                $("#editNannyModal").modal("hide");
                addToTable(data, result)
            })
            .catch(handleError);
    } else {
        data._id = modify;
        MeteorCall(_METHODS.Nanny.Update, data, accessToken)
            .then(result => {
                $("#editNannyModal").modal("hide");
                modifyTable(data)
            })
            .catch(handleError);
    }
}

function addToTable(data, result) {
    data._id = result._id;
    $("#table-body").prepend(`<tr id=${data._id}>
                                <th scope="row"></th>
                                <td>${data.name}</td>
                                <td>${data.username}</td>
                                <td>${data.phone}</td>
                                <td>${data.email}</td>
                                <td>${data.address}</td>
                                <td>${data.IDNumber}</td>
                                <td>${data.IDIssueDate}</td>
                                <td>${data.IDIssueBy}</td>
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
                            <td>${data.name}</td>
                            <td>${data.username}</td>
                            <td>${data.phone}</td>
                            <td>${data.email}</td>
                            <td>${data.address}</td>
                            <td>${data.IDNumber}</td>
                            <td>${data.IDIssueDate}</td>
                            <td>${data.IDIssueBy}</td>
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
        let nannyData = await MeteorCall(_METHODS.Nanny.GetAll, {extra: "user"}, accessToken);
        nannyData.data.map(nanny => {
            let html = htmlRow(nanny);
            $("#table-body").append(html);
        })
    }
    catch (err) {
        handleError(err)
    }
}

function htmlRow(data) {
    let dt = {
        _id: data._id,
        name: data.user.name,
        phone: data.user.phone,
        email: data.user.email,
        username: data.user.username,
        address: data.address,
        IDNumber: data.IDNumber,
        IDIssueDate: data.IDIssueDate,
        IDIssueBy: data.IDIssueBy,
        status: data.status,
        image: data.image
    }
    return `<tr id=${dt._id}>
            <th scope="row"></th>
            <td>${dt.name}</td>
            <td>${dt.username}</td>
            <td>${dt.phone}</td>
            <td>${dt.email}</td>
            <td>${dt.address}</td>
            <td>${dt.IDNumber}</td>
            <td>${dt.IDIssueDate}</td>
            <td>${dt.IDIssueBy}</td>
            <td>${dt.status}</td>
            <td>
                <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(dt)}\'>Sửa</button>
                <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(dt)}\'>Xóa</button>
            </td>
        </tr>`
}

function clearForm() {
    $("#name-input").val("");
    $("#phone-input").val("");
    $("#email-input").val("");
    $("#address-input").val("");
    $("#identityCard-input").val("");
    $("#identityCardDate-input").val("");
    $("#identityCardBy-input").val("");
    $("#status-input").val("");
    $("#image-input").val("");
}