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
    LIMIT_DOCUMENT_PAGE,
    _SESSION
} from '../../../../variableConst';

let accessToken;
let currentPage = 1;

Template.route.onCreated(() => {
    accessToken = Cookies.get('accessToken');
    Session.set('schools', [])
    Session.set('cars', [])
    Session.set('drivers', [])
    Session.set('nannys', [])
    Session.set('studentList', [])
});

Template.route.onRendered(() => {
    this.checkIsSuperAdmin = Tracker.autorun(() => {
        if (Session.get(_SESSION.isSuperadmin)) {
            initSchoolSelect2()
        } else {
            getSelectData()
        }
    })
    addRequiredInputLabel();
    addPaging($('#routeTable'));
    reloadTable(1);
    initSelect2()
});

Template.route.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    }
})

Template.route.onDestroyed(() => {
    if (this.checkIsSuperAdmin) this.checkIsSuperAdmin = null
})

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
    },
    'change #school-input': (e) => {
        if($('#school-input')) {
            let option = [{
                text: "schoolID",
                value: $('#school-input').val()
            }]
    
            getSelectData(option)
        }  
    }
})

Template.routeModal.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    },
    schools() {
        return Session.get('schools')
    },
    cars() {
        return Session.get('cars')
    },
    drivers() {
        return Session.get('drivers')
    },
    nannys() {
        return Session.get('nannys')
    },
    studentList() {
        return Session.get('studentList')
    },
})

Template.route.onDestroyed(() => {
    Session.delete('cars')
    Session.delete('drivers')
    Session.delete('nannys')
    Session.delete('studentList')
})

Template.routeFilter.onRendered(() => {
    $('#school-filter').select2({
        placeholder: "Chọn",
        width: "100%"
    })
})

Template.routeFilter.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    },
    schools() {
        return Session.get('schools')
    },
});

Template.routeFilter.events({
    'click #filter-button': routeFilter,
    'click #refresh-button': refreshFilter,
    'keypress .filter-input': (e) => {
        if (e.which === 13 || e.keyCode == 13) {
            routeFilter()
        }
    },
    'change #school-filter': (e) => {
        let options = [{
            text: "schoolID",
            value: $('#school-filter').val()
        }]
        reloadTable(1, getLimitDocPerPage(), options)
    }
})


function getSelectData(options = null, carID = null, driverID = null, nannyID = null, studentListID = null) {
    MeteorCall(_METHODS.car.GetAll, {
        options
    }, accessToken).then(result => {
        if (result.data) {
            if (options && options.length) result.data = result.data.filter(item => item.schoolID == options[0].value)
            Session.set('cars', result.data)
        }
        if (carID) $("#carSelect").val(carID).trigger('change')

    }).catch(handleError)

    MeteorCall(_METHODS.driver.GetAll, {
        options
    }, accessToken).then(result => {
        if (result.data) {
            if (options && options.length) result.data = result.data.filter(item => item.schoolID == options[0].value)
            Session.set('drivers', result.data)
        }
        if (driverID) $("#driverSelect").val(driverID).trigger('change')
    }).catch(handleError)

    MeteorCall(_METHODS.Nanny.GetAll, {
        extra: "user",
        options
    }, accessToken).then(result => {
        if (result.data) {
            if (options && options.length) result.data = result.data.filter(item => item.schoolID == options[0].value)
            Session.set('nannys', result.data)
        }
        if (nannyID) $("#nannySelect").val(nannyID).trigger('change')
    }).catch(handleError)

    MeteorCall(_METHODS.studentList.GetAll, {
        options
    }, accessToken).then(result => {
        console.log(result)
        if (result.data) {
            if (options && options.length) result.data = result.data.filter(item => item.schoolID == options[0].value)
            Session.set('studentList', result.data)
        }
        if (studentListID) $("#studentListSelect").val(studentListID).trigger('change')
    }).catch(handleError)

}

function clickAddRouteButton() {
    $('#routeModalSubmit').html('Thêm mới')
    $('#routeModal').removeAttr('routeID').modal('show')
    clearForm()

}

function clickEditListModalSubmit() {
    if(checkForm()) {
        let data = {
            name: $('#route-name').val(),
            carID: $('#carSelect').val(),
            driverID: $('#driverSelect').val(),
            nannyID: $('#nannySelect').val(),
            studentListID: $('#studentListSelect').val(),
        }
    
        if (Session.get(_SESSION.isSuperadmin)) data.schoolID = $('#school-input').val()
    
        let routeID = $('#routeModal').attr('routeID')
        if (routeID) {
            data._id = routeID
            MeteorCall(_METHODS.route.Update, data, accessToken).then(result => {
                reloadTable(currentPage, getLimitDocPerPage())
                handleSuccess('Cập nhật')
                $('#routeModal').modal('hide')
    
            })
        } else {
            MeteorCall(_METHODS.route.Create, data, accessToken).then(result => {
                reloadTable(1, getLimitDocPerPage())
                $('#routeModal').modal('hide')
                handleSuccess('Thêm mới')
            })
        }
    }
}

