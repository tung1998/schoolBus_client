import "./administratorManager.html";

const Cookies = require("js-cookie");

import {
    MeteorCall,
    addRequiredInputLabel,
    handleError,
    addPaging,
    tablePaging,
    initDropzone,
    makeID,
} from "../../../../functions";

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE
} from "../../../../variableConst";

let accessToken;
let currentPage = 1;

Template.administratorManager.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.administratorManager.onRendered(() => {
    addPaging()
    addRequiredInputLabel()
    reloadTable(1);
    initDropzone(".add-button", ".modify-button")
});

Template.administratorManager.events({
    "submit form": SubmitForm,
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
    }
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
    $(' input[name="password"]').parent().parent().show();
    $(".modal-title").html("Thêm Mới");
    $(".confirm-button").html("Thêm");
    $("#editAdministratorModal").modal("show");
    clearForm();
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
            adminType: target.adminType.value,
            password: target.password.value
        };

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

        let modify = $("#editAdministratorModal").attr("adminID");
        // console.log(modify);
        console.log(data)
        if (modify == "") {
            MeteorCall(_METHODS.admin.Create, data, accessToken)
                .then(result => {
                    console.log(result);
                    $("#editAdministratorModal").modal("hide");
                    reloadTable(1, getLimitDocPerPage())
                }).catch(handleError);
        } else {
            data._id = modify;
            MeteorCall(_METHODS.admin.Update, data, accessToken)
                .then(result => {
                    console.log(result);
                    // renderTableRow();
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
            // console.log(result);
            // renderTableRow();
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

    if (!admintype || !name || !address || !phone || !username) {
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
    $("#name-input").val("");
    $("#address-input").val("");
    $("#phonenumber-input").val("");
    $("#email-input").val("");
    $("#admintype-input").val("");
    $("#username-input").val("");
}

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
    let table = $('#table-body');
    let emptyWrapper = $('#empty-data');
    table.html('');
    MeteorCall(_METHODS.admin.GetByPage, { page: page, limit: limitDocPerPage }, accessToken).then(result => {
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
    let item = {
        _id: data._id,
        name: data.user.name,
        username: data.user.username,
        phone: data.user.phone,
        email: data.user.email,
        adminType: data.adminType
    }
    return `
                <th scope="row">${data.index + 1}</th>
                <td>${item.name}</td>
                <td>${item.username}</td>
                <td>${item.phone}</td>
                <td>${item.email}</td>
                <td>${item.adminType}</td>
                <td>
                    <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(
                        item
                    )}\'>Sửa</button>
                    <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(
                        item
                    )}\'>Xóa</button>
                </td>`;
}