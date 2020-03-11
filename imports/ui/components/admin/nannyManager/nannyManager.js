import './nannyManager.html'

const Cookies = require("js-cookie");

import {
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm,
    addRequiredInputLabel,
    addPaging,
    tablePaging,
    getBase64,
    makeID,
    initDropzone
} from "../../../../functions";

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE
} from "../../../../variableConst";


let accessToken;

Template.nannyManager.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.nannyManager.onRendered(() => {
    reloadTable();
    initDropzone(".add-more", "modify-button")
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
    $("#email-input").val(nannyData.email);
    $("#address-input").val(nannyData.address);
    $("#identityCard-input").val(nannyData.IDNumber);
    $("#identityCardDate-input").val(nannyData.IDIssueDate);
    $("#identityCardBy-input").val(nannyData.IDIssueBy);
    $("#status-input").val(nannyData.status);

    //remove ảnh cũ
    $('div.dropzone-previews').find('div.dz-preview').find('div.dz-image').find('img').attr('src', `http://123.24.137.209:3000/images/${studentData.image}/0`)
    $('div.dropzone-previews').find('div.dz-image-preview').remove()
    $('div.dz-preview').show()
    $('.dropzone-msg-title').html("Kéo ảnh hoặc click để chọn ảnh.")
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


async function SubmitForm(event) {
    try {
        event.preventDefault();
        if (checkInput()) {
            let data = {
                name: $("#name-input").val(),
                phone: $("#phone-input").val(),
                email: $("#email-input").val(),
                username: $("#phone-input").val(),
                password: "12345678",
                address: $("#address-input").val(),
                IDNumber: $("#identityCard-input").val(),
                IDIssueDate: $("#identityCardDate-input").val(),
                IDIssueBy: $("#identityCardBy-input").val(),
                status: $("#status-input").val(),
            }
            let imagePreview = $('div.dropzone-previews').find('div.dz-image-preview')
            if (imagePreview.length) {
                if (imagePreview.hasClass('dz-success')) {
                    let imageId = makeID("user")
                    let BASE64 = imagePreview.find('div.dz-image').find('img').attr('src')
                    let importImage = await MeteorCall(_METHODS.image.Import, {
                        imageId,
                        BASE64: [BASE64]
                    }, accessToken)
                    if (importImage.error)
                        handleError(result, "Không tải được ảnh lên server!")
                    else data.image = imageId
                }
            }

            let modify = $("#editNannyModal").attr("nannyID");
            if (modify == "") {
                await MeteorCall(_METHODS.Nanny.Create, data, accessToken)
                    .then(result => {
                        handleSuccess("Thêm", "bảo mẫu").then(() => {
                            $("#editNannyModal").modal("hide");
                        })
                        reloadTable()
                    })
                    .catch(handleError);
            } else {
                data._id = modify;
                await MeteorCall(_METHODS.Nanny.Update, data, accessToken)
                    .then(result => {
                        handleSuccess("Thêm", "bảo mẫu").then(() => {
                            $("#editNannyModal").modal("hide");
                        })
                        reloadTable()
                    })
                    .catch(handleError);
            }
        }
    } catch (error) {
        handleError(error)
    }
}

function checkInput() {
    let name = $("#name-input").val()
    let phone = $("#phone-input").val()
    let email = $("#email-input").val()
    let address = $("#address-input").val()
    let IDNumber = $("#identityCard-input").val()
    let IDIssueDate = $("#identityCardDate-input").val()
    let IDIssueBy = $("#identityCardBy-input").val()
    if (!name || !phone || !email || !address || !IDNumber || !IDIssueBy || !IDIssueDate) {
        Swal.fire({
            icon: "error",
            text: "Làm ơn điền đầy đủ thông tin",
            timer: 3000
        })
        return false
    } else {
        return true
    }
}


async function reloadTable() {
    try {
        let nannyData = await MeteorCall(_METHODS.Nanny.GetAll, {
            extra: "user"
        }, accessToken);
        nannyData.data.map(nanny => {
            let html = htmlRow(nanny);
            $("#table-body").append(html);
        })
    } catch (err) {
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

    // remove ảnh
    $('div.dropzone-previews').find('div.dz-preview').find('div.dz-image').find('img').attr('src', '')
}