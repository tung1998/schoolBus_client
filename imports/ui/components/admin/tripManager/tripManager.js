import './tripManager.html'

import {
    MeteorCall,
    handleError,
    handleConfirm,
    getJsonDefault
} from '../../../../functions'

import {
    _METHODS,
    _URL_images,
    _TRIP
} from '../../../../variableConst'

let accessToken;

Template.tripManager.onCreated(() => {
    accessToken = Cookies.get('accessToken')
    Session.set('tripList', [])
})

Template.tripManager.onRendered(() => {
    initTimePicker()
    renderRouteSelect();
    reloadTable();
})

Template.tripManager.onDestroyed(() => {
    Session.delete('tripList')
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
        return moment(this.startTime).format("DD/MM/YYYY, HH:MM")
    },
    tripStatus() {
        return getJsonDefault(_TRIP.status, 'number', this.status)
    },
    isModifiable(){
        return this.status ==_TRIP.status.ready.number
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
        format: ' HH:ii dd-mm-yyyy'
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
    $("#start-time").val(moment(startTime).format("HH:mm DD/MM/YYYY"));
    $("#routeSelect").val(routeID).trigger('change');

    $('#editTripManagerModal').modal('show')
    $('#editTripManagerModal').attr("modify", tripID)
}

function ClickAddMoreButton(event) {
    $('#editTripManagerModal').attr("modify", "")
}

function SubmitForm(event) {
    event.preventDefault();
    let data = {
        startTime: moment($("#start-time").val(), "HH:mm DD/MM/YYYY").valueOf(),
        routeID: $("#routeSelect").val()
    }
    if (data.startTime < Date.now())
        handleConfirm("Thời gian bạn chọn đang nhỏ hơn thời điểm hiện tại. Tiếp tục?").then(result => {
            if (result.value) {
                let modify = $('#editTripManagerModal').attr("modify");
                if (modify == "") {
                    MeteorCall(_METHODS.trip.Create, data, accessToken).then(result => {
                        reloadTable();
                        $('#editTripManagerModal').modal('hide')
                    }).catch(handleError)
                } else {
                    data._id = modify;
                    MeteorCall(_METHODS.trip.Update, data, accessToken).then(result => {
                        reloadTable();
                        $('#editTripManagerModal').modal('hide')
                    }).catch(handleError)
                }
            }
        })
    else {
        let modify = $('#editTripManagerModal').attr("modify");
        if (modify == "") {
            MeteorCall(_METHODS.trip.Create, data, accessToken).then(result => {
                reloadTable();
                $('#editTripManagerModal').modal('hide')
            }).catch(handleError)
        } else {
            data._id = modify;
            MeteorCall(_METHODS.trip.Update, data, accessToken).then(result => {
                reloadTable();
                $('#editTripManagerModal').modal('hide')
            }).catch(handleError)
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