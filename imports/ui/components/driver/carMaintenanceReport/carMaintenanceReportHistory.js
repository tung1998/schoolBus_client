import './carMaintenanceReport.html';

const Cookies = require("js-cookie");

import {
    MeteorCall,
    handleError,
    addPaging,
    tablePaging,
} from "../../../../functions";

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE
} from "../../../../variableConst";

let accessToken;
let currentPage = 1;

Template.carMaintenanceReportHistory.onCreated(() => {

})

Template.carMaintenanceReportHistory.onRendered(() => {
    $(document).ready(() => {
        $(".kt-footer").hide();
        $(".historyTable").hide();
    })
    addPaging()
    tablePaging()
})

Template.carMaintenanceReportHistory.events({
    
})

function getLimitDocPerPage() {
    return 15;
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
    let table = $('#table-body');
    let emptyWrapper = $('#empty-data');
    table.html('');
    MeteorCall(_METHODS.driver.GetByPage, {
        page: page,
        limit: limitDocPerPage
    }, accessToken).then(result => {
        tablePaging(".tablePaging", result.count, page, limitDocPerPage)
        $("#paging-detail").html(`Hiển thị ${limitDocPerPage} bản ghi`)
        if (result.count === 0) {
            $('.tablePaging').addClass('d-none');
            table.parent().addClass('d-none');
            emptyWrapper.removeClass('d-none');
        } else if (result.count > limitDocPerPage) {
            $('.tablePaging').removeClass('d-none');
            table.parent().removeClass('d-none');
            emptyWrapper.addClass('d-none');
            // update số bản ghi
        } else {
            $('.tablePaging').addClass('d-none');
            table.parent().removeClass('d-none');
            emptyWrapper.addClass('d-none');
        }
        createTable(table, result, limitDocPerPage)
    })

}

function renderTable(data, page = 1) {
    let table = $('#table-body');
    let emptyWrapper = $('#empty-data');
    table.html('');
    tablePaging('.tablePaging', data.count, page);
    if (carStops.count === 0) {
        $('.tablePaging').addClass('d-none');
        table.parent().addClass('d-none');
        emptyWrapper.removeClass('d-none');
    } else {
        $('.tablePaging').addClass('d-none');
        table.parent().removeClass('d-none');
        emptyWrapper.addClass('d-none');
    }

    createTable(table, data);
}

function createTable(table, result, limitDocPerPage) {
    result.data.forEach((key, index) => {
        key.index = index + (result.page - 1) * limitDocPerPage;
        const row = createRow(key);
        table.append(row);
    });
}

function createRow(data) {
    const data_row = dataRow(data);
    // _id is tripID
    return `
        <tr id="${data._id}">
          ${data_row}
        </tr>
        `
}

function dataRow(result) {
    let driver = {
        _id: result._id,
        image: result.user.image,
        name: result.user.name,
        username: result.user.username,
        phone: result.user.phone,
        email: result.user.email,
        address: result.address,
        IDNumber: result.IDNumber,
        IDIssueDate: result.IDIssueDate,
        IDIssueBy: result.IDIssueBy,
        DLNumber: result.DLNumber,
        DLIssueDate: result.DLIssueDate,
    }
    return `
                <th scope="row">${result.index}</th>
                <td>${driver.name}</td>
                <td>${driver.phone}</td>
                <td>${driver.email}</td>
                <td>${driver.address}</td>
                <td>${driver.IDNumber}</td>
                <td>${driver.IDIssueDate}</td>
                <td>${driver.DLNumber}</td>
                <td>${driver.DLIssueDate}</td>
                <td>
                    <button type="button" class="btn btn-outline-brand dz-remove" data-dz-remove
                        data-toggle="modal" id="edit-button" data-target="#editDriverModal" data-json=\'${JSON.stringify(driver)}\'>Sửa</button>
                    <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(driver)}\'>Xóa</button>
                </td>
            `
}