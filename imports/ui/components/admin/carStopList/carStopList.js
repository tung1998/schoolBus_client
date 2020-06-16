import './carStopList.html';

const Cookies = require("js-cookie");

import {
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm,
    addRequiredInputLabel,
    addPaging,
    getBase64,
    makeID,
    initDropzone,
    handlePaging
} from "../../../../functions";

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE,
    _SESSION,
} from "../../../../variableConst";

let accessToken;
let currentPage = 1;

Template.carStopList.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.carStopList.onRendered(() => {
    addRequiredInputLabel();
    addPaging($('#carStopTable'));
    reloadTable();
    this.checkIsSuperAdmin = Tracker.autorun(() => {
        if (Session.get(_SESSION.isSuperadmin)) {
            initSchoolSelect2()
        }
    })
});

Template.carStopList.onDestroyed(() => {
    if (this.checkIsSuperAdmin) this.checkIsSuperAdmin = null
})

Template.carStopList.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    }
})

Template.carStopList.events({
    "click .modify-button": ClickModifyButton,
    "click .delete-button": ClickDeleteButton,
    "click .kt-datatable__pager-link": (e) => {
        reloadTable(parseInt($(e.currentTarget).data('page')), getLimitDocPerPage());
        $(".kt-datatable__pager-link").removeClass("kt-datatable__pager-link--active");
        $(e.currentTarget).addClass("kt-datatable__pager-link--active")
        currentPage = parseInt($(e.currentTarget).data('page'));
    },
    "change #limit-doc": (e) => {
        reloadTable(1, getLimitDocPerPage());
    },
});

Template.carStopListFilter.events({
    'click #filter-button': carStopListFilter,
    'click #refresh-button': refreshFilter,
    'keypress .filter-input': (e) => {
        if (e.which === 13 || e.keyCode == 13) {
            carStopListFilter()
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

Template.carStopListFilter.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    },
    schools() {
        return Session.get('schools')
    },
});


function ClickModifyButton(event) {
    let carStopData = $(event.currentTarget).data("json");
    console.log(carStopData)
    FlowRouter.go(`/carstop?carStopID=${carStopData._id}`)
}

function ClickDeleteButton(event) {
    handleConfirm().then(result => {
        if (result.value) {
            let data = $(event.currentTarget).data("json");
            MeteorCall(_METHODS.carStop.Delete, data, accessToken)
                .then(result => {
                    Swal.fire({
                        icon: "success",
                        text: "Đã xóa thành công",
                        timer: 3000
                    })
                    reloadTable(currentPage, getLimitDocPerPage())
                }).catch(handleError)
        } else {

        }
    })
}

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE, options = null) {
    let table = $('#table-body');
    MeteorCall(_METHODS.carStop.GetByPage, {
        page: page,
        limit: limitDocPerPage,
        options
    }, accessToken).then(result => {
        handlePaging(table, result.count, page, limitDocPerPage)
        createTable(table, result, limitDocPerPage)
    })

}

function createTable(table, result, limitDocPerPage) {
    let htmlRow = result.data.map((key, index) => {
        key.index = index + (result.page - 1) * limitDocPerPage;
        return createRow(key)
    });
    table.html(htmlRow.join(''))
}

function createRow(result) {
    let data = {
        _id: result._id,
        name: result.name,
        address: result.address,
        location: result.location
    }

    if (Session.get(_SESSION.isSuperadmin)) {
        data.schoolID = result.schoolID,
            data.schoolName = result.school.name
    }

    return ` <tr id = ${data._id}>
                <th>${result.index + 1}</th>
                <td>${data.name}</td>
                <td>${data.address}</td>
                ${Session.get(_SESSION.isSuperadmin) ? `<td>${data.schoolName}</td>` : ''}
                <td>
                    <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(
        data
    )}\'>Sửa</button>
                    <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(
        data
    )}\'>Xóa</button>
                </td>
            </tr>`;
}

function carStopListFilter() {
    let options = [{
        text: "name",
        value: $('#carStop-name-filter').val()
    }, {
        text: "address",
        value: $('#carStop-address-filter').val()
    }, {
        text: "schoolID",
        value: $('#school-filter').val()
    }]
    console.log(options);
    reloadTable(1, getLimitDocPerPage(), options)
}

function refreshFilter() {
    $('#carStop-name-filter').val('')
    $('#carStop-address-filter').val('')
    $('#school-filter').val('')
    reloadTable(1, getLimitDocPerPage(), null)
}

function initSchoolSelect2() {
    MeteorCall(_METHODS.school.GetAll, null, accessToken).then(result => {
        Session.set('schools', result.data)
        $('#school-input').select2({
            width: '100%',
            placeholder: "Chọn trường"
        })
        $('#school-filter').select2({
            width: '100%',
            placeholder: "Chọn trường"
        })
    }).catch(handleError)
}
