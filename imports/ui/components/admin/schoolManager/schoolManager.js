import './schoolManager.html';

const Cookies = require('js-cookie');

import {
    MeteorCall,
    handleError,
    addRequiredInputLabel,
	addPaging,
	tablePaging
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
    addPaging();
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
                console.log(result);
                // console.log(data);
                $("#editSchoolModal").modal("hide");
                reloadTable(1, getLimitDocPerPage())
            }).catch(handleError)
        } else {
            data._id = modify;
            MeteorCall(_METHODS.school.Update, data, accessToken).then(result => {
                // console.log(result);
                $("#editSchoolModal").modal("hide");
                reloadTable(currentPage, getLimitDocPerPage())
            }).catch(handleError)
        }
    }

}

function ClickDeleteButton(e) {
    let data = $(e.currentTarget).data("json");
    // console.log(data._id)
    MeteorCall(_METHODS.school.Delete, data, accessToken).then(result => {
        // console.log(result);
        reloadTable(currentPage, getLimitDocPerPage());
    }).catch(handleError)
}

function checkInput() {
    let name = $("#name-input").val();
    let address = $("#address-input").val();
    if (!name || !address) {
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
}

function getLimitDocPerPage(){
	return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
	let table = $('#table-body');
    let emptyWrapper = $('#empty-data');
	table.html('');
	MeteorCall(_METHODS.school.GetByPage, {page: page, limit: limitDocPerPage}, accessToken).then(result => {
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
	let item = {
        _id: result._id,
        name: result.name,
        address: result.address
    }
    return `
                    <td>${item.name}</td>
                    <td>${item.address}</td>
                    <td>
                    <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(item)}\'>Sửa</button>
                    <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(item)}\'>Xóa</button>
                    </td>
                `
}
