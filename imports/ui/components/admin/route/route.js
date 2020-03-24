import './route.html';

import {
    FlowRouter
} from 'meteor/kadira:flow-router';

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
    LIMIT_DOCUMENT_PAGE
} from '../../../../variableConst';

let accessToken;
let currentPage = 1;

Template.route.onCreated(() => {
    accessToken = Cookies.get('accessToken');
});

Template.route.onRendered(() => {
    initSelect2();
    addRequiredInputLabel();
    addPaging($('#routeTable'));
    reloadTable(1);
});

Template.route.events({
    'click #addRouteButton': clickAddRouteButton,
    'click #routeModalSubmit': clickEditListModalSubmit,
    'click #routeData .modify-button': clickEditRouteButton,
    'click #routeData .delete-button': clickDeleteRouteButton,
    'click #routeData tr': clickRouteRow,
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

function initSelect2() {
    initCarSelect2()
    initDriverSelect2()
    initNannySelect2()
    initStudentListSelect2()
}

function initCarSelect2() {
    MeteorCall(_METHODS.car.GetAll, null, accessToken).then(result => {

        if (result.data) {
            let htmlClassOption = result.data.map(item => `<option value="${item._id}">${item.numberPlate}</option>`)
            $('#carSelect').html('<option></option>').append(htmlClassOption.join('')).select2({
                width: '100%',
                placeholder: "Select car"
            })
        }
    }).catch(handleError)
}

function initDriverSelect2() {
    MeteorCall(_METHODS.driver.GetAll, null, accessToken).then(result => {
        console.log(result);
        if (result.data) {
            let htmlClassOption = result.data.map(item => `<option value="${item._id}">${item.user.name}</option>`)
            $('#driverSelect').html('<option></option>').append(htmlClassOption.join('')).select2({
                width: '100%',
                placeholder: "Select driver"
            })
        }
    }).catch(handleError)
}

function initNannySelect2() {
    MeteorCall(_METHODS.Nanny.GetAll, {
        extra: "user"
    }, accessToken).then(result => {
        if (result.data) {
            let htmlClassOption = result.data.map(item => `<option value="${item._id}">${item.user.name}</option>`)
            $('#nannySelect').html('<option></option>').append(htmlClassOption.join('')).select2({
                width: '100%',
                placeholder: "Select nanny"
            })
        }
    }).catch(handleError)
}

function initStudentListSelect2() {
    MeteorCall(_METHODS.studentList.GetAll, {}, accessToken).then(result => {
        if (result.data) {
            let htmlClassOption = result.data.map(item => `<option value="${item._id}">${item.name}</option>`)
            $('#studentListSelect').html('<option></option>').append(htmlClassOption.join('')).select2({
                width: '100%',
                placeholder: "Select student"
            })
        }
    }).catch(handleError)
}

function clickAddRouteButton() {
    $('#routeModalSubmit').html('Thêm mới')
    $('#routeModal').removeAttr('routeID').modal('show')
    // clearForm()

}

function clickEditListModalSubmit() {
    let data = {
        name: $('#route-name').val(),
        carID: $('#carSelect').val(),
        driverID: $('#driverSelect').val(),
        nannyID: $('#nannySelect').val(),
        studentListID: $('#studentListSelect').val(),
    }
    console.log(data)
    if (!data.name) {
        handleError(null, 'Vui lòng điền tên chuyến đi')
        return
    }
    let routeID = $('#routeModal').attr('routeID')
    if (routeID) {
        handleConfirm('Bạn muốn sửa danh sách?').then(result => {
            if (result.dismiss) return
            data._id = routeID
            MeteorCall(_METHODS.route.Update, data, accessToken).then(result => {
                reloadTable(currentPage, getLimitDocPerPage())
                handleSuccess('Cập nhật', "Danh sách")
                $('#routeModal').modal('hide')
            }).catch(handleError)
        })
    } else {
        handleConfirm('Bạn muốn thêm mới danh sách?').then(result => {
            if (result.dismiss) return
            MeteorCall(_METHODS.route.Create, data, accessToken).then(result => {
                reloadTable(1, getLimitDocPerPage())
                $('#routeModal').modal('hide')
                handleSuccess('Thêm mới', "Danh sách")
            }).catch(handleError)
        })
    }
}

function clickEditRouteButton(e) {
    e.preventDefault();
    let data = $(e.currentTarget).data('json')
    $('#route-name').val(data.name)
    $('#routeModalSubmit').html('Cập nhật')
    $('#routeModal').attr('routeID', data._id).modal('show')
    return false
}

function clickDeleteRouteButton(e) {
    e.preventDefault();
    let routeID = $(e.currentTarget).data('json')._id
    handleConfirm('Bạn muốn xóa danh sách?').then(result => {
        if (result.dismiss) return
        MeteorCall(_METHODS.route.Delete, {
            _id: routeID
        }, accessToken).then(result => {
            reloadTable(currentPage, getLimitDocPerPage())
            handleSuccess('Xóa', "Danh sách")
        }).catch(handleError)
    })
    return false
}


function clickRouteRow(e) {
    let routeID = e.currentTarget.getAttribute("routeID")
    FlowRouter.go(`/routeManager/${routeID}`)
}

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
    let table = $('#table-body');
    MeteorCall(_METHODS.route.GetByPage, {
        page: page,
        limit: limitDocPerPage
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
    table.html(htmlRow.join(''))
}


function createRow(result) {
    console.log(result);
    let data = {
        _id: result._id,
        name: result.name,
        carName: result.car.numberPlate,
        driverName: result.driver.user.name,
        nannyName: result.nanny.user.name,
        studentList: result.studentList.name
    }
    return ` <tr id="${data._id}">
                <td>${result.index + 1}</td>
                <td>${data.name}</td>
                <td>${data.carName}</td>
                <td>${data.driverName}</td>
                <td>${data.nannyName}</td>
                <td>${data.studentList}</td>
                <td>
                <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(data)}\'>Sửa</button>
                <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(data)}\'>Xóa</button>
                </td>
            </tr>
            `
}