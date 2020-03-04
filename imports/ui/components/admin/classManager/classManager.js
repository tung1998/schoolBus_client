import "./classManager.html";

const Cookies = require("js-cookie");

import {
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm,
    addRequiredInputLabel,
    addPaging,
    tablePaging
} from "../../../../functions";

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE
} from "../../../../variableConst";

let accessToken;
let currentPage = 1;

Template.classManager.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.classManager.onRendered(() => {
    renderSchoolName();
    initSelect2();
    addPaging();
    reloadTable();
    addRequiredInputLabel();
});

Template.classManager.events({
    "submit form": SubmitForm,
    "click .modify-button": ClickModifyButton,
    "click .add-more": ClickAddmoreButton,
    "click .delete-button": ClickDeleteButton,
    "change #school-select": renderTeacherName,
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
            $("#school-select").append(optionSelects.join(" "));
        })
        .catch(handleError);
}

function renderTeacherName() {
    let data = {
        _id: $("#school-select").val()
    };
    MeteorCall(_METHODS.teacher.GetBySchoolID, data, accessToken)
        .then(result => {
            let optionSelects = result.map((key) => {
                return `<option value="${key._id}">${key.user.name}</option>`;
            });
            $("#teacher-select").html(`<option value=""></option>`).append(optionSelects.join(" "));
        })
        .catch(handleError);
}


function ClickModifyButton(event) {
    let classData = $(event.currentTarget).data("json");
    $("#editClassModal").attr("classID", classData._id);
    $(".modal-title").html("Chỉnh Sửa");
    $(".confirm-button").html("Sửa");

    $("input[name='className']").val(classData.name);
    $("#school-select").val(classData.schoolID).trigger('change')
    $("teacher-select").val(classData.teacherID).trigger('change')
    $('#select2-school-select-container').attr('title', classData.schoolName),
        $('#select2-teacher-select-container').attr('title', classData.teacherName)
    $("#editClassModal").modal("show");
}

function ClickAddmoreButton(event) {
    $("#editClassModal").attr("classID", "");
    $(".modal-title").html("Thêm Mới");
    $(".confirm-button").html("Thêm");
    $("#editClassModal").modal("show");
    clearForm();
}

function SubmitForm(event) {
    event.preventDefault();
    const target = event.target;
    if (checkInput()) {
        let data = {
            name: target.className.value,
            schoolID: $("#school-select").val(),
            teacherID: $("#teacher-select").val(),
            schoolName: $('#select2-school-select-container').attr('title'),
            teacherName: $('#select2-teacher-select-container').attr('title')
        };
        let modify = $("#editClassModal").attr("classID");
        if (modify == "") {

            MeteorCall(_METHODS.class.Create, data, accessToken)
                .then(result => {
                    reloadTable(1, getLimitDocPerPage())
                    handleSuccess("Thêm", "Lớp học").then(() => {
                        $("#editClassModal").modal("hide");
                    })
                })
                .catch(handleError);
        } else {
            data._id = modify;
            MeteorCall(_METHODS.class.Update, data, accessToken)
                .then(result => {
                    handleSuccess("Cập nhật", "Lớp học").then(() => {
                        $("#editClassModal").modal("hide");
                    })
                    reloadTable(currentPage, getLimitDocPerPage())
                })
                .catch(handleError);
        }
    }

}

function checkInput() {
    let name = $('#class-name').val();
    let schoolName = $('#select2-school-select-container').attr('title');
    let teacherName = $('#select2-teacher-select-container').attr('title')

    if (!name || !schoolName || !teacherName) {
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

function ClickDeleteButton(event) {
    handleConfirm().then(result => {
        if (result.value) {
            let data = $(event.currentTarget).data("json");
            MeteorCall(_METHODS.class.Delete, data, accessToken)
                .then(() => {
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
}

function clearForm() {
    $("input[name='className']").val("");
    $("#school-select").val('').trigger('change')
    $("#teacher-select").val('').trigger('change')
}

function initSelect2() {
    let initSelect2 = [{
        id: 'school-select',
        name: 'Chọn trường'
    },
    {
        id: 'teacher-select',
        name: 'Chọn giáo viên'
    }
    ]
    initSelect2.map((key) => {
        $(`#${key.id}`).select2({
            placeholder: key.name,
            width: '100%'
        })
    })
}

function getLimitDocPerPage(){
	return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
	let table = $('#table-body');
    let emptyWrapper = $('#empty-data');
	table.html('');
	MeteorCall(_METHODS.class.GetByPage, {page: page, limit: limitDocPerPage}, accessToken).then(result => {
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
        <tr id="${data._id}">
          ${data_row}
        </tr>
        `
}

function dataRow(result) {
	let data = {
        _id: result._id,
        schoolName: result.school.name,
        name: result.name,
        schoolID: result.schoolID,
        teacherID: result.teacherID,
        teacherName: result.teacher.user.name
    }
    return `
                <th scope="row"></th>
                <td>${data.schoolName}</td>
                <td>${data.name}</td>
                <td>${data.teacherName}</td>
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
