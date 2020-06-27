import './carMaintenanceReportHistory.html';

const Cookies = require("js-cookie");
import {
    Session
} from "meteor/session";

import {
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm,
    addRequiredInputLabel,
    addPaging,
    handlePaging,
    getLimitDocPerPage
} from "../../../../functions";

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE,
    _SESSION,
} from "../../../../variableConst";

let accessToken;
let currentPage = 1;

Template.carMaintenanceReportHistory.onCreated(() => {
    accessToken = Cookies.get('accessToken')
})

Template.carMaintenanceReportHistory.onRendered(() => {
    addPaging($('fuelTable'))
    addPaging($('maintenaceTable'))
    reloadTable()
    Session.set('cars', [])
    Session.set('species', true)

    this.checkCarData = Tracker.autorun(() => {
        getCars()
    })
})
Template.addFuelReportModal.onRendered(() => {
    $('#fuel-car-input').select2({
        width: '100%',
        placeholder: "Chọn xe",
        language: {
            noResults: function () {
                return "Không có dữ liệu";
            },
    
        }
    })
})
Template.addMaintenanceReportModal.onRendered(() => {
    $('#maintenance-car-input').select2({
        width: '100%',
        placeholder: "Chọn xe",
        language: {
            noResults: function () {
                return "Không có dữ liệu";
            }
        }
        
    })
    $('#maintenance-type-input').select2({
        width: '100%',
        placeholder: "Thể tích",
        minimumResultsForSearch: Infinity,
    })
})


Template.carMaintenanceReportHistory.helpers({
    
})

Template.carMaintenanceReportHistory.onDestroyed(() => {
    Session.delete('cars')
    Session.delete('species')
})

Template.carMaintenanceReportHistory.events({
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

Template.fuelManager.helpers({
    dataFuels(){
        return Session.get('dataFuel')
    }
})

Template.maintenanceManager.helpers({
    dataMaintenance() {
        return Session.get('dataMaintenance')
    }
})

function getCars(options = null, carID = null) {
    MeteorCall(_METHODS.trip.GetAll, {
        options
    }, accessToken).then(result => {
        Session.set('cars', result.data)
        if (carID) $("#student-carStopID").val(carStopID).trigger('change')
    }).catch(handleError)
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE, options = null) {
    let table = $('#table-body');
    MeteorCall(_METHODS.carFuel.GetByPage, {
        page: page,
        limit: limitDocPerPage,
        options
    }, accessToken).then(result => {
        handlePaging(table, result.count, page, limitDocPerPage)
        Session.set('dataFuel', result.data.map((key, index) => {
            key.index = index + (result.page - 1) * limitDocPerPage + 1;
            return key;
        }))
    })
    MeteorCall(_METHODS.carMaintenance.GetByPage, {
        page: page,
        limit: limitDocPerPage,
        options
    }, accessToken).then(result => {
        handlePaging(table, result.count, page, limitDocPerPage)
        Session.set('dataMaintenance', result.data.map((key, index) => {
            key.index = index + (result.page - 1) * limitDocPerPage + 1;
            return key;
        }))
    })
}

