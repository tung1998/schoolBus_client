import './schoolManager.html';

const Cookies = require('js-cookie');

import {
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm,
    addRequiredInputLabel,
    addPaging,
    tablePaging,
    handlePaging
} from '../../../../functions'

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE
} from '../../../../variableConst'

let accessToken;
let currentPage = 1;

Template.schoolManager.onCreated(() => {
    accessToken = Cookies.get('accessToken')
})

Template.schoolManager.onRendered(() => {
    addPaging($('#schoolTable'));
    getLimitDocPerPage();
    reloadTable();
    addRequiredInputLabel();
})

Template.schoolManager.events({
    'click .modify-button': ClickModifyButton,
    'click .confirm-button': ClickConfirmButton,
    'click .add-more': ClickAddmoreButton,
    'click .delete-button': ClickDeleteButton,
    "click .kt-datatable__pager-link": (e) => {
        reloadTable(parseInt($(e.currentTarget).data('page')), getLimitDocPerPage());
        $(".kt-datatable__pager-link").removeClass("kt-datatable__pager-link--active");
        $(e.currentTarget).addClass("kt-datatable__pager-link--active")
        currentPage = parseInt($(e.currentTarget).data('page'));
    },
    "change #limit-doc": (e) => {
        reloadTable(1, getLimitDocPerPage());
    }
})


Template.schoolFilter.events({
    'click #filter-button': schoolFilter,
    'click #refresh-button': refreshFilter,
    'keypress .filter-input': (e) => {
        if (e.which === 13 || e.keyCode == 13) {
            schoolFilter()
        }
    },
})

function ClickModifyButton(e) {
    let schoolData = $(e.currentTarget).data("json");
    $("#editSchoolModal").attr("schoolID", schoolData._id);
    $(".modal-title").html("Chỉnh Sửa");
    $(".confirm-button").html("Sửa")
    $("#name-input").val(schoolData.name);
    $("#address-input").val(schoolData.address);
    $("#editSchoolModal").modal("show");
}

function ClickAddmoreButton(e) {
    $("#editSchoolModal").attr("schoolID", "");
    $(".modal-title").html("Thêm Mới");
    $(".confirm-button").html("Thêm")
    clearForm();
}

function ClickConfirmButton() {
    if (checkInput()) {
        let data = {
            name: $("#name-input").val(),
            address: $("#address-input").val(),
            status: 0
        }
        let modify = $("#editSchoolModal").attr("schoolID");
        if (modify == "") {
            MeteorCall(_METHODS.school.Create, data, accessToken).then(result => {
                handleSuccess("Thêm", "trường học").then(() => {
                    $("#editSchoolModal").modal("hide");
                })

                reloadTable(1, getLimitDocPerPage())
            }).catch(handleError)
        } else {
            data._id = modify;
            MeteorCall(_METHODS.school.Update, data, accessToken).then(result => {
                handleSuccess("Cập nhật", "trường học").then(() => {
                    $("#editSchoolModal").modal("hide");
                })
                reloadTable(currentPage, getLimitDocPerPage())
            }).catch(handleError)
        }
    }

}

function ClickDeleteButton(e) {
    handleConfirm().then(result => {
        if (result.value) {
            let data = $(e.currentTarget).data("json");
            MeteorCall(_METHODS.school.Delete, data, accessToken).then(result => {
                Swal.fire({
                    icon: "success",
                    text: "Đã xóa thành công",
                    timer: 3000
                })
                reloadTable(currentPage, getLimitDocPerPage());
            }).catch(handleError)
        } else {

        }
    })
}

function checkInput() {
    let name = $("#name-input").val();
    let address = $("#address-input").val();
    if (!name || !address) {
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
}

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE, options = null) {
    let table = $('#table-body');
    MeteorCall(_METHODS.school.GetByPage, {
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

function createRow(result) {
    let data = {
        _id: result._id,
        name: result.name,
        address: result.address
    }
    return `
        <tr id="${data._id}">
            <td>${result.index + 1}</td>
            <td>${data.name}</td>
            <td>${data.address}</td>
            <td>
            <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(data)}\'>Sửa</button>
            <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(data)}\'>Xóa</button>
            </td>
        </tr>
        `
}


function schoolFilter() {
    let options = [{
        text: "name",
        value: $('#schoolName-filter').val()
    }, {
        text: "address",
        value: $('#address-filter').val()
    }]
    reloadTable(1, getLimitDocPerPage(), options)
}

function refreshFilter() {
    $('#schoolName-filter').val('')
    $('#address-filter').val('')

    reloadTable(1, getLimitDocPerPage(), null)
}