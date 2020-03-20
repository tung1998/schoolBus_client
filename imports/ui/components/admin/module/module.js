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
    addRequiredInputLabel,
    addPaging,
    handlePaging

} from '../../../../functions'

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE,
    _SESSION,
} from '../../../../variableConst'

let accessToken;
let currentPage = 1

Template.moduleManager.onCreated(() => {
    accessToken = Cookies.get('accessToken')
});

Template.moduleManager.onRendered(() => {
    Session.setDefault('module-parent-route', [])
    // Session.setDefault('module-route', [])
    MeteorCall(_METHODS.modules.GetIcons, {}, accessToken).then(result => {
        Session.set('icons', result);
    });

    addRequiredInputLabel();
    addPaging($('#moduleTable'));
    reloadTable();
});


Template.editModuleModal.onRendered(() => {
    editTitleForm()
    initSelect2()
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
    "click .kt-datatable__pager-link": (e) => {
        reloadTable(parseInt($(e.currentTarget).data('page')), getLimitDocPerPage());
        $(".kt-datatable__pager-link").removeClass("kt-datatable__pager-link--active");
        $(e.currentTarget).addClass("kt-datatable__pager-link--active")
        currentPage = parseInt($(e.currentTarget).data('page'));
    },
    "change #limit-doc": (e) => {
        reloadTable(1, getLimitDocPerPage());
    },
})

function submitButton(e) {
    let data = getInputData()
    if (checkInput()) {
        if (!data._id) {
            MeteorCall(_METHODS.modules.Create, data, accessToken).then(result => {
                handleSuccess("Thêm").then(() => {
                    $("#editModuleModal").modal("hide");
                    reloadTable(1, getLimitDocPerPage())
                    clearForm()
                })
            }).catch(handleError)
        } else {
            MeteorCall(_METHODS.modules.Update, data, accessToken).then(result => {
                handleSuccess("Cập nhât ").then(() => {
                    $("#editModuleModal").modal("hide");
                    reloadTable(1, getLimitDocPerPage())
                    clearForm()
                })
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
        } else {

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

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
    let table = $('#table-body');
    MeteorCall(_METHODS.modules.GetByPage, {
        page: page,
        limit: limitDocPerPage
    }, accessToken).then(result => {
        handlePaging(table, result.count, page, limitDocPerPage)
        createTable(table, result, limitDocPerPage)
    })

}

function createTable(table, result, limitDocPerPage) {
    let routes = []
    let parentRoutes = []
    let htmlRow = result.data.map((key, index) => {
        routes.push(key.route)
        if (key.level === 0) {
            parentRoutes.push(key.route)
        }
        key.index = index + (result.page - 1) * limitDocPerPage;
        return createRow(key);
    });
    table.html(htmlRow.join(''))
    // Session.set('module-route', routes)
    Session.set('module-parent-route', parentRoutes)
}


function createRow(result) {
    let data = {
        _id: result._id,
        name: result.name,
        description: result.description,
        route: result.route,
        permission: result.permission,
        createdTime: result.createdTime
    }
    return `<tr id="${data._id}">
        <th scope="row">${result.index + 1}</th>
        <td>${data.name}</td>
        <td>${data.description}</td>
        <td>${data.route}</td>
        <td>${data.permission}</td>
        <td>${moment(data.createdTime).format('L')}</td>
        <td>
            <button type="button" class="btn btn-outline-brand"
                data-toggle="modal" id="edit-module" data-target="#editModuleModal" data-json=\'${JSON.stringify(data)}\'>Sửa</button>
            <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(data)}\'>Xóa</button>
        </td>
    </tr>`

    
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