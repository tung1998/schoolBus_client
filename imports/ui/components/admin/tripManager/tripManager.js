import './tripManager.html'

import {
    MeteorCall,
    handleError,
    handleConfirm,
    getJsonDefault,
    getSendNotiUserIDs
} from '../../../../functions'

import {
    _METHODS,
    _URL_images,
    _TRIP,
    TIME_DEFAULT
} from '../../../../variableConst'

import {
    COLLECTION_TASK
} from '../../../../api/methods/task.js'

let accessToken;

Template.tripManager.onCreated(() => {
    accessToken = Cookies.get('accessToken')
    Session.set('routeList', [])
    Meteor.subscribe('task.byName', 'Trip');
    Session.set('tripList', [])
})

Template.tripManager.onRendered(() => {
    initTimePicker()
    renderRouteSelect();
    reloadTable();
    this.realTimeTracker = Tracker.autorun(() => {
        let task = COLLECTION_TASK.find({
            name: 'Trip'
        }).fetch()
        if (task.length && task[0].tasks.length && task[0].updatedTime > Date.now() - TIME_DEFAULT.check_task) {
            reloadTable()
        }
    });
})

Template.tripManager.onDestroyed(() => {
    Session.delete('tripList')
    if (this.realTimeTracker) this.realTimeTracker.stop()
    Session.delete('routeList')
})

Template.tripManager.helpers({
    tripList() {
        return Session.get('tripList')
    },
    hasData() {
        return Session.get('tripList').length
    },
})

Template.tripHtml.helpers({
    _URL_images() {
        return _URL_images
    },
    startTime() {
        return moment(this.startTime).format("DD/MM/YYYY, HH:mm")
    },
    tripStatus() {
        return getJsonDefault(_TRIP.status, 'number', this.status)
    },
    isModifiable() {
        return this.status == _TRIP.status.ready.number
    }
})

Template.tripManager.events({
    'submit form': SubmitForm,
    'click .modify-button': ClickModifyButton,
    'click .add-more': ClickAddMoreButton,
    'change #select_date': getTripByDate
})

function initTimePicker() {
    $("#start-time").datetimepicker({
        language: 'vi',
        autoclose: true,
        // dateFormat: 'DD/MM/YYYY',
        format: 'dd/mm/yyyy, hh:ii'
    });
    $("#select_date").datepicker({
        language: 'vi',
        autoclose: true,
        dateFormat: 'DD/MM/YYYY',
    });
    $("#select_date").val(moment(Date.now()).format("DD/MM/YYYY"))
}

function renderRouteSelect() {
    MeteorCall(_METHODS.route.GetAll, null, accessToken).then(result => {
        Session.set('routeList', result.data)
        let options = result.data.map(route => {
            return `<option value="${route._id}">${route.name}</option>`
        })
        $("#routeSelect").html('<option value""></option>').append(options.join(" "));
        $("#routeSelect").select2({
            width: "100%",
            placeholder: "Chọn cung đường"
        })
    }).catch(handleError)
}

function ClickModifyButton(event) {
    let startTime = $(event.currentTarget).attr('startTime')
    let routeID = $(event.currentTarget).attr('routeID')
    let tripID = $(event.currentTarget).attr('tripID')
    $("#start-time").val(startTime);
    $("#routeSelect").val(routeID).trigger('change');

    $('#editTripManagerModal').modal('show')
    $('#editTripManagerModal').attr("modify", tripID)
}

function ClickAddMoreButton(event) {
    $('#editTripManagerModal').attr("modify", "")
}

async function SubmitForm(event) {
    event.preventDefault();
    let data = {
        startTime: moment($("#start-time").val(), "DD/MM/YYYY, HH:mm").valueOf(),
        routeID: $("#routeSelect").val()
    }
    if (data.startTime < Date.now())
        handleError(null, "Thời gian bạn chọn đang nhỏ hơn thời điểm hiện tại!")
    else {
        let modify = $('#editTripManagerModal').attr("modify");
        try {
            let newTrip
            if (modify == "") {
                newTrip = await MeteorCall(_METHODS.trip.Create, data, accessToken)
            } else {
                data._id = modify;
                newTrip = await MeteorCall(_METHODS.trip.Update, data, accessToken)
            }
            let routeData = Session.get('routeList').filter(item => item._id === data.routeID)[0]
            let notifySendUserIDs = getSendNotiUserIDs(routeData)
            if (notifySendUserIDs.length)
                MeteorCall('notification.sendFCMToMultiUser', {
                    userIds: notifySendUserIDs,
                    title: "Chuyến đi",
                    text: "Chuyến đi được tạo mới",
                    tripID: newTrip._id
                }, accessToken)
            reloadTable();
            $('#editTripManagerModal').modal('hide')
        } catch (e) {
            handleError(e)
        }
    }
}


function getTripByDate() {
    reloadTable();
}

function getDayFilter() {
    let date = moment($("#select_date").val(), "DD/MM/YYYY").valueOf();
    let startTime = date
    let endTime = startTime + 86400000;
    let range = {
        startTime: startTime,
        endTime: endTime
    }
    return range;
}

function reloadTable() {
    MeteorCall(_METHODS.trip.GetByTime, getDayFilter(), accessToken).then(result => {
        if (result.length) {
            Session.set('tripList', result)
        } else {
            Session.set('tripList', [])
        }

    }).catch(handleError)
}