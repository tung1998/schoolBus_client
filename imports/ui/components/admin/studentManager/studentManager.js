import "./studentManager.html";

import QRCode from 'qrcode';

import {
    Session
} from "meteor/session";

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
let currentPage = 1;

Template.studentManager.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.studentManager.onRendered(() => {
    renderSchoolName();
    renderCarStopID();
    initSelect2()
    addRequiredInputLabel();
    addPaging();
    getLimitDocPerPage();
    reloadTable();
    initDropzone('.add-more', '.modify-button')
});

Template.studentManager.events({
    "click .table-row": ClickTableRow,
    "click .modify-button": ClickModifyButton,
    "click .delete-button": ClickDeleteButton,
    "click .add-more": ClickAddMoreButton,
    "submit form": SubmitForm,
    "change #student-school": renderClassName,
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

function renderSchoolName() {
    MeteorCall(_METHODS.school.GetAll, {}, accessToken)
        .then(result => {
            let optionSelects = result.data.map((key) => {
                return `<option value="${key._id}">${key.name}</option>`;
            });
            $("#student-school").append(optionSelects.join(""));
        })
        .catch(handleError);
}

function renderClassName() {
    MeteorCall(_METHODS.class.GetAll, {}, accessToken)
        .then(result => {
            let optionSelects = result.data.map((key) => {
                if (key.schoolID === $('#student-school').val()) {
                    return `<option value="${key._id}">${key.name}</option>`;
                }
            });

            $("#student-class").html('<option></option>').append(optionSelects.join(" "));
        })
        .catch(handleError);
}

function renderCarStopID() {
    MeteorCall(_METHODS.carStop.GetAll, {}, accessToken).then(result => {
        let select = $('#student-carStopID')

        let optionSelects = result.data.map((key) => {
            return `<option value="${key._id}">${key.name}</option>`
        })
        select.append(optionSelects.join(""))
    })
}

function ClickTableRow(event) {
    let id = $(event.currentTarget).attr("id")
    QRCode.toDataURL(id)
        .then(url => {
            console.log(url)
            $("#QR-title").html(`QR code`)
            $("#QR-modal-body").html(`<img style="width: 60%" src=${url} alt="">`)
            $("#QRModal").modal("show");
        })
        .catch(err => {
            console.error(err)
        })
}

function ClickModifyButton(e) {
	let studentData = $(e.currentTarget).data("json");

	 console.log("click button")
	$("#editStudentModal").modal("show");
	$("#editStudentModal").attr("studentID", studentData._id);
	$(".modal-title").html("Chỉnh Sửa");
	$(".confirm-button").html("Sửa");

	$('input[name="IDstudent"]').val(studentData.IDStudent);
	$('input[name="address"]').val(studentData.address);
	$('input[name="name"]').val(studentData.name);
	$('input[name="email"]').val(studentData.email);
	$('input[name="phone"]').val(studentData.phone);
	$('input[name="phone"]').trigger('change');
	// $('#student-class').val(studentData.classID).trigger('change')
	$('#student-carStopID').val(studentData.carStopID).trigger('change')
	$('input[name="status"]').val(studentData.status);
	$('div.dropzone-previews').find('div.dz-preview').find('div.dz-image').find('img').attr('src', `http://123.24.137.209:3000/images/${studentData.image}/0`)
    $('div.dropzone-previews').find('div.dz-image-preview').remove()
    $('div.dz-preview').show()
    $('.dropzone-msg-title').html("Kéo ảnh hoặc click để chọn ảnh.")

    return false
}

function ClickAddMoreButton(e) {
    $("#editStudentModal").attr("studentID", "");
    $(".modal-title").html("Thêm Mới");
    $(".confirm-button").html("Thêm");
    clearForm();
}

function ClickDeleteButton(event) {
    handleConfirm().then(result => {
        console.log(result);
        if (result.value) {
            let data = $(event.currentTarget).data("json");
            MeteorCall(_METHODS.student.Delete, data, accessToken).then(result => {
                console.log(result);
                Swal.fire({
                    icon: "success",
                    text: "Đã xóa thành công",
                    timer: 3000
                })
                reloadTable(currentPage, getLimitDocPerPage())
            }).catch(handleError)
        } else {

        }
    })
    return false
}

async function SubmitForm(event) {
    try {
        event.preventDefault();
        if (checkInput()) {
            let data = {
                IDStudent: $('input[name="IDstudent"]').val(),
                address: $('input[name="address"]').val(),
                name: $('input[name="name"]').val(),
                email: $('input[name="email"]').val(),
                phone: $('input[name="phone"]').val(),
                status: $('input[name="status"]').val(),
                carStopID: $('#student-carStopID').val(),
                classID: $('#student-class').val(),
                schoolID: $('#student-school').val()
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
            let modify = $("#editStudentModal").attr("studentID");
            console.log(data);
            if (modify == "") {
                MeteorCall(_METHODS.student.Create, data, accessToken)
                    .then(result => {
                        handleSuccess("Thêm", "học sinh").then(() => {
                            $("#editStudentModal").modal("hide");
                            reloadTable(1, getLimitDocPerPage())
                        })

                    })
                    .catch(handleError);
            } else {
                data._id = modify;
                MeteorCall(_METHODS.student.Update, data, accessToken)
                    .then(result => {
                        handleSuccess("Cập nhật", "học sinh").then(() => {
                            $("#editStudentModal").modal("hide");
                            reloadTable(currentPage, getLimitDocPerPage())
                        })
                    })
                    .catch(handleError);
            }
        }
    } catch (error) {
        handleError(error)
    }


}

function checkInput() {
    let IDstudent = $('input[name="IDstudent"]').val();
    let name = $('input[name="name"]').val();
    let address = $('input[name="address"]').val();
    // let email = $('input[name="email"]').val();
    let phone = $('input[name="phone"]').val();
    let school = $('#student-school').val();
    let className = $('#student-class').val();
    let carStopID = $('#student-carStopID').val();
    let status = $('input[name="status"]').val();

    if (!IDstudent || !name || !address || !phone || !school || !className || !carStopID || !status) {
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
    $('input[name="IDstudent"]').val("");
    $('input[name="name"]').val("");
    $('input[name="address"]').val("");
    $('input[name="email"]').val("");
    $('input[name="phone"]').val("");
    $('#student-school').val("").trigger('change')
    $('#student-class').val("").trigger('change')
    $('#student-carStopID').val("").trigger('change')
    $('input[name="status"]').val("");
    // remove ảnh
    $('div.dropzone-previews').find('div.dz-preview').find('div.dz-image').find('img').attr('src', '')
}

function initSelect2() {
    let initSelect2 = [{
            id: 'student-school',
            name: 'Chọn trường'
        },
        {
            id: 'student-class',
            name: 'Chọn lớp'
        },
        {
            id: 'student-carStopID',
            name: 'Chọn điểm đón, trả'
        }
    ]
    initSelect2.map((key) => {
        $(`#${key.id}`).select2({
            placeholder: key.name,
            width: '100%'
        })
    })


}

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
    let table = $('#table-body');
    let emptyWrapper = $('#empty-data');
    table.html('');
    MeteorCall(_METHODS.student.GetByPage, { page: page, limit: limitDocPerPage }, accessToken).then(result => {
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

function dataRow(result) {
    let data = {
        _id: result._id,
        name: result.user.name,
        address: result.address,
        phone: result.user.phone,
        email: result.user.email,
        // schoolID: result.class.school._id,
        // schoolName: result.class.school.name,
        // classID: result.class._id,
        // className: result.class.name,
        IDStudent: result.IDStudent,
        carStopID: result.carStopID,
        carStop: result.carStop.name,
        status: result.status,
        image: result.imageId
    }
    return `
			<td>${result.index}</td>
            <td>${data.name}</td>
            <td>${data.address}</td>
            <td>${data.phone}</td>
            <td>${data.email}</td>
            <td>${data.schoolName}</td>
            <td>${data.className}</td>
            <td>${data.IDStudent}</td>
            <td>${data.carStop}</td>
            <td>
            <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(
		data
	)}\'>Sửa</button>
            <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(
		data
	)}\'>Xóa</button>
            </td>
    `;
}