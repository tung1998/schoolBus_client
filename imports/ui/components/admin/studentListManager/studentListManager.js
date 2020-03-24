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
    handlePaging
} from '../../../../functions';

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE,
    _SESSION
} from '../../../../variableConst';

let accessToken;
let currentPage = 1;

Template.studentListManager.onCreated(() => {
    accessToken = Cookies.get('accessToken');
    Session.set(_SESSION.isSuperadmin, true)
    Session.set('schools', [])
});

Template.studentListManager.onRendered(() => {
    addRequiredInputLabel();
    addPaging($('studentListTable'));
    reloadTable();

    MeteorCall(_METHODS.user.IsSuperadmin, null, accessToken).then(result => {
        Session.set(_SESSION.isSuperadmin, result)
        if (result)
            initSchoolSelect2()
    }).catch(handleError)
});

Template.studentListManager.events({
    'click #addStudentListButton': clickAddStudentListButton,
    'click #studentListModalSubmit': clickEditListModalSubmit,
    'click #table-body .modify-button': clickEditStudentListButton,
    'click #table-body .delete-button': clickDeleteStudentListButton,
    'click #table-body tr': clickStudentListRow,
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

    if (Session.get(_SESSION.isSuperadmin)) {
        data.schoolID = $('#school-input').val()
    }

    let studentListID = $('#studentListModal').attr('studentListID')
    if (studentListID) {
        handleConfirm('Bạn muốn sửa danh sách?').then(result => {
            if (result.dismiss) return
            data._id = studentListID
            MeteorCall(_METHODS.studentList.Update, data, accessToken).then(result => {
                reloadTable(currentPage, getLimitDocPerPage())
                handleSuccess('Cập nhật')
                $('#studentListModal').modal('hide')
            }).catch(handleError)
        })
    } else {
        handleConfirm('Bạn muốn thêm mới danh sách?').then(result => {
            if (result.dismiss) return
            MeteorCall(_METHODS.studentList.Create, data, accessToken).then(result => {
                reloadTable(1, getLimitDocPerPage())
                $('#studentListModal').modal('hide')
                handleSuccess('Thêm mới')
            }).catch(handleError)
        })
    }
}

function clickEditStudentListButton(e) {
    e.preventDefault();
    let data = $(e.currentTarget).data('json')
    $('#studentList-name').val(data.name)

    if (Session.get(_SESSION.isSuperadmin)) {
        $('#school-input').val(data.schoolID).trigger('change')
    }


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

Template.studentListModal.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    },
    schools() {
        return Session.get('schools')
    },
});

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
    let table = $('#table-body');
    MeteorCall(_METHODS.studentList.GetByPage, {
        page: page,
        limit: limitDocPerPage
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
    table.html(htmlRow.join(''));
}

function createRow(result) {
    console.log(result)
    let data = {
        _id: result._id,
        name: result.name,
        schoolName: result.school?result.school.name:''
    }
    return `
        <tr id="${data._id}" class="table-row">
            <td>${result.index}</td>
            <td>${data.name}</td>
            <td>${data.schoolName}</td>
            <td>${moment(data.createdTime).format('l')}</td>
            <td>
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
            placeholder: 'Chọn trường'
        })
    }).catch(handleError)
}