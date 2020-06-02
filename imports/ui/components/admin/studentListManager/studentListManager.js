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
    console.log(accessToken)
    Session.set('schools', [])
});

Template.studentListManager.onRendered(() => {
    addRequiredInputLabel();
    addPaging($('#studentListTable'));
    reloadTable();
    this.checkIsSuperAdmin = Tracker.autorun(() => {
        if (Session.get(_SESSION.isSuperadmin))
            initSchoolSelect2()
    })
});

Template.studentListManager.onDestroyed(() => {
    if (this.checkIsSuperAdmin) this.checkIsSuperAdmin = null
})

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

Template.studentListFilter.onRendered(() => {
    $('#school-filter').select2({
        placeholder: "Chọn trường",
        width: "100%"
    })
})

Template.studentListFilter.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    },
    schools() {
        return Session.get('schools')
    },
});

Template.studentListFilter.events({
    'click #filter-button': studentListFilter,
    'click #refresh-button': refreshFilter,
    'keypress .filter-input': (e) => {
        if (e.which === 13 || e.keyCode == 13) {
            studentListFilter()
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
            reloadTable(currentPage, getLimitDocPerPage())
            handleSuccess('Xóa', "Danh sách")
        }).catch(handleError)
    })
    return false
}

function clickStudentListRow(e) {
    // e.preventDefault();
    let studentListID = $(e.currentTarget).attr('id')
    FlowRouter.go(`/studentlistManager/${studentListID}`)
    // window.location.reload(false)
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

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE, options = null) {
    let table = $('#studentListData');
    MeteorCall(_METHODS.studentList.GetByPage, {
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
    table.html(htmlRow.join(''));
}

function createRow(result) {
    let data = {
        _id: result._id,
        name: result.name,
        schoolName: result.school ? result.school.name : '',
        createdTime: result.createdTime
    }
    return `
        <tr id="${data._id}" class="table-row">
            <td>${result.index + 1}</td>
            <td>${data.name}</td>
            <td>${data.schoolName}</td>
            <td>${moment(data.createdTime).format('L')}</td>
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

function studentListFilter() {
    let options = [{
        text: "schoolID",
        value: $('#school-filter').val()
    }, {
        text: "name",
        value: $('#name-filter').val()
    }]
    console.log(options);
    reloadTable(1, getLimitDocPerPage(), options)
}

function refreshFilter() {
    $('#school-filter').val('').trigger('change')
    $('#name-filter').val('')

    reloadTable(1, getLimitDocPerPage(), null)
}