import './module.html'
import {
    Session
} from 'meteor/session'

const Cookies = require('js-cookie')

import {
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm,
    addRequiredInputLabel

} from '../../../../functions'

import {
    _METHODS
} from '../../../../variableConst'

let accessToken;

Template.moduleManager.onCreated(() => {
    accessToken = Cookies.get('accessToken')
});

Template.moduleManager.onRendered(() => {
    Session.setDefault('module-parent-route', [])
    // Session.setDefault('module-route', [])

    MeteorCall(_METHODS.modules.GetIcons, null, accessToken).then(result => {
        Session.set('icons', result);
    });

    reloadTable()
    addRequiredInputLabel()
});


Template.editModuleModal.onRendered(() => {
    editTitleForm()
    initSelect2()
    console.log(Session.get('module-parent-route'));
})



Template.editModuleModal.helpers({
    icons: function () {
        return Session.get('icons') ? JSON.parse(Session.get('icons')) : [];
    },

    parentRoutes: function () {
        return Session.get('module-parent-route')
    }

});

Template.moduleManager.events({
    'click .submit-button': submitButton,
    'click #edit-module': clickEditButton,
    'click .delete-button': submitDelButton,
})

function submitButton(e) {
    let data = getInputData()
    if (checkInput()) {
        if (!data._id) {
            MeteorCall(_METHODS.modules.Create, data, accessToken).then(result => {
                console.log(result);
                reloadTable()
                clearForm()
                console.log("đã thêm mới");
                handleSuccess("Thêm", "module")
            }).catch(handleError)
        }
        else {
            MeteorCall(_METHODS.modules.Update, data, accessToken).then(result => {
                reloadTable()
                clearForm()
                handleSuccess("Cập nhật", "module")
                console.log("đã update");
            }).catch(handleError)
        }
    }

}

function clickEditButton(event) {
    let data = $(event.currentTarget).data("json");
    $('.modal-header').find('.modal-title').html('Sửa Module ' + `${data.name}`);
    $('.modal-footer').find('.btn.btn-primary').html("Sửa");
    //gán data
    $('#module-id').val(data._id)
    $('#module-name').val(data.name)
    $('#module-description').val(data.description)
    $('#module-route').val(data.route)
    $('#module-parent-route').val(data.parent).trigger('change')
    $('#module-icon').val(data.icon).trigger('change')
    $('#module-permission').val(data.permission).trigger('change')
}

function submitDelButton(event) {
    handleConfirm().then(result => {
        console.log(result);
        if (result.value) {
            let data = $(event.currentTarget).data("json");
            MeteorCall(_METHODS.modules.Delete, data, accessToken).then(result => {
                console.log(result);
                Swal.fire({
                    icon: "success",
                    text: "Đã xóa thành công",
                    timer: 3000
                })
                reloadTable()
            }).catch(handleError)
        }
        else {

        }
    })

}



function getInputData() {
    let input = {
        name: $('#module-name').val(),
        description: $('#module-description').val(),
        route: $('#module-route').val(),
        level: 0,
        parent: '',
        icon: $('#module-icon').val(),
        permission: $('#module-permission').val()
    };

    if ($('#module-parent-route').val()) {
        input.level = 1
        input.parent = $('#module-parent-route').val()
    };

    if ($('#module-id').val()) {
        input._id = $('#module-id').val()
    }

    return input;
}

function checkInput() {
    let name = $('#module-name').val()
    let description = $('#module-description').val()
    let route = $('#module-route').val()
    let parentRoute = $('#module-parent-route').val()
    let icon = $('#module-icon').val()
    let id = $('#module-id').val()
    let permission = $('#module-permission').val()

    if (!name || !route || !icon || !permission) {
        Swal.fire({
            icon: "error",
            text: "Chưa đủ thông tin!",
            timer: 3000
        })
        return false;
    } else {
        return true;
    }

}

function clearForm() {
    $('#module-name').val('')
    $('#module-description').val('')
    $('#module-route').val('')
    $('#module-parent-route').val('').trigger('change')
    $('#module-icon').val('').trigger('change')
    $('#module-id').val('')
    $('#module-permission').val('').trigger('change')
}

function insertRow(data, result) {
    data._id = result._id;


}

function reloadTable() {
    MeteorCall(_METHODS.modules.GetAll, null, accessToken).then(result => {
        let routes = []
        let parentRoutes = []
        let table = $('#table-module')
        dataModule = result.data;
        let row = dataModule.map((key, index) => {
            routes.push(key.route)
            if (key.level === 0) {
                parentRoutes.push(key.route)
            }

            return `<tr id="${key._id}">
                        <th scope="row">${index + 1}</th>
                        <td>${key.name}</td>
                        <td>${key.description}</td>
                        <td>${key.route}</td>
                        <td>${key.permission}</td>
                        <td>${key.createdTime}</td>
                        <td>
                            <button type="button" class="btn btn-outline-brand"
                                data-toggle="modal" id="edit-module" data-target="#editModuleModal" data-json=\'${JSON.stringify(key)}\'>Sửa</button>
                            <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(key)}\'>Xóa</button>
                        </td>
                    </tr>`
        })
        table.find("tbody").html(row.join(""))

        // Session.set('module-route', routes)
        Session.set('module-parent-route', parentRoutes)
    }).catch(handleError)
}


function editTitleForm() {
    let ktContent = $('.kt-section').find('.kt-section__content');
    ktContent.find('#add-module').click(() => {
        $('.modal-header').find('.modal-title').html("Thêm Module mới");
        $('.modal-footer').find('.btn.btn-primary').html("Thêm mới");
        clearForm()
    });

}

function initSelect2() {
    $('#module-parent-route').select2({
        placeholder: '-- Chọn đường dẫn cha (nếu có) --',
        width: '100%',
    });

    $("#module-icon").select2({
        placeholder: '-- Chọn icon --',
        width: '100%',
        templateSelection: formatText,
        templateResult: formatText
    });

    $("#module-permission").select2({
        placeholder: "-- Chọn quyền --",
        width: '100%',
    });
}

function formatText(icon) {
    return $('<span><i class="' + $(icon.element).data('icon') + '"></i> ' + icon.text + '</span>');
};