function clickEditRouteButton(e) {
    e.preventDefault();
    let data = $(e.currentTarget).data('json')
    console.log(data);
    $('#route-name').val(data.name)
    if (Session.get(_SESSION.isSuperadmin)) {
        $('#school-input').val(data.schoolID).trigger('change')
        getSelectData([{
            text: 'schoolID',
            value: data.schoolID
        }], data.carID, data.driverID, data.nannyID, data.studentListID)
    } else {
        $('#carSelect').val(data.carID).trigger('change')
        $('#driverSelect').val(data.carID).trigger('change')
        $('#nannySelect').val(data.carID).trigger('change')
        $('#studentListSelect').val(data.carID).trigger('change')
    }

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
    let routeID = e.currentTarget.getAttribute("id")
    FlowRouter.go(`/routeManager/${routeID}`)
    window.location.reload(false)
}

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE, options = null) {
    let table = $('#routeData');
    MeteorCall(_METHODS.route.GetByPage, {
        page: page,
        limit: limitDocPerPage,
        options
    }, accessToken).then(result => {
        console.log(result)
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
        carID: result.carID,
        carName: result.car ? result.car.numberPlate : '',
        driverID: result.driverID,
        driverName: result.driver ? result.driver.user.name : '',
        nannyID: result.nannyID,
        nannyName: result.nanny ? result.nanny.user.name : '',
        studentListID: result.studentListID,
        studentList: result.studentList ? result.studentList.name || '' : '',
    }
    if (Session.get(_SESSION.isSuperadmin)) {
        data.schoolID = result.schoolID
        data.schoolName = result.school.name
    }
    return ` <tr id="${data._id}">
                <th class="text-center">${result.index + 1}</th>
                ${Session.get(_SESSION.isSuperadmin) ? `<td>${data.schoolName}</td>` : ''}
                <td>${data.name}</td>
                <td>${data.carName}</td>
                <td>${data.driverName}</td>
                <td>${data.nannyName}</td>
                <td>${data.studentList}</td>
                <td class="text-center">
                <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(data)}\'>Sửa</button>
                <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(data)}\'>Xóa</button>
                </td>
            </tr>
            `
}


function routeFilter() {
    let options = [{
        text: "schoolID",
        value: $('#school-filter').val()
    }, {
        text: "name",
        value: $('#name-filter').val()
    }, {
        text: "car/numberPlate",
        value: $('#car-filter').val()
    }, {
        text: "driver/user/name",
        value: $('#driver-filter').val()
    }, {
        text: "nanny/user/name",
        value: $('#driver-filter').val()
    }, {
        text: "studentList/name",
        value: $('#studentList-filter').val()
    }]
    console.log(options);
    reloadTable(1, getLimitDocPerPage(), options)
}

function refreshFilter() {
    $('#school-filter').val('').trigger('change')
    $('#name-filter').val('')
    $('#car-filter').val('')
    $('#driver-filter').val('')
    $('#nanny-filter').val('')
    $('#studentList-filter').val('')

    reloadTable(1, getLimitDocPerPage(), null)
}

function initSchoolSelect2() {
    MeteorCall(_METHODS.school.GetAll, {}, accessToken).then(result => {
        Session.set('schools', result.data)
        $('#school-input').select2({
            placeholder: "Chọn trường",
            width: '100%'
        })
    }).catch(handleError)
}

function initSelect2() {
    let option = [{
        id: "carSelect",
        placeholder: "Chọn xe"
    }, {
        id: "driverSelect",
        placeholder: "Chọn lái xe"
    }, {
        id: "nannySelect",
        placeholder: "Chọn bảo mẫu"
    }, {
        id: "studentListSelect",
        placeholder: "Chọn danh sách"
    }]
    option.map(key => {
        $(`#${key.id}`).select2({
            placeholder: key.placeholder,
            width: '100%'
            // minimumResultsForSearch: option.search
        })
    })
}

function clearForm() {
    if (Session.get(_SESSION.isSuperadmin)) {
        $('#school-input').val('').trigger('change')
    }
}

function checkForm() {
    let name = $('#route-name').val()
    let carID = $('#carSelect').val()
    let driverID = $('#driverSelect').val()
    let nannyID = $('#nannySelect').val()
    let studentListID = $('#studentListSelect').val()

    if (!name || !carID || !driverID || !nannyID ||! studentListID) {
        Swal.fire({
            icon: "error",
            text: "Chưa đủ thông tin!",
            timer: 3000
        })
        return false;
    } else {
        if (Session.get(_SESSION.isSuperadmin)) {
            let schoolID = $('#school-input').val()
            if (!schoolID) {
                Swal.fire({
                    icon: "error",
                    text: "Chưa chọn trường!",
                    timer: 2000
                })
                return false;
            }

        }
        return true;
    }
}