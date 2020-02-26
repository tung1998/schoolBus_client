import './driverManager.html'
import './addDriver.js'

import {
    Session
} from 'meteor/session'

const Cookies = require('js-cookie')

import {
    MeteorCall,
    handleError,
    handleSuccess,
    handleDelete

} from '../../../../functions'

import {
    _METHODS
} from '../../../../variableConst'

let accessToken;

Template.driverManager.onCreated(() => {
    accessToken = Cookies.get('accessToken')
});

Template.driverManager.onRendered(() => {

    // reloadTable()
})

Template.driverManager.events({
    'click #add-button': () => {
        $('.modal-title').html("Thêm lái xe mới");
        $('.modal-footer').find('.btn.btn-primary').html("Thêm mới")
        clearForm()
    },
    'click .submit-button': submitButton,
    'click #delete-buton': submitDelButton, 
})

function submitButton() {
    let data = getInputData()

    data.username = data.phone
    data.password = "12345678"

    if (!data._id) {
        
    }
    else {

    }

}

function submitDelButton() {

}

function getInputData() {
    let input = {
        name: $('#driver-name').val(),
        phone: $('#driver-phone').val(),
        email: $('#driver-email').val(),
        address: $('#driver-address').val(),
        IDNumber: $('#driver-IDNumber').val(),
        IDIssueDate: $('#driver-IDIssueDate').val(),
        IDIssueBy: $('#driver-IDIssueBy').val(),
        DLNumber: $('#driver-DLNumber').val(),
        DLIssueDate: $('#driver-DLIssueDate').val(),
        status: 0
    }
    if ($('#driver-id').val()) {
        input._id = $('#module-id').val()
    }

    let image = $('#driver-image').val().replace("C:\\fakepath\\", "")
    input.image = image

    return input
}

function clearForm() {
    $('#driver-name').val(''),
    $('#driver-phone').val(''),
    $('#driver-email').val(''),
    $('#driver-address').val(''),
    $('#driver-IDNumber').val(''),
    $('#driver-IDIssueDate').val(''),
    $('#driver-IDIssueBy').val(''),
    $('#driver-DLNumber').val(''),
    $('#driver-DLIssueDate').val(''),
    //reset image
    $(".custom-file-label").html('')


}

function reloadTable() {
    // MeteorCall(_METHODS.drive.GetAll, null, accessToken).then(result => {
    //     let table = $('#table-module')
    //     dataModule = result.data;
    //     let row = dataModule.map((key, index) => {
    //         routes.push(key.route)
    //         if (key.level === 0) {
    //             parentRoutes.push(key.route)
    //         }

    //         return `<tr id="${key._id}">
    //                     <th scope="row">${index + 1}</th>
    //                     <td>${key.name}</td>
    //                     <td>${key.description}</td>
    //                     <td>${key.route}</td>
    //                     <td>${key.permission}</td>
    //                     <td>${key.createdTime}</td>
    //                     <td>
    //                         <button type="button" class="btn btn-outline-brand"
    //                             data-toggle="modal" id="edit-module" data-target="#editModuleModal" data-json=\'${JSON.stringify(key)}\'>Sửa</button>
    //                         <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(key)}\'>Xóa</button>
    //                     </td>
    //                 </tr>`
    //     })
    //     table.find("tbody").html(row.join(""))
    // }).catch(handleError)
}


