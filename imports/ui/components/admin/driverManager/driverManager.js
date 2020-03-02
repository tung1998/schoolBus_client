import './driverManager.html'

import {
    Session
} from 'meteor/session'

const Cookies = require('js-cookie')

import {
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm,
    getBase64,
    makeID

} from '../../../../functions'

import {
    _METHODS
} from '../../../../variableConst'

let accessToken;

Template.driverManager.onCreated(() => {
    accessToken = Cookies.get('accessToken')
});

Template.driverManager.onRendered(() => {
    reloadTable()
})

Template.driverManager.events({
    'click #add-button': () => {
        $('.modal-title').html("Thêm lái xe mới");
        $('.modal-footer').find('.btn.btn-primary').html("Thêm mới")
        clearForm()
    },
    'click #edit-button': clickEditButton,
    'click .submit-button': clickSubmitButton,
    'click .delete-button': clickDelButton,
})

function clickEditButton(event) {
    //fill data
    let data = $(event.currentTarget).data("json");
    $('#driver-name').val(data.name),
        $('#driver-phone').val(data.phone),
        $('#driver-email').val(data.email),
        $('#driver-address').val(data.address),
        $('#driver-IDNumber').val(data.IDNumber),
        $('#driver-IDIssueDate').val(data.IDIssueDate),
        $('#driver-IDIssueBy').val(data.IDIssueBy),
        $('#driver-DLNumber').val(data.DLNumber),
        $('#driver-DLIssueDate').val(data.DLIssueDate),
        $(".custom-file-label").html(data.image)

    $('#driver-id').val(data._id)
    //edit modal
    $('.modal-title').html(`Cập nhật thông tin lái xe: ${data.name}`);
    $('.modal-footer').find('.btn.btn-primary').html("Cập nhật")
}

async function clickSubmitButton() {
    try {
        let data = getInputData()
        if ($('#driver-image').val()) {
            let imageId = makeID("user")
            let BASE64 = await getBase64($('#driver-image')[0].files[0])
            console.log(imageId, BASE64)
            let importImage = await MeteorCall(_METHODS.image.Import, {
                imageId,
                BASE64: [BASE64]
            }, accessToken)
            if (importImage.error)
                handleError(result, "Không tải được ảnh lên server!")
            else data.image = imageId
        }
        if (!data._id) {
            await MeteorCall(_METHODS.driver.Create, data, accessToken)
            console.log("đã thêm mới");
            handleSuccess("Thêm", `tài xế ${data.name}`)
            $('#editDriverModal').modal("hide")
        } else {
            await MeteorCall(_METHODS.driver.Update, data, accessToken)
            handleSuccess("Cập nhật", `tài xế ${data.name}`)
            $('#editDriverModal').modal("hide")
            console.log("đã update");
        }
        reloadTable()
        clearForm()
    } catch (error) {
        handleError(error)
    }
}

function clickDelButton(event) {
    handleConfirm().then(result => {
        if (result.value) {
            let data = $(event.currentTarget).data("json");
            MeteorCall(_METHODS.driver.Delete, data, accessToken).then(result => {
                console.log(result);
                Swal.fire({
                    icon: "success",
                    text: "Đã xóa thành công",
                    timer: 3000
                })
                reloadTable()
            }).catch(handleError)
        }
    })
}

function getInputData() {
    let input = {
        username: $('#driver-phone').val(),
        password: '12345678',
        image: '',
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
        input._id = $('#driver-id').val()
    }
    return input
}

function clearForm() {
    $('#driver-name').val('')
    $('#driver-phone').val('')
    $('#driver-email').val('')
    $('#driver-address').val('')
    $('#driver-IDNumber').val('')
    $('#driver-IDIssueDate').val('')
    $('#driver-IDIssueBy').val('')
    $('#driver-DLNumber').val('')
    $('#driver-DLIssueDate').val('')
    $('#driver-id').val('')
    //reset image
    $('#driver-image').val('')


}

function reloadTable() {
    MeteorCall(_METHODS.driver.GetAll, null, accessToken).then(result => {
        let table = $('#table-driver')
        let dataDriver = result.data
        let row = dataDriver.map((key, index) => {
            let driver = {
                _id: key._id,
                image: key.user.image,
                name: key.user.name,
                phone: key.user.phone,
                email: key.user.email,
                address: key.address,
                IDNumber: key.IDNumber,
                IDIssueDate: key.IDIssueDate,
                IDIssueBy: key.IDIssueBy,
                DLNumber: key.DLNumber,
                DLIssueDate: key.DLIssueDate,
            }
            return `<tr id="${key._id}">
                        <th scope="row">${index + 1}</th>
                        <td>${driver.name}</td>
                        <td>${driver.phone}</td>
                        <td>${driver.email}</td>
                        <td>${driver.address}</td>
                        <td>${driver.IDNumber}</td>
                        <td>${driver.IDIssueDate}</td>
                        <td>${driver.DLNumber}</td>
                        <td>${driver.DLIssueDate}</td>
                        <td>
                            <button type="button" class="btn btn-outline-brand"
                                data-toggle="modal" id="edit-button" data-target="#editDriverModal" data-json=\'${JSON.stringify(driver)}\'>Sửa</button>
                            <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(driver)}\'>Xóa</button>
                        </td>
                    </tr>`
        })
        table.find("tbody").html(row.join(""))
    }).catch(handleError)
}