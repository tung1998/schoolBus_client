import './driverManager.html'

import {
    Session
} from 'meteor/session'

const Cookies = require('js-cookie')

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
    handlePaging,
    convertTime

} from '../../../../functions'

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE,
    _SESSION,
    _URL_images
} from '../../../../variableConst'

let accessToken;
let currentPage = 1;
let dropzone

Template.driverManager.onCreated(() => {
    accessToken = Cookies.get('accessToken')
    Session.set('schools', [])
});

Template.driverManager.onRendered(() => {
    addPaging($('#driverTable'));
    reloadTable(1, getLimitDocPerPage())
    addRequiredInputLabel()
    initDatePicker()
    dropzone = initDropzone("#kt_dropzone_1")
    this.dropzone = dropzone

    this.checkIsSuperAdmin = Tracker.autorun(() => {
        if (Session.get(_SESSION.isSuperadmin))
            initSchoolSelect2()
    })

})

Template.driverManager.onDestroyed(() => {
    dropzone = null
    if (this.checkIsSuperAdmin) this.checkIsSuperAdmin = null
    Session.delete('schools')
});

Template.driverManager.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    }
})

Template.driverManager.events({
    'click #add-button': () => {
        $('.modal-title').html("Thêm lái xe mới");
        $('.modal-footer').find('.btn.btn-primary').html("Thêm mới")
        clearForm()
        $('.avatabox').addClass('kt-hidden')
    },
    'click .edit-button': clickEditButton,
    'click .submit-button': clickSubmitButton,
    'click .delete-button': clickDelButton,
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
})

Template.editDriverModal.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    },
    schools() {
        return Session.get('schools')
    },
})

Template.driverFilter.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    },
    schools() {
        return Session.get('schools')
    },
});

