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
    MeteorCall(_METHODS.modules.GetIcons, {}, accessToken).then(result => {
        Session.set('icons', result);
    });
    addRequiredInputLabel()
    initSelect2()
    initFilter()
    reloadData()
});

Template.moduleManager.onDestroyed(() => {
    $('.filter-input').unbind('change')
});

Template.editModuleModal.helpers({
    icons: function () {
        return Session.get('icons') ? JSON.parse(Session.get('icons')) : [];
    },

    modulesData: function () {
        return Session.get('modulesData')
    }

});

Template.moduleManager.events({
    'click .submit-button': submitButton,
    'click #add-module': clickAddModule,
    'click #edit-module': clickEditButton,
    'click .delete-button': clickDelButton,
})

function submitButton(e) {
    let data = getInputData()
    if (checkInput()) {
        if (!data._id) {
            MeteorCall(_METHODS.modules.Create, data, accessToken).then(result => {
                reloadData()
                clearForm()
                handleSuccess("Thêm", "module")
            }).catch(handleError)
        } else {
            MeteorCall(_METHODS.modules.Update, data, accessToken).then(result => {
                reloadData()
                clearForm()
                handleSuccess("Cập nhật", "module")
            }).catch(handleError)
        }
    }
}

function clickAddModule() {
    $('.modal-header').find('.modal-title').html("Thêm Module mới");
    $('.modal-footer').find('.btn.btn-primary').html("Thêm mới");
    clearForm()
}

function clickEditButton(event) {
    let data = $(event.currentTarget).data("json");
    $('.modal-header').find('.modal-title').html('Sửa Module');
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

function clickDelButton(event) {
    handleConfirm().then(result => {
        console.log(result);
        if (result.value) {
            let data = $(event.currentTarget).data("json");
            MeteorCall(_METHODS.modules.Delete, data, accessToken).then(result => {
                console.log(result);
                handleSuccess('Đã xóa')
                reloadData()
            }).catch(handleError)
        } else {}
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

function htmlRow(key, index) {
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
}

function reloadTable() {
    let modulesData = Session.get('modulesData')
    let moduleNameFilter = $('#module-name-filter').val()
    let moduleRouteFilter = $('#module-route-filter').val()
    let moduleParentRouteFilter = $('#module-parentRoute-filter').val()
    let modulePermissionFilter = $('#module-permission-filter').val()
    if (moduleNameFilter) modulesData = modulesData.filter(item => item.name.match(new RegExp(`${moduleNameFilter}`, 'i')))
    if (moduleRouteFilter) modulesData = modulesData.filter(item => item.route.match(new RegExp(`${moduleRouteFilter}`, 'i')))
    if (moduleParentRouteFilter) modulesData = modulesData.filter(item => item.parentRoute.match(new RegExp(`${moduleParentRouteFilter}`, 'i')))
    if (modulePermissionFilter != 'all') modulesData = modulesData.filter(item => item.permission == modulePermissionFilter)
    let htmlTable = modulesData.map(htmlRow)

    $("#table-body").html(htmlTable.join(""))
}

function reloadData() {
    MeteorCall(_METHODS.modules.GetAll, null, accessToken).then(result => {
        Session.set('modulesData', result.data)
        reloadTable()
    }).catch(handleError)
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

function initFilter() {
    let filterHtml = `
    <div class="form-group row">
        <label for="module-name" class="col-3 col-form-label">Tên Module</label>
        <div class="col-9">
            <input class="form-control filter-input" type="text" value="" id="module-name-filter" name="module-name"
                placeholder="Tên Module">
        </div>
    </div>
    <div class="form-group row">
        <label for="module-route" class="col-3 col-form-label">Đường dẫn</label>
        <div class="col-9">
            <input class="form-control filter-input" type="text" value="" id="module-route-filter"
                name="module-route" placeholder="Đường dẫn">
        </div>
    </div>
    <div class="form-group row">
        <label for="module-parent-route" class="col-3 col-form-label">Đường dẫn cha</label>
        <div class="col-9">
        <input class="form-control filter-input" type="text" value="" id="module-parentRoute-filter"
        name="module-description" placeholder="Mô Tả">
        </div>
    </div>
    <div class="form-group row">
        <label for="module-permission" class="col-3 col-form-label">Chọn quyền</label>
        <div class="col-9">
            <select id="module-permission-filter" class="form-control filter-input">
                <option value="all" selected>Tất cả</option>
                <option value="admin">Quản trị viên</option>
                <option value="driver">Lái xe</option>
                <option value="parent">Phụ huynh</option>
                <option value="teacher">Giáo viên</option>
            </select>
        </div>
    </div>`
    $('.kt-demo-panel__body').html(filterHtml)
    $('.filter-input').on('change', e => {
        reloadTable()
    })
}