import './studentListManager.html'

import {
    FlowRouter
} from 'meteor/kadira:flow-router';

const Cookies = require('js-cookie');

import {
    MeteorCall,
    handleError,
    handleConfirm,
    handleSuccess
} from '../../../../functions';

import {
    _METHODS
} from '../../../../variableConst';

let accessToken;

Template.studentListManager.onCreated(() => {
    accessToken = Cookies.get('accessToken');
});

Template.studentListManager.onRendered(() => {
    reloadTable()
});

Template.studentListManager.events({
    'click #addStudentListButton': clickAddStudentListButton,
    'click #studentListModalSubmit': clickEditListModalSubmit,
    'click #studentListData .modify-button': clickEditStudentListButton,
    'click #studentListData .delete-button': clickDeleteStudentListButton,
    'click #studentListData tr': clickStudentListRow,
})

function reloadTable() {
    MeteorCall(_METHODS.studentList.GetAll, null, accessToken).then(result => {
        let htmlTable = result.data.map(htmlRow);
        $("#studentListData").html(htmlTable.join(" "));
    }).catch(handleError)
}

function htmlRow(data, index) {
    let item = {
        _id: data._id,
        name: data.name,
    }
    return ` <tr id=${item._id}>
                <td>${index}</td>
                <td>${item.name}</td>
                <td>${moment(item.createdTime).format('l')}</td>
                <td>
                <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(item)}\'>Sửa</button>
                <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(item)}\'>Xóa</button>
                </td>
            </tr>`
}

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
                reloadTable()
                handleSuccess('Cập nhật', "Danh sách")
                $('#studentListModal').modal('hide')
            }).catch(handleError)
        })
    } else {
        handleConfirm('Bạn muốn thêm mới danh sách?').then(result => {
            if (result.dismiss) return
            MeteorCall(_METHODS.studentList.Create, data, accessToken).then(result => {
                reloadTable()
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
            reloadTable()
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