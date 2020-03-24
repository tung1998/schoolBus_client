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
let historyType;

Template.carMaintenanceReportHistory.onCreated(() => {

})

Template.carMaintenanceReportHistory.onRendered(() => {
    addPaging()
    tablePaging()
    $(".history_type").click()
})

Template.carMaintenanceReport.events({
    'click .history_type': ClickHistoryType,
})

function ClickHistoryType(e) {
    e.preventDefault();
    let target = $(e.currentTarget);
    let target_id = target.attr("id");
    console.log(target_id);
    if (target_id == "fuel_history") {
        historyType = "fuel";
    } else {
        historyType = "maintenance";
    }
    reloadTable(1, getLimitDocPerPage())
}

function getLimitDocPerPage() {
    return 15;
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
    let table = $('#table-body');
    let emptyWrapper = $('#empty-data');
    table.html('');

    let method;
    if (historyType == "maintenance") {
        $(".carMaintenanceReportHistory_title").html("Lịch sử bảo dưỡng")
        $("#description").html("Nội dung")
        method = _METHODS.carMaintenance.GetByPage;
    } else if (historyType == "fuel") {
        $(".carMaintenanceReportHistory_title").html("Lịch sử đổ xăng")
        $("#description").html("Thể tích")
        method = _METHODS.carFuel.GetByPage;
    }

    MeteorCall(method, {
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
    console.log(result)
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
    if (historyType == "maintenance") {
        return `
                        <th scope="row">${result.index}</th>
                        <td>${moment(result.createdTime).format('L')}</td>
                        <td>${result.price}</td>
                        <td>${result.description}</td>
                    `
    } else if (historyType == "fuel") {
        return `
                        <th scope="row">${result.index}</th>
                        <td>${moment(result.createdTime).format('L')}</td>
                        <td>${result.price}</td>
                        <td>${result.volume}</td>
                    `
    }

}