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
    tablePaging,
    getBase64,
    makeID,
    initDropzone

} from '../../../../functions'

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE
} from '../../../../variableConst'

let accessToken;
let currentPage = 1;

Template.driverManager.onCreated(() => {
    accessToken = Cookies.get('accessToken')
});

Template.driverManager.onRendered(() => {
    addPaging();
    reloadTable(1, getLimitDocPerPage())
    addRequiredInputLabel()
    initDropzone('#add-button', '#edit-button')
})

Template.driverManager.events({
    'click #add-button': () => {
        $('.modal-title').html("Thêm lái xe mới");
        $('.modal-footer').find('.btn.btn-primary').html("Thêm mới")
        clearForm()
    },
    'click #edit-button': clickEditButton,
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
    }
})

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
    $('div.dropzone-previews').find('div.dz-preview').find('div.dz-image').find('img').attr('src', `http://123.24.137.209:3000/images/${data.image}/0`)
    $('div.dropzone-previews').find('div.dz-image-preview').remove()
    $('div.dz-preview').show()
    $('.dropzone-msg-title').html("Kéo ảnh hoặc click để chọn ảnh.")
    $('#driver-id').val(data._id)
        //edit modal
    $('.modal-title').html(`Cập nhật thông tin lái xe: ${data.name}`);
    $('.modal-footer').find('.btn.btn-primary').html("Cập nhật")

}

async function clickSubmitButton() {
    try {
        if (checkInput()) {
            let data = getInputData()
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

            if (!data._id) {
                await MeteorCall(_METHODS.driver.Create, data, accessToken)
                console.log("đã thêm mới");
                handleSuccess("Thêm", `tài xế ${data.name}`).then(() => {
                    $('#editDriverModal').modal("hide")
                })

            } else {
                await MeteorCall(_METHODS.driver.Update, data, accessToken)
                handleSuccess("Cập nhật", `tài xế ${data.name}`).then(() => {
                    $('#editDriverModal').modal("hide")
                })
                console.log("đã update");
            }
            reloadTable(1, getLimitDocPerPage())
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
    let input = {
        username: $('#driver-phone').val(),
        password: '12345678',
        name: $('#driver-name').val(),
        phone: $('#driver-phone').val(),
        email: $('#driver-email').val(),
        address: $('#driver-address').val(),
        IDNumber: $('#driver-IDNumber').val(),
        IDIssueDate: $('#driver-IDIssueDate').val(),
        IDIssueBy: $('#driver-IDIssueBy').val(),
        DLNumber: $('#driver-DLNumber').val(),
        DLIssueDate: $('#driver-DLIssueDate').val(),
        status: 0
    }
    if ($('#driver-id').val()) {
        input._id = $('#driver-id').val()
    }
    return input
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
            text: "Làm ơn điền đầy đủ thông tin",
            timer: 2000
        })
        return false;
    } else {
        return true;
    }
}

function clearForm(e) {
    $('#driver-name').val('')
    $('#driver-phone').val('')
    $('#driver-email').val('')
    $('#driver-address').val('')
    $('#driver-IDNumber').val('')
    $('#driver-IDIssueDate').val('')
    $('#driver-IDIssueBy').val('')
    $('#driver-DLNumber').val('')
    $('#driver-DLIssueDate').val('')
    $('#driver-id').val('')
        // remove ảnh
    $('div.dropzone-previews').find('div.dz-preview').find('div.dz-image').find('img').attr('src', '')
}

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
    let table = $('#table-body');
    let emptyWrapper = $('#empty-data');
    table.html('');
    MeteorCall(_METHODS.driver.GetByPage, {
        page: page,
        limit: limitDocPerPage
    }, accessToken).then(result => {
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
        <tr id="${data._id}">
          ${data_row}
        </tr>
        `
}

function dataRow(result) {
    let driver = {
        _id: result._id,
        image: result.user.image,
        name: result.user.name,
        username: result.user.username,
        phone: result.user.phone,
        email: result.user.email,
        address: result.address,
        IDNumber: result.IDNumber,
        IDIssueDate: result.IDIssueDate,
        IDIssueBy: result.IDIssueBy,
        DLNumber: result.DLNumber,
        DLIssueDate: result.DLIssueDate,
    }
    return `
                <th scope="row">${result.index}</th>
                <td>${driver.name}</td>
                <td>${driver.phone}</td>
                <td>${driver.email}</td>
                <td>${driver.address}</td>
                <td>${driver.IDNumber}</td>
                <td>${driver.IDIssueDate}</td>
                <td>${driver.DLNumber}</td>
                <td>${driver.DLIssueDate}</td>
                <td>
                    <button type="button" class="btn btn-outline-brand dz-remove" data-dz-remove
                        data-toggle="modal" id="edit-button" data-target="#editDriverModal" data-json=\'${JSON.stringify(driver)}\'>Sửa</button>
                    <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(driver)}\'>Xóa</button>
                </td>
            `
}

// function initDropzone() {
//     Dropzone.autoDiscover = false;
//     let myDropzone = new Dropzone('#kt_dropzone_1', {
//         url: "#", // Set the url for your upload script location
//         paramName: "file", // The name that will be used to transfer the file
//         maxFiles: 1,
//         maxFilesize: 5, // MB
//         addRemoveLinks: true,
//         acceptedFiles: "image/*",
//         previewsContainer: '.dropzone-previews',
//         previewTemplate: $('.dropzone-previews').html(),
//         dictUploadCanceled: "",
//         dictRemoveFile: `<hr/><button type="button" class="btn btn-outline-hover-dark btn-icon btn-circle"><i class="fas fa-trash"></i></button>`,
//     })

//     myDropzone.on("complete", function (file) {
//         $('#add-button').on('click', function () {
//             myDropzone.removeFile(file);
//         });

//         $('.dropzone-msg-title').html("Đã chọn ảnh, xóa ảnh để chọn ảnh mới")

//         myDropzone.disable()

//     })

//     myDropzone.on('uploadprogress', function (file) {
//         $('.dropzone-previews').find('div:eq(0)').hide()
//     })

//     myDropzone.on("removedfile", function (file) {
//         myDropzone.enable()
//         $('.dropzone-previews').find('div:eq(0)').show()
//     })
// }