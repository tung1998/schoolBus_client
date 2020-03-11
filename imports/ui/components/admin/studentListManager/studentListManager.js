import './studentListManager.html'

import {
    FlowRouter
} from 'meteor/kadira:flow-router';

const Cookies = require('js-cookie');

import {
    MeteorCall,
    handleError,
    handleConfirm,
    handleSuccess,
    addRequiredInputLabel,
    addPaging,
    tablePaging,
} from '../../../../functions';

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE
} from '../../../../variableConst';

let accessToken;
let currentPage = 1;

Template.studentListManager.onCreated(() => {
    accessToken = Cookies.get('accessToken');
});

Template.studentListManager.onRendered(() => {
    addRequiredInputLabel();
    addPaging();
    reloadTable(1);
});

Template.studentListManager.events({
    'click #addStudentListButton': clickAddStudentListButton,
    'click #studentListModalSubmit': clickEditListModalSubmit,
    'click #studentListData .modify-button': clickEditStudentListButton,
    'click #studentListData .delete-button': clickDeleteStudentListButton,
    'click #studentListData tr': clickStudentListRow,
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

function clickAddStudentListButton() {
    $('#studentListModalSubmit').html('Thêm mới')
    $('#studentListModal').removeAttr('studentListID').modal('show')
}

function clickEditListModalSubmit() {
    let data = {
        name: $('#studentList-name').val()
    }
    if (!data.name) {
        handleError(null, 'Vui lòng điền đầy đủ thông tin')
        return
    }
    let studentListID = $('#studentListModal').attr('studentListID')
    if (studentListID) {
        handleConfirm('Bạn muốn sửa danh sách?').then(result => {
            if (result.dismiss) return
            data._id = studentListID
            MeteorCall(_METHODS.studentList.Update, data, accessToken).then(result => {
                reloadTable(currentPage, getLimitDocPerPage())
                handleSuccess('Cập nhật', "Danh sách")
                $('#studentListModal').modal('hide')
            }).catch(handleError)
        })
    } else {
        handleConfirm('Bạn muốn thêm mới danh sách?').then(result => {
            if (result.dismiss) return
            MeteorCall(_METHODS.studentList.Create, data, accessToken).then(result => {
                reloadTable(1, getLimitDocPerPage())
                $('#studentListModal').modal('hide')
                handleSuccess('Thêm mới', "Danh sách")
            }).catch(handleError)
        })
    }
}

function clickEditStudentListButton(e) {
    e.preventDefault();
    let data = $(e.currentTarget).data('json')
    $('#studentList-name').val(data.name)
    $('#studentListModalSubmit').html('Cập nhật')
    $('#studentListModal').attr('studentListID', data._id).modal('show')
    return false
}

function clickDeleteStudentListButton(e) {
    e.preventDefault();
    let studentListID = $(e.currentTarget).data('json')._id
    handleConfirm('Bạn muốn xóa danh sách?').then(result => {
        if (result.dismiss) return
        MeteorCall(_METHODS.studentList.Delete, {
            _id: studentListID
        }, accessToken).then(result => {
            reloadTable(currentPage, getLimitDocPerPage)
            handleSuccess('Xóa', "Danh sách")
        }).catch(handleError)
    })
    return false
}

function clickStudentListRow(e) {
    // e.preventDefault();
    let studentListID = $(e.currentTarget).attr('id')
    FlowRouter.go(`/studentlistManager/${studentListID}`)
}

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
    let table = $('#studentListData');
    let emptyWrapper = $('#empty-data');
    table.html('');
    MeteorCall(_METHODS.studentList.GetByPage, { page: page, limit: limitDocPerPage }, accessToken).then(result => {
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
    let table = $('#studentListData');
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
        name: data.name,
    }
    return `
                <td>${data.index}</td>
                <td>${item.name}</td>
                <td>${moment(item.createdTime).format('l')}</td>
                <td>
                <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(item)}\'>Sửa</button>
                <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(item)}\'>Xóa</button>
                </td>`
}