import "./feedback.html";

const Cookies = require("js-cookie");

import {
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm,
    addRequiredInputLabel,
    addPaging,
    getBase64,
    makeID,
    initDropzone,
    handlePaging
} from "../../../../functions";

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE,
    _SESSION,
    _URL_images
} from "../../../../variableConst";

let accessToken;
let currentPage = 1;

Template.feedback.onCreated(() => {
    accessToken = Cookies.get("accessToken");
    Session.set(_SESSION.isSuperadmin, true)
    Session.set('schools', [])
});

Template.feedback.onRendered(() => {
    initSelect2()
    addRequiredInputLabel();
    addPaging($('#feedbackTable'));
    reloadTable();
});

Template.feedback.events({
    //"click .modify-button": ClickModifyButton,
    //"click .add-more": ClickAddmoreButton,
    //"click .delete-button": ClickDeleteButton
});

function ClickModifyButton(event) {
    let adminData = $(event.currentTarget).data("json");

    $("#editAdministratorModal").attr("adminID", adminData._id);
    $(".modal-title").html("Chỉnh Sửa");
    $(".confirm-button").html("Sửa");
    $(' input[name="password"]').parent().parent().hide();

    $("#name-input").val(adminData.name);
    $("#username-input").val(adminData.username);
    $("#address-input").val(adminData.address);
    $("#phonenumber-input").val(adminData.phone);
    $("#email-input").val(adminData.email);
    $("#admintype-input").val(adminData.adminType);
    $("#editAdministratorModal").modal("show");
}

function ClickAddmoreButton(event) {
    $("#editAdministratorModal").attr("adminID", "");
    $(".modal-title").html("Thêm Mới");
    $(".confirm-button").html("Thêm");
    $("#editAdministratorModal").modal("show");
    clearForm();
}

function SubmitForm(event) {
    event.preventDefault();
    const target = event.target;
    let data = {
        name: target.name.value,
        username: target.username.value,
        // dob: target.dob.value,
        // address: target.address.value,
        phone: target.phoneNumber.value,
        email: target.email.value,
        adminType: target.adminType.value,
        password: target.password.value
        //avatar: target.adminType
    };
    let modify = $("#editAdministratorModal").attr("adminID");
    // console.log(modify);
    console.log(data)
    if (modify == "") {
        MeteorCall(_METHODS.admin.Create, data, accessToken)
            .then(result => {
                console.log(result);
                // renderTableRow();
                $("#editAdministratorModal").modal("hide");
                addToTable(data, result);
            }).catch(handleError);
    } else {
        data._id = modify;
        MeteorCall(_METHODS.admin.Update, data, accessToken)
            .then(result => {
                console.log(result);
                // renderTableRow();
                $("#editAdministratorModal").modal("hide");
                modifyTable(data);
            })
            .catch(handleError);
    }
}

function ClickDeleteButton(event) {
    let data = $(event.currentTarget).data("json");
    MeteorCall(_METHODS.admin.Delete, data, accessToken)
        .then(result => {
            // console.log(result);
            // renderTableRow();
            deleteRow(data);
        })
        .catch(handleError);
}

function addToTable(data, result) {
    data._id = result._id;
    $("#table-body").prepend(`<tr id=${result._id}>
                                <th scope="row"></th>
                                <td>${data.name}</td>
                                <td>${data.username}</td>
                                <td>${data.phone}</td>
                                <td>${data.email}</td>
                                <td>${data.adminType}</td>
                                <td>
                                    <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(
                                        data
                                    )}\'>Sửa</button>
                                    <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(
                                        data
                                    )}\'>Xóa</button>
                                </td>
                            </tr>`)
}

function modifyTable(data) {
    $(`#${data._id}`).html(`    <th scope="row"></th>
                                <td>${data.name}</td>
                                <td>${data.username}</td>
                                <td>${data.phone}</td>
                                <td>${data.email}</td>
                                <td>${data.adminType}</td>
                                <td>
                                    <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(
                                        data
                                    )}\'>Sửa</button>
                                    <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(
                                        data
                                    )}\'>Xóa</button>
                                </td>`)
}

function deleteRow(data) {
    $(`#${data._id}`).remove();
}

function reloadTable() {
    MeteorCall(_METHODS.feedback.GetAll, {
            extra: "responseUser"
        }, accessToken)
        .then(result => {
            console.log(result)
            let htmlTable = result.data.map(htmlRow);
            $("#table-body").html(htmlTable.join(" "));
        })
        .catch(handleError);
}

function htmlRow(data) {
    let item = {
        _id: data._id,
        userID: data.userID,
        type: data.type,
        feedback: data.feedback,
        status: data.status,
        responseBy: data.responseBy,
        responseTime: data.responseTime,
        response: data.response,
        createdTime: data.createdTime,
        updatedTime: data.updatedTime,
        isDeleted: data.isDeleted,
    }
    return ` <tr id = ${item._id}>
                <th scope="row"></th>
                <td>${item.userID}</td>
                <td>${item.type}</td>
                <td>${item.feedback}</td>
                <td>${item.createdTime}</td>
                <td>${item.responseBy}</td>
                <td>${item.responseTime}</td>
                <td>${item.response}</td>
            </tr>`;
}

function clearForm() {
    $("#name-input").val("");
    $("#address-input").val("");
    $("#phonenumber-input").val("");
    $("#email-input").val("");
    $("#admintype-input").val("");
}