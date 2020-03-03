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
let studentIDs = [];

Template.studentListInfo.onCreated(() => {
    accessToken = Cookies.get('accessToken');
});

Template.studentListInfo.onRendered(() => {
    reloadTable().then(result => {
        initClassSelect2()
    })
});

Template.studentListInfo.onDestroyed(() => {
    studentIDs = null
});

Template.studentListInfo.events({
    'click input.student-checkbox': clickStudentCheckBox,
})

function initClassSelect2() {
    MeteorCall(_METHODS.class.GetAll, null, accessToken).then(result => {
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
    MeteorCall(_METHODS.student.GetByClass, {
        classID
    }, accessToken).then(result => {
        renderStudentTable($('#modalStudentTable'), result, true)
    }).catch(handleError)
}

function renderStudentTable(jqEl, data, type) {
    let htmlTable = data.map((item, index) => htmlRow(item, index, type))
    jqEl.html(htmlTable.join(''))
}

function reloadTable() {
    let studentListID = FlowRouter.getParam("id")
    return MeteorCall(_METHODS.studentList.GetById, {
        _id: studentListID
    }, accessToken).then(result => {
        console.log(result)
        studentIDs = result.studentIDs
        renderStudentTable($('#studentTable'), result.students)
        return result
    }).catch(handleError)
}

function htmlRow(data, index, type = false) {
    return ` <tr studentID="${data._id}">
                <th scope="row">${index}</th>
                <td>${data.IDStudent}</td>
                <td>${data.user.name}</td>
                <td>${data.class?data.class.name:""}</td>
                <td>${data.user.email}</td>
                <td>${data.user.phone}</td>
                
                ${type?`<td>
                            <div class="from-group">
                                <label class="kt-checkbox kt-checkbox--brand">
                                <input type="checkbox" class="student-checkbox" studentID="${data._id}" ${studentIDs.includes(data._id)?'checked':''}>
                                <span></span>
                                </label>
                            </div>
                        </td>`:''}
            </tr>`
}


//event
function clickStudentCheckBox(e) {
    let studentListID = FlowRouter.getParam("id")
    let studentID = e.currentTarget.getAttribute('studentID')
    if (e.currentTarget.checked) {
        MeteorCall(_METHODS.studentList.AddStudentIDs, {
            _id: studentListID,
            studentIDs: [studentID]
        }, accessToken).then(result => {
            handleSuccess('Thêm', 'học sinh')
            reloadTable()
        }).catch(handleError)
    } else {
        MeteorCall(_METHODS.studentList.RemoveStudentIDs, {
            _id: studentListID,
            studentIDs: [studentID]
        }, accessToken).then(result => {
            handleSuccess('Loại', 'học sinh')
            reloadTable()
        }).catch(handleError)
    }

}