import "./feedback.html";

const Cookies = require("js-cookie");

import {
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm,
    addPaging,
    getLimitDocPerPage,
    handlePaging,
    getJsonDefault
} from "../../../../functions";

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE,
    _SESSION,
    _URL_images,
    _FEEDBACK
} from "../../../../variableConst";

let accessToken;
let currentPage = 1;

Template.feedback.onCreated(() => {
    accessToken = Cookies.get("accessToken");
    Session.set('feedback', [])
});

Template.feedback.onRendered(() => {
    if (Session.get(_SESSION.isSuperadmin)) {
        initSchoolSelect2()
    }

    addPaging($('#feedbackTable'));
    reloadData(1, getLimitDocPerPage())
});

Template.feedback.onDestroyed(() => {
    Session.delete('feedback')
});

Template.feedback.events({

});

Template.feedback.helpers({
    feedback() {
        return Session.get('feedback')
    }
});

Template.feedbackRow.helpers({
    feedbackType() {
        return feedbackType = getJsonDefault(_FEEDBACK.type, 'number', this.type)
    },
    feedbackStatus() {
        return feedbackStatus = getJsonDefault(_FEEDBACK.status, 'number', this.status)
    },
    createdTime() {
        return moment(this.createdTime).format('l')
    },
});

Template.feedbackFilter.onRendered(() => {
    let options = [{
        id: "type-filter",
        value: "Chọn loại",
        search: "Infinity"
    }, {
        id: "status-filter", 
        value: "Chọn tình trạng",
        search: "Infinity"
    }, {
        id: "school-filter",
        value: "Chọn trường",
        search: ''
    }]

    options.map((key) => {
        $(`#${key.id}`).select2({
            placeholder: key.value,
            width: '100%',
            minimumResultsForSearch: key.search
        })
    })
})

Template.feedbackFilter.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    },
    schools() {
        return Session.get('schools')
    }
})

Template.feedbackFilter.events({
    'click #filter-button': feedbackFilter,
    'click #refresh-button': refreshFilter,
    'keypress .filter-input': (e) => {
        if (e.which === 13 || e.keyCode == 13) {
            feedbackFilter()
        }
    },
    'change #type-filter': (e) => {
        let options = [{
            text: "type",
            value: Number($('#type-filter').val())
        }]
        reloadData(1, getLimitDocPerPage(), options)
    },
    'change #status-filter': (e) => {
        let options = [{
            text: "status",
            value: Number($('#status-filter').val())
        }]
        reloadData(1, getLimitDocPerPage(), options)
    },
    'change #school-filter': (e) => {
        let options = [{
            text: "schoolID",
            value: $('#school-filter').val()
        }]
        reloadData(1, getLimitDocPerPage(), options)
    }
})

function initSchoolSelect2() {
    MeteorCall(_METHODS.school.GetAll, null, accessToken).then(result => {
        Session.set('schools', result.data)
        // $('#school-input').select2({
        //     width: '100%',
        //     placeholder: "Chọn trường"
        // })
    }).catch(handleError)
}


function reloadData(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE, options = null) {
    let table = $('#table-body');
    MeteorCall(_METHODS.feedback.GetByPage, {
        page: page,
        limit: limitDocPerPage,
        options
    }, accessToken).then(result => {
        console.log(result)
        handlePaging(table, result.count, page, limitDocPerPage)
        Session.set('feedback', result.data.map((key, index) => {
            key.index = index + (result.page - 1) * limitDocPerPage + 1;
            return key;
        }))
    })
}

function feedbackFilter() {
    let options = [{
        text: "user/name",
        value: $('#name-filter').val()
    }, {
        text: "type",
        value: $('#type-filter').val() ? Number($('#type-filter').val()) : ''
    }, {
        text: "status",
        value:$('#status-filter').val() ? Number($('#status-filter').val()) : ''
    }, {
        text: "title",
        value: $('#title-filter').val()
    }, {
        text: "schoolID",
        value: $('#school-filter').val()
    }]
    console.log(options);
    reloadData(1, getLimitDocPerPage(), options)
}

function refreshFilter() {
    $('#name-filter').val('')
    $('#title-filter').val('')
    $('#type-filter').val('').trigger('change')
    $('#status-filter').val('').trigger('change')
    $('#school-filter').val('').trigger('change')
    reloadData(1, getLimitDocPerPage(), null)
}