import './studentListManager.html'

const Cookies = require('js-cookie');

import {
    MeteorCall,
    handleError,
    handleConfirm
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
    'click #studentListModalSubmit': clickEditListModalSubmit,
})

function reloadTable() {
    MeteorCall(_METHODS.studentList.GetAll, null, accessToken).then(result => {
        console.log(result)
        let htmlTable = result.data.map(htmlRow);
        $("#table-body").html(htmlTable.join(" "));
    }).catch(handleError)
}

function htmlRow(data) {
    let item = {
        _id: data._id,
        name: data.name,
        address: data.address
    }
    return ` <tr id=${item._id}>
                <td>${item.name}</td>
                <td>${item.address}</td>
                <td>
                <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(item)}\'>Sửa</button>
                <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(item)}\'>Xóa</button>
                </td>
            </tr>`
}

function clickEditListModalSubmit() {
    let data = {
        name: $('#studentList-name').val()
    }
    console.log(data)
    let studentListID = $('#studentListModal').attr('studentListID')
    if (studentListID) {
        handleConfirm('Bạn muốn sửa danh sách?').then(()=>{
            console.log(studentListID)
        })
    } {
        handleConfirm('Bạn muốn thêm mới danh sách?').then(()=>{
            console.log(studentListID)
        })
    }
}