import './tripSummary.html'

import {
    Session
} from 'meteor/session'

const Cookies = require('js-cookie')

import {
    MeteorCall,
    addPaging,
    handlePaging,
    convertTime,
    getJsonDefault,
    getLimitDocPerPage,
    handleError

} from '../../../../../functions'

import {
    COLLECTION_TASK
} from '../../../../../api/methods/task.js'

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE,
    _SESSION,
    _URL_images,
    _TRIP,
    TIME_DEFAULT
} from '../../../../../variableConst'

let accessToken;
let currentPage = 1;

Template.tripSummary.onCreated(() => {
    accessToken = Cookies.get('accessToken')
    Meteor.subscribe('task.byName', 'Trip')

    Session.set('schools', [])
});

Template.tripSummary.onRendered(() => {
    addPaging($('#trip-summary-table'));
    reloadTable()

    this.realTimeTracker = Tracker.autorun(() => {
        let task = COLLECTION_TASK.find({
            name: 'Trip'
        }).fetch()
        console.log(task);
        
        if (task.length && task[0].tasks.length) {
            let checkTime = Date.now() - TIME_DEFAULT.check_task
            if (task[0].updatedTime > checkTime)
                reloadTable(currentPage, getLimitDocPerPage())
        }
    });

    this.checkIsSuperAdmin = Tracker.autorun(() => {
        if (Session.get(_SESSION.isSuperadmin))
            initSchoolSelect2()
    })
})

Template.tripSummary.events({
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

Template.tripSummary.onDestroyed(() => {
    if (this.checkIsSuperAdmin) this.checkIsSuperAdmin.stop()
    if (this.realTimeTracker) this.realTimeTracker.stop()

    Session.delete('schools')
});

Template.tripSummary.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    }
})

Template.tripSummaryFilter.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    },
    schools() {
        return Session.get('schools')
    },
})

// Template.tripSummaryFilter.events({
//     'click #filter-button': tripSummaryFilter,
//     'click #refresh-button': refreshFilter,
//     'keypress .filter-input': (e) => {
//         if (e.which === 13 || e.keyCode == 13) {
//             driverFilter()
//         }
//     },
//     'change #school-filter': (e) => {
//         let options = [{
//             text: "schoolID",
//             value: $('#school-filter').val()
//         }]
//         reloadTable(1, getLimitDocPerPage(), options)
//     }
// })

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE, options) {
    let table = $('#table-body');
    MeteorCall(_METHODS.trip.GetByPage, {
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
    
    let statusData = getJsonDefault(_TRIP.status, 'number', result.status)
    let data = {
       _id: result._id,
       car: result.car.numberPlate,
       routeName: result.route.name,
       driverName: result.driver.user.name,
       nannyName: result.nanny.user.name,
       studentList: result.route.studentList.name,
       status: statusData.text,
       startTime: convertTime(result.startTime, true, "DD/MM/YYYY, HH:mm"),
       endTime: result.endTime ? convertTime(result.endTime, true, "DD/MM/YYYY, HH:mm"): 'Chưa kết thúc'
    }

    // if (Session.get(_SESSION.isSuperadmin)) {
    //     data.schoolID = result.schoolID
    //${Session.get(_SESSION.isSuperadmin) ? `<td>${data.schoolName}</td>` : ''}
    //     data.schoolName = result.school.name
    // }
    return `<tr id="${data._id}">
                <th class="text-center">${result.index + 1}</th>
                <td>${data.routeName}</td>
                <td>${data.car}</td>
                <td>${data.driverName}</td>
                <td>${data.nannyName}</td>
                <td>${data.studentList}</td>
                <td>
                    <span class="badge badge-${statusData.classname}">${data.status}</span>
                </td>
                <td>${data.startTime}</td>
                <td>${data.endTime}</td>
                
                
            </tr>
            `
}

function initSchoolSelect2() {
    MeteorCall(_METHODS.school.GetAll, null, accessToken).then(result => {
        Session.set('schools', result.data)
        $('#school-filter').select2({
            placeholder: "Chọn trường",
            width: "100%"
        })
    }).catch(handleError)
}

// function refreshFilter() {
   

//     reloadTable(1, getLimitDocPerPage(), null)
// }

// function tripSummaryFilter() {
//     let options = [{
//         text: "schoolID",
//         value: $('#school-filter').val()
//     }, {
//         text: "user/name",
//         value: $('#name-filter').val()
//     }, {
//         text: "user/phone",
//         value: $('#phone-filter').val()
//     }, {
//         text: "user/email",
//         value: $('#email-filter').val()
//     }, {
//         text: "IDNumber",
//         value: $('#cccd-filter').val()
//     }, {
//         text: "DLNumber",
//         value: $('#dl-filter').val()
//     }]
//     console.log(options);
//     reloadTable(1, getLimitDocPerPage(), options)
// }