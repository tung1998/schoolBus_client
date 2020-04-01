import './nannyManager.html'

const Cookies = require("js-cookie");

import {
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm,
    addRequiredInputLabel,
    addPaging,
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
let dropzone;

Template.nannyManager.onCreated(() => {
    accessToken = Cookies.get("accessToken");
    Session.set(_SESSION.isSuperadmin, true)
    Session.set('schools', [])
});

Template.nannyManager.onRendered(() => {
    reloadTable();
    addRequiredInputLabel()
    addPaging($('#nannyTable'))
    reloadTable();
    dropzone = initDropzone("#kt_dropzone_1")
    this.dropzone = dropzone

    if (Session.get(_SESSION.isSuperadmin))
        initSchoolSelect2()

});

Template.editNannyModal.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    },
    schools() {
        return Session.get('schools')
    },
})

Template.nannyManager.onDestroyed(() => {
    dropzone = null
});

Template.nannyManager.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    }
})

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
    },
    "click .dz-preview": dzPreviewClick,
});

function dzPreviewClick() {
    dropzone.hiddenFileInput.click()
}

Template.nannyFilter.onRendered(() => {
    $('#school-filter').select2({
        placeholder: "Chọn trường",
        width: "100%"
    })
})

Template.nannyFilter.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    },
    schools() {
        return Session.get('schools')
    },
});

Template.nannyFilter.events({
    'click #filter-button': nannyFilter,
    'click #refresh-button': refreshFilter,
    'keypress .filter-input': (e) => {
        if (e.which === 13 || e.keyCode == 13) {
            nannyFilter()
        }
    },
    'change #school-filter': (e) => {
        let options = [{
            text: "schoolID",
            value: $('#school-filter').val()
        }]
        reloadTable(1, getLimitDocPerPage(), options)
    }
})



function ClickAddmoreButton(event) {
    $(".modal-title").html("Thêm mới");
    $(".confirm-button").html("Thêm");

    $("#editNannyModal").modal("show");
    $("#editNannyModal").attr("nannyID", "");
    $("#password-input").parent().parent().show();
    $('.avatabox').addClass('kt-hidden')
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

    if (Session.get(_SESSION.isSuperadmin)) {
        $('#school-input').val(data.schoolID).trigger('change')
    }
    //remove ảnh cũ
    if (teacherData.image) {
        imgUrl = `${_URL_images}/${teacherData.image}/0`
        $('#avata').attr('src', imgUrl)
        $('.avatabox').removeClass('kt-hidden')
    } else {
        $('.avatabox').addClass('kt-hidden')
    }
    dropzone.removeAllFiles(true)
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
            if (Session.get(_SESSION.isSuperadmin)) {
                data.schoolID = $('#school-input').val()
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
            text: "Chưa đủ thông tin!",
            timer: 3000
        })
        return false;
    } else {
        if (Session.get(_SESSION.isSuperadmin)) {
            let schoolID = $('#school-input').val()
            if (!schoolID) {
                Swal.fire({
                    icon: "error",
                    text: "Chưa chọn trường!",
                    timer: 2000
                })
                return false;
            }

        }
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
    if (Session.get(_SESSION.isSuperadmin)) {
        $('#school-input').val('').trigger('change')
    }
    dropzone.removeAllFiles(true)
}

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE, options = null) {
    let table = $('#table-body');
    MeteorCall(_METHODS.Nanny.GetByPage, {
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
        return createRow(key)
    });
    table.html(htmlRow.join(''))
}

function createRow(result) {
    let data = {
        _id: result._id,
        name: result.user.name,
        phone: result.user.phone,
        email: result.user.email,
        username: result.user.username,
        address: result.address,
        schoolID: result.schoolID,
        schoolName: result.school.name,
        IDNumber: result.IDNumber,
        IDIssueDate: result.IDIssueDate,
        IDIssueBy: result.IDIssueBy,
        status: result.status,
        image: result.image
    }
    return `
        <tr id="${data._id}" class="table-row">
            <th class="text-center">${result.index + 1}</th>
            ${Session.get(_SESSION.isSuperadmin) ? `<td>${data.schoolName}</td>`: ''}
            <td>${data.name}</td>
            <td>${data.username}</td>
            <td>${data.phone}</td>
            <td>${data.email}</td>
            <td>${data.address}</td>
            <td>${data.IDNumber}</td>
            <td>${data.IDIssueDate}</td>
            <td>${data.IDIssueBy}</td>
            <td>${data.status}</td>
            <td class="text-center>
                <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(data)}\'>Sửa</button>
                <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(data)}\'>Xóa</button>
            </td>
        </tr>
        `
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

function nannyFilter() {
    let options = [{
        text: "schoolID",
        value: $('#school-filter').val()
    }, {
        text: "user/name",
        value: $('#name-filter').val()
    }, {
        text: "user/phone",
        value: $('#phone-filter').val()
    }, {
        text: "user/email",
        value: $('#email-filter').val()
    }, {
        text: "IDNumber",
        value: $('#cccd-filter').val()
    }]
    console.log(options);
    reloadTable(1, getLimitDocPerPage(), options)
}

function refreshFilter() {
    $('#school-filter').val('').trigger('change')
    $('#name-filter').val('')
    $('#phone-filter').val('')
    $('#email-filter').val('')
    $('#cccd-filter').val('')

    reloadTable(1, getLimitDocPerPage(), null)
}