Template.driverFilter.events({
    'click #filter-button': driverFilter,
    'click #refresh-button': refreshFilter,
    'keypress .filter-input': (e) => {
        if (e.which === 13 || e.keyCode == 13) {
            driverFilter()
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


function dzPreviewClick() {
    dropzone.hiddenFileInput.click()
}

function clickEditButton(event) {
    //fill data
    let data = $(event.currentTarget).data("json");
    $('#driver-name').val(data.name)
    $('#driver-phone').val(data.phone)
    $('#driver-email').val(data.email)
    $('#driver-address').val(data.address)
    $('#driver-IDNumber').val(data.IDNumber)
    $('#driver-IDIssueDate').val(data.IDIssueDate)
    $('#driver-IDIssueBy').val(data.IDIssueBy)
    $('#driver-DLNumber').val(data.DLNumber)
    $('#driver-DLIssueDate').val(data.DLIssueDate)
    $('#driver-id').val(data._id)

    if (Session.get(_SESSION.isSuperadmin)) {
        $('#school-input').val(data.schoolID).trigger('change')
    }

    if (data.image) {
        imgUrl = `${_URL_images}/${data.image}/0`
        $('#avata').attr('src', imgUrl)
        $('.avatabox').removeClass('kt-hidden')
    } else {
        $('.avatabox').addClass('kt-hidden')
    }
    dropzone.removeAllFiles(true)
    //edit modal
    $('.modal-title').html(`Cập nhật thông tin lái xe: ${data.name}`);
    $('.modal-footer').find('.btn.btn-primary').html("Cập nhật")

}

async function clickSubmitButton() {
    try {
        if (checkInput()) {
            let data = getInputData()
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

            if (!data._id) {
                await MeteorCall(_METHODS.driver.Create, data, accessToken)
                console.log("đã thêm mới");
                handleSuccess("Thêm")
                reloadTable(1, getLimitDocPerPage())
                $('#editDriverModal').modal("hide")


            } else {
                await MeteorCall(_METHODS.driver.Update, data, accessToken)
                handleSuccess("Cập nhật")
                reloadTable(1, getLimitDocPerPage())
                $('#editDriverModal').modal("hide")

                console.log("đã update");
            }
            
            clearForm()
        }
    } catch (error) {
        handleError(error)
    }
}

function clickDelButton(event) {
    handleConfirm().then(result => {
        if (result.value) {
            let data = $(event.currentTarget).data("json");
            MeteorCall(_METHODS.driver.Delete, data, accessToken).then(result => {
                Swal.fire({
                    icon: "success",
                    text: "Đã xóa thành công",
                    timer: 3000
                })
                reloadTable(currentPage, getLimitDocPerPage())
            }).catch(handleError)
        }
    })
}

function getInputData() {
    let data = {
        username: $('#driver-phone').val(),
        password: '12345678',
        name: $('#driver-name').val(),
        dateOfBirth: convertTime($('#date-of-birth').val()),
        phone: $('#driver-phone').val(),
        email: $('#driver-email').val(),
        address: $('#driver-address').val(),
        IDNumber: $('#driver-IDNumber').val(),
        IDIssueDate: convertTime($('#driver-IDIssueDate').val()),
        IDIssueBy: $('#driver-IDIssueBy').val(),
        DLNumber: $('#driver-DLNumber').val(),
        DLIssueDate: convertTime($('#driver-DLIssueDate').val()),
        status: 0
    }
    if (Session.get(_SESSION.isSuperadmin)) {
        data.schoolID = $('#school-input').val()
    }
    if ($('#driver-id').val()) {
        data._id = $('#driver-id').val()
    }
    return data
}

function checkInput() {
    let name = $('#driver-name').val();
    let phone = $('#driver-phone').val();
    let address = $('#driver-address').val();
    let IDNumber = $('#driver-IDNumber').val();
    let IDIssueDate = $('#driver-IDIssueDate').val();
    let IDIssueBy = $('#driver-IDIssueBy').val();
    let DLNumber = $('#driver-DLNumber').val();
    let DLIssueDate = $('#driver-DLIssueDate').val();
    if (!name || !phone || !address || !IDNumber || !IDIssueBy || !IDIssueDate || !DLNumber || !DLIssueDate) {

        Swal.fire({
            icon: "error",
            text: "Chưa đủ thông tin!",
            timer: 2000
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

function clearForm(e) {
    $('#driver-name').val('')
    $('#driver-phone').val('')
    $('#driver-email').val('')
    $('#driver-address').val('')

    if (Session.get(_SESSION.isSuperadmin)) {
        $('#school-input').val('').trigger('change')
    }

    $('#driver-IDNumber').val('')
    $('#driver-IDIssueDate').val('')
    $('#driver-IDIssueBy').val('')
    $('#driver-DLNumber').val('')
    $('#driver-DLIssueDate').val('')
    $('#driver-id').val('')
    // remove ảnh
    dropzone.removeAllFiles(true)
}

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE, options) {
    let table = $('#table-body');
    MeteorCall(_METHODS.driver.GetByPage, {
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
        image: result.user.image,
        name: result.user.name,
        username: result.user.username,
        phone: result.user.phone,
        email: result.user.email,
        address: result.address,
        IDNumber: result.IDNumber,
        IDIssueDate: convertTime(result.IDIssueDate, true),
        IDIssueBy: result.IDIssueBy,
        DLNumber: result.DLNumber,
        DLIssueDate: convertTime(result.DLIssueDate, true),
    }

    if (Session.get(_SESSION.isSuperadmin)) {
        data.schoolID = result.schoolID
        data.schoolName = result.school.name
    }
    return `<tr id="${data._id}">
                <th class="text-center">${result.index + 1}</th>
                <td>${data.name}</td>
                <td>${data.phone}</td>
                <td>${data.email}</td>
                <td>${data.address}</td>
                <td>${data.IDNumber}</td>
                <td>${data.IDIssueDate}</td>
                <td>${data.DLNumber}</td>
                <td>${data.DLIssueDate}</td>
                ${Session.get(_SESSION.isSuperadmin) ? `<td>${data.schoolName}</td>` : ''}
                <td class="text-center">
                    <button type="button" class="btn btn-outline-brand edit-button"
                        data-toggle="modal" data-target="#editDriverModal" data-json=\'${JSON.stringify(data)}\'>Sửa</button>
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
        $('#school-filter').select2({
            placeholder: "Chọn trường",
            width: "100%"
        })
    }).catch(handleError)
}

function driverFilter() {
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
    }, {
        text: "DLNumber",
        value: $('#dl-filter').val()
    }]
    console.log(options);
    reloadTable(1, getLimitDocPerPage(), options)
}

function refreshFilter() {
    $('#school-filter').val('')
    $('#name-filter').val('')
    $('#phone-filter').val('')
    $('#email-filter').val('')
    $('#cccd-filter').val('')
    $('#dl-filter').val('')

    reloadTable(1, getLimitDocPerPage(), null)
}

function initDatePicker() {
    let data = ["date-of-birth", "driver-IDIssueDate", "driver-DLIssueDate"]
    data.map((key) => {
        $(`#${key}`).datepicker({
            language: "vi",
            autoclose: true,
        })
    })
}
