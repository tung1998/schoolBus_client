import './route.html';

import {
    FlowRouter
} from 'meteor/kadira:flow-router';

import {
    MeteorCall,
    handleError,
    handleConfirm,
    handleSuccess
} from '../../../../functions';

import {
    _METHODS
} from '../../../../variableConst';

let accessToken

Template.route.onCreated(() => {
    accessToken = Cookies.get('accessToken');
});

Template.route.onRendered(() => {
    initSelect2();
    reloadTable();
});

Template.route.events({
    'click #addRouteButton': clickAddRouteButton,
    'click #routeModalSubmit': clickEditListModalSubmit,
    'click #routeData .modify-button': clickEditRouteButton,
    'click #routeData .delete-button': clickDeleteRouteButton,
    'click #routeData tr': clickRouteRow,
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
            $('#carSelect').html(htmlClassOption.join('')).select2({
                width: '100%',
                placeholder: "Select car"
            })
        }
    }).catch(handleError)
}

function initDriverSelect2() {
    MeteorCall(_METHODS.driver.GetAll, null, accessToken).then(result => {
        if (result.data) {
            let htmlClassOption = result.data.map(item => `<option value="${item._id}">${item.user.name}</option>`)
            $('#driverSelect').html(htmlClassOption.join('')).select2({
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
            $('#nannySelect').html(htmlClassOption.join('')).select2({
                width: '100%',
                placeholder: "Select nanny"
            })
        }
    }).catch(handleError)
}

function initStudentListSelect2() {
    MeteorCall(_METHODS.studentList.GetAll, null, accessToken).then(result => {
        if (result.data) {
            let htmlClassOption = result.data.map(item => `<option value="${item._id}">${item.name}</option>`)
            $('#studentListSelect').html(htmlClassOption.join('')).select2({
                width: '100%',
                placeholder: "Select student"
            })
        }
    }).catch(handleError)
}

function reloadTable() {
    MeteorCall(_METHODS.route.GetAll, {}, accessToken).then(result => {
        console.log(result);
        if (result.data) {
            let htmlTable = result.data.map(htmlRow);
            $("#routeData").html(htmlTable.join(" "));
        }
    }).catch(handleError)
}

function htmlRow(data) {
    let item = {
        _id: data._id,
        name: data.name,
        carName: data.car.numberPlate,
        driverName: data.driver.user.name,
        nannyName: data.nanny.user.name,
    }
    return ` <tr routeID=${item._id}>
                <td>${item.name}</td>
                <td>${item.carName}</td>
                <td>${item.driverName}</td>
                <td>${item.nannyName}</td>
                <td>
                <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(item)}\'>Sửa</button>
                <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(item)}\'>Xóa</button>
                </td>
            </tr>`
}

function clickAddRouteButton() {
    $('#routeModalSubmit').html('Thêm mới')
    $('#routeModal').removeAttr('routeID').modal('show')
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
                reloadTable()
                handleSuccess('Cập nhật', "Danh sách")
                $('#routeModal').modal('hide')
            }).catch(handleError)
        })
    } else {
        handleConfirm('Bạn muốn thêm mới danh sách?').then(result => {
            if (result.dismiss) return
            MeteorCall(_METHODS.route.Create, data, accessToken).then(result => {
                reloadTable()
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
            reloadTable()
            handleSuccess('Xóa', "Danh sách")
        }).catch(handleError)
    })
    return false
}


function clickRouteRow(e) {
    let routeID = e.currentTarget.getAttribute("routeID")
    FlowRouter.go(`/routeManager/${routeID}`)
}                                                              