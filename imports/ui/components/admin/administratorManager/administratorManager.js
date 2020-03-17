import "./administratorManager.html";

const Cookies = require("js-cookie");

import {
    MeteorCall,
    addRequiredInputLabel,
    handleError,
    addPaging,
    handlePaging,
    initDropzone,
    makeID,
} from "../../../../functions";

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE,
    _SESSION,
    _URL_images
} from "../../../../variableConst";

let accessToken;
let currentPage = 1;
let dropzone

Template.administratorManager.onCreated(() => {
    accessToken = Cookies.get("accessToken");
    Session.set(_SESSION.isSuperadmin, true)
    Session.set('schools', [])
});

Template.administratorManager.onRendered(() => {
    MeteorCall(_METHODS.user.IsSuperadmin, null, accessToken).then(result => {
        Session.set(_SESSION.isSuperadmin, result)
        if (result)
            initSchoolSelect2()
    }).catch(handleError)

    addPaging()
    addRequiredInputLabel()
    reloadTable(1);
    dropzone = initDropzone("#kt_dropzone_1")
    this.dropzone = dropzone
});

Template.administratorManager.onDestroyed(() => {
    dropzone = null
});

Template.administratorManager.events({
    "submit form": SubmitForm,
    "click .dz-preview": dzPreviewClick,
    "click .modify-button": ClickModifyButton,
    "click .add-button": ClickAddmoreButton,
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
    "change #admintype-input": adminTypeChange
});

Template.editAdministratorModal.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    },
    schools() {
        return Session.get('schools')
    },
});

function dzPreviewClick() {
    dropzone.hiddenFileInput.click()
}

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
    if (adminData.image) {
        imgUrl = `${_URL_images}/${adminData.image}/0`
        $('#avata').attr('src', imgUrl)
        $('.avatabox').removeClass('kt-hidden')
    }
    dropzone.removeAllFiles(true)
}

function ClickAddmoreButton(event) {
    $("#editAdministratorModal").attr("adminID", "");
    $(' input[name="password"]').parent().parent().show();
    $(".modal-title").html("Thêm Mới");
    $(".confirm-button").html("Thêm");
    $("#editAdministratorModal").modal("show");
    clearForm();
    $('.avatabox').addClass('kt-hidden')
}

async function SubmitForm(event) {
    event.preventDefault();
    const target = event.target;
    if (checkInput()) {
        let data = {
            name: target.name.value,
            username: target.username.value,
            phone: target.phoneNumber.value,
            email: target.email.value,
            password: target.password.value
        };

        if (Session.get(_SESSION.isSuperadmin)) {
            data.adminType == Number(target.adminType.value)
            if (data.adminType == 1) data.schoolID = target.school.value
        }
        let imagePreview = $('#kt_dropzone_1').find('div.dz-image-preview')
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

        let modify = $("#editAdministratorModal").attr("adminID");
        // console.log(modify);
        if (modify == "") {
            MeteorCall(_METHODS.admin.Create, data, accessToken)
                .then(result => {
                    $("#editAdministratorModal").modal("hide");
                    reloadTable(1, getLimitDocPerPage())
                }).catch(handleError);
        } else {
            data._id = modify;
            MeteorCall(_METHODS.admin.Update, data, accessToken)
                .then(result => {
                    $("#editAdministratorModal").modal("hide");
                    reloadTable(currentPage, getLimitDocPerPage())
                })
                .catch(handleError);
        }
    }

}

function ClickDeleteButton(event) {
    let data = $(event.currentTarget).data("json");
    MeteorCall(_METHODS.admin.Delete, data, accessToken)
        .then(result => {
            reloadTable(currentPage, getLimitDocPerPage())
        })
        .catch(handleError);
}

function checkInput() {
    let name = $("#name-input").val();
    let address = $("#address-input").val();
    let phone = $("#phonenumber-input").val();
    // let email = $("#email-input").val("");
    let admintype = $("#admintype-input").val();
    let username = $("#username-input").val();

    if ((Session.get(_SESSION.isSuperadmin) && admintype == null) || !name || !address || !phone || !username) {
        Swal.fire({
            icon: "error",
            text: "Chưa đủ thông tin!",
            timer: 3000
        })
        return false;
    } else {
        return true;
    }

}

function clearForm() {
    $("#name-input").val("");
    $("#address-input").val("");
    $("#phonenumber-input").val("");
    $("#email-input").val("");
    $("#admintype-input").val("");
    $("#username-input").val("");
    dropzone.removeAllFiles(true)
}

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
    let table = $('#table-body');
    MeteorCall(_METHODS.admin.GetByPage, {
        page: page,
        limit: limitDocPerPage
    }, accessToken).then(result => {
        handlePaging(table, result.count, page, limitDocPerPage)
        let htmlRow = result.data.map(createRow);
        table.html(htmlRow.join(''));
    })

}

function createRow(data, index) {
    let item = {
        _id: data._id,
        name: data.user.name,
        username: data.user.username,
        phone: data.user.phone,
        email: data.user.email,
        adminType: data.adminType,
        image: data.user.image,
        schoolName: data.school ? data.school.name : ''
    }
    return `
        <tr id="${item._id}" class="table-row">
            <td>${item.name}</td>
            <td>${item.username}</td>
            <td>${item.phone}</td>
            <td>${item.email}</td>
            <td>${item.adminType==0?"Quản trị viên tổng":"Quản trị viên trường"}</td>
            <td>${item.schoolName}</td>
            <td>
                <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(
                    item
                )}\'>Sửa</button>
                <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(
                    item
                )}\'>Xóa</button>
            </td>
        </tr>
        `
}

function initSchoolSelect2() {
    MeteorCall(_METHODS.school.GetAll, null, accessToken).then(result => {
        Session.set('schools', result.data)
        $('#school-input').select2({
            width: '100%'
        })
    }).catch(handleError)
}

function adminTypeChange(e) {
    let value = e.currentTarget.value
    if (value == 0) $('#school-input').parent().parent().addClass('kt-hidden')
    else $('#school-input').parent().parent().removeClass('kt-hidden')
}