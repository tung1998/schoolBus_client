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
    handleSuccess,
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

    $('#admintype-input').select2({
        width: "100%",
        placeholder: "Loại admin",
        minimumResultsForSearch: Infinity

    })
    initFilter()
    addPaging($('#administratorTable'))
    addRequiredInputLabel()
    reloadTable(1);
    dropzone = initDropzone("#kt_dropzone_1")
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
    $("#admintype-input").val(adminData.adminType).trigger('change');
    $("#editAdministratorModal").modal("show");
    if (adminData.image) {
        imgUrl = `${_URL_images}/${adminData.image}/0`
        $('#avata').attr('src', imgUrl)
        $('.avatabox').removeClass('kt-hidden')
    } else {
        $('.avatabox').addClass('kt-hidden')
    }

    if (adminData.adminType == 0) $('#school-input').parent().parent().addClass('kt-hidden')
    else {
        $('#school-input').val(adminData.schoolID).trigger('change')
        $('#school-input').parent().parent().removeClass('kt-hidden')
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
            password: "12345678"
        };

        if (Session.get(_SESSION.isSuperadmin)) {
            data.adminType = Number($('#admintype-input').val())
            if (data.adminType == 1) data.schoolID = $('#school-input').val()
            console.log(data);
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
                    handleSuccess("Đã thêm")
                }).catch(handleError);
            } else {
                data._id = modify;
                console.log(data);
                MeteorCall(_METHODS.admin.Update, data, accessToken)
                .then(result => {
                    $("#editAdministratorModal").modal("hide");
                    handleSuccess("Đã sửa!")
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
            handleSuccess('Đã xóa!')
            reloadTable(currentPage, getLimitDocPerPage())
        })
        .catch(handleError);
}

function checkInput() {
    let name = $("#name-input").val();
    // let address = $("#address-input").val();
    let phone = $("#phonenumber-input").val();
    // let email = $("#email-input").val("");
    let admintype = $("#admintype-input").val();
    let username = $("#username-input").val();

    if ((Session.get(_SESSION.isSuperadmin) && admintype == null) || !name || !phone || !username) {
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

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE, options = null) {
    let table = $('#table-body');
    MeteorCall(_METHODS.admin.GetByPage, {
        page: page,
        limit: limitDocPerPage,
        options
    }, accessToken).then(result => {
        handlePaging(table, result.count, page, limitDocPerPage)
        createTable(table, result, limitDocPerPage)
    })
}

function createTable(table, result, limitDocPerPage) {
    let htmlRow = result.data.map((key, index) => {
        key.index = index + (result.page - 1) * limitDocPerPage;
        return createRow(key);
    });
    table.html(htmlRow.join(''))
}

function createRow(result, index) {
    let data = {
        _id: result._id,
        name: result.user.name,
        username: result.user.username,
        phone: result.user.phone,
        email: result.user.email,
        adminType: result.adminType,
        image: result.user.image,
        schoolName: result.school ? result.school.name : '',
        schoolID: result.schoolID ? result.schoolID : ''
    }
   
    return `
        <tr id="${data._id}" class="table-row">
            <td>${result.index + 1}</td>
            <td>${data.name}</td>
            <td>${data.username}</td>
            <td>${data.phone}</td>
            <td>${data.email}</td>
            <td>${data.adminType==0?"Quản trị viên tổng":"Quản trị viên trường"}</td>
            <td>${data.schoolName}</td>
            <td>
                <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(
                    data
                )}\'>Sửa</button>
                <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(
                    data
                )}\'>Xóa</button>
            </td>
        </tr>
        `
}

function initFilter() {
    let filterHtml = `
    <div class="form-group row">
        <label for="student-name" class="col-3 col-form-label">Họ tên</label>
        <div class="col-9">
            <input class="form-control filter-input" type="text" value="" id="student-name-filter" 
                name="student-name">
        </div>
    </div>
    <div class="form-group row">
        <label for="student-route" class="col-3 col-form-label">Địa chỉ</label>
        <div class="col-9">
            <input class="form-control filter-input" type="text" value="" id="student-address-filter"
                name="student-address">
        </div>
    </div>
    <div class="form-group row">
        <label for="student-parent-route" class="col-3 col-form-label">Số điện thoại</label>
        <div class="col-9">
        <input class="form-control filter-input" type="text" value="" id="student-phone-filter"
        name="student-phone">
        </div>
    </div>
    <div class="form-group row">
        <label for="student-parent-route" class="col-3 col-form-label">Email</label>
        <div class="col-9">
        <input class="form-control filter-input" type="text" value="" id="student-email-filter"
        name="student-email">
        </div>
    </div>
    <div class="form-group row">
        <label for="student-parent-route" class="col-3 col-form-label">Trường</label>
        <div class="col-9">
        <input class="form-control filter-input" type="text" value="" id="student-school-filter"
        name="student-email">
        </div>
    </div>
    <div class="form-group row">
        <label for="student-parent-route" class="col-3 col-form-label">Lớp</label>
        <div class="col-9">
        <input class="form-control filter-input" type="text" value="" id="student-class-filter"
        name="student-class">
        </div>
    </div>
    <button type="submit" class="btn btn-primary" id="filter-button">Tìm kiếm</button>
    <button type="submit" class="btn btn-primary" id="refresh-button">Tìm kiếm</button>`
    $('.kt-demo-panel__body').html(filterHtml)

    $('#filter-button').on('click', e => {
        let option = [{
            text: "user/name",
            value: $('#student-name-filter').val()
        },{
            text: "address",
            value: $('#student-address-filter').val()
        },{
            text: "user/phone",
            value: $('#student-phone-filter').val()
        },{
            text: "user/email",
            value: $('#student-email-filter').val()
        },{
            text: "class/school/name",
            value: $('#student-school-filter').val()
        },{
            text: "class/name",
            value: $('#student-class-filter').val()
        }]
        
        reloadTable(1, getLimitDocPerPage(), option)
    })
}

function initSchoolSelect2() {
    MeteorCall(_METHODS.school.GetAll, null, accessToken).then(result => {
        Session.set('schools', result.data)
        $('#school-input').select2({
            width: '100%',
            placeholder: "Chọn trường"
        })
    }).catch(handleError)
}

function adminTypeChange(e) {
    let value = e.currentTarget.value
    if (value == 0) $('#school-input').parent().parent().addClass('kt-hidden')
    else $('#school-input').parent().parent().removeClass('kt-hidden')
}