import './studentListInfo.html'

import {
    FlowRouter
} from 'meteor/kadira:flow-router';

const Cookies = require('js-cookie');

import {
    MeteorCall,
    handleError,
    handleConfirm,
    handleSuccess
} from '../../../../../functions';

import {
    _METHODS
} from '../../../../../variableConst';

let accessToken;

Template.studentListInfo.onCreated(() => {
    accessToken = Cookies.get('accessToken');
});

Template.studentListInfo.onRendered(() => {
    initClassSelect2()
    // reloadTable()
});

Template.studentListInfo.events({
    // 'click #addStudentListButton': clickAddStudentListButton,
})

function initClassSelect2() {
    MeteorCall(_METHODS.class.GetAll, null, accessToken).then(result => {
        console.log(result)
        if (result.data) {
            let htmlClassOption = result.data.map(item => `<option value="${item._id}">${item.name}</option>`)
            $('#classSelect').html(htmlClassOption.join('')).select2({
                width: '100%',
                placeholder: "Select class"
            }).on('select2:select', classChangeEvent).trigger('select2:select');
        }
    }).catch(handleError)
}

function classChangeEvent(e) {
    let classID = e.currentTarget.value
    console.log(classID)
    MeteorCall(_METHODS.student.getByClass, {
        _id: studentListID
    }, accessToken).then(result => {
        console.log(result)
    }).catch(handleError)
}

function reloadTable() {
    let studentListID = FlowRouter.getParam("id")
    console.log(studentListID)

    MeteorCall(_METHODS.studentList.GetById, {
        _id: studentListID
    }, accessToken).then(result => {
        console.log(result)
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