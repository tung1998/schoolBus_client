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
    makeID
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
    addRequiredInputLabel()
    addPaging()
    reloadTable(1);
});

Template.nannyManager.events({
    "submit form": SubmitForm,
    "click .modify-button": ClickModifyButton,
    "click .add-more": ClickAddmoreButton,
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
    // $("#image-input").val(nannyData.image);
}

function ClickDeleteButton(event) {
    let data = $(event.currentTarget).data("json");
    console.log(data._id)
    MeteorCall(_METHODS.Nanny.Delete, data, accessToken)
        .then(result => {
            reloadTable(currentPage, getLimitDocPerPage())
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
            if ($('#nanny-image').val()) {
                let imageId = makeID("user")
                let BASE64 = await getBase64($('#nanny-image')[0].files[0])
                let importImage = await MeteorCall(_METHODS.image.Import, {
                    imageId,
                    BASE64: [BASE64]
                }, accessToken)
                if (importImage.error)
                    handleError(result, "Không tải được ảnh lên server!")
                else data.image = imageId
            }

            let modify = $("#editNannyModal").attr("nannyID");
            if (modify == "") {
                await MeteorCall(_METHODS.Nanny.Create, data, accessToken)
                    .then(result => {
                        handleSuccess("Thêm", "bảo mẫu").then(() => {
                            $("#editNannyModal").modal("hide");
                        })
                        reloadTable(1, getLimitDocPerPage())
                    })
                    .catch(handleError);
            } else {
                data._id = modify;
                await MeteorCall(_METHODS.Nanny.Update, data, accessToken)
                    .then(result => {
                        handleSuccess("Thêm", "bảo mẫu").then(() => {
                            $("#editNannyModal").modal("hide");
                        })
                        reloadTable(currentPage, getLimitDocPerPage())
                    })
                    .catch(handleError);
            }
        }
    } catch (error) {
        handleError(error)
    }
}

function checkInput() {
    let name = $("#name-input").val();
    let phone = $("#phone-input").val();
    let email = $("#email-input").val();
    let address = $("#address-input").val();
    let identityCard = $("#identityCard-input").val();
    let identityCardDate = $("#identityCardDate-input").val();
    let identityCardBy = $("#identityCardBy-input").val();
    let status = $("#status-input").val();
    $("#image-input").val();

    if (!identityCard || !name || !address || !phone || !identityCardDate || !identityCardBy || !status) {
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
    $("#phone-input").val("");
    $("#email-input").val("");
    $("#address-input").val("");
    $("#identityCard-input").val("");
    $("#identityCardDate-input").val("");
    $("#identityCardBy-input").val("");
    $("#status-input").val("");
    $("#image-input").val("");
}

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
    let table = $('#table-body');
    let emptyWrapper = $('#empty-data');
    table.html('');
    MeteorCall(_METHODS.Nanny.GetByPage, { page: page, limit: limitDocPerPage }, accessToken).then(result => {
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
    return `
            <th scope="row">${data.index}</th>
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
            </td>`
}