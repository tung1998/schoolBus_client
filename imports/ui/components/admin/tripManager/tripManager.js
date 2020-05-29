import './tripManager.html'

import {
    MeteorCall,
    handleError,
    handleConfirm
} from '../../../../functions'

import {
    _METHODS
} from '../../../../variableConst'

let accessToken;

Template.tripManager.onCreated(() => {
    accessToken = Cookies.get('accessToken')
})

Template.tripManager.onRendered(() => {
    initTimePicker()
    renderRouteSelect();
    reloadTable();
})

Template.tripManager.events({
    'submit form': SubmitForm,
    'click .modify-button': ClickModifyButton,
    'click .add-more': ClickAddMoreButton,
    'click .updateTimeButton': ClickUpdateTimeButton
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
    let data = $(event.currentTarget).data("json")
    $("#start-time").val(moment(data.startTime).format("HH:mm DD/MM/YYYY"));
    // console.log(moment(data.startTime).format("MMMM DD YYYY, h:mm"))
    $("#routeSelect").val(data.route._id);

    $('#editTripManagerModal').modal('show')
    // console.log($("#routeSelect").val())
    $('#editTripManagerModal').attr("modify", data._id)
}

function ClickAddMoreButton(event) {
    console.log(moment($("#start-time").val(), "HH:mm DD/MM/YYYY").valueOf());
    $('#editTripManagerModal').attr("modify", "")
}

function SubmitForm(event) {
    event.preventDefault();
    // console.log(moment($("#start-time").val(), "YYYY/MM/DD HH:mm").valueOf());
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


function ClickUpdateTimeButton() {
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
    // console.log(moment(date).locale("vi").format("L"))
    // console.log(moment(startTime).locale("vi").format("LLLL"))
    // console.log(moment(endTime).locale("vi").format("LLLL"))
    return range;
}

function reloadTable() {
    let data = getDayFilter();
    MeteorCall(_METHODS.trip.GetByTime, data, accessToken).then(result => {
        console.log(result);
        if (result != []) {
            let html = result.map(htmlRow);
            $(".trip_list").html(html.join(" "));
        } else {
            $(".trip_list").html("<span>Không có dữ liệu</span>");
        }

    }).catch(handleError)
}

function htmlRow(data) {
    console.log(data)
    return `<div class="kt-widget kt-widget--user-profile-3" style="background: bisque;
            border-radius: 20px !important;
            padding: 11px; margin-bottom: 10px;">
                <div class="kt-widget__top">
                    <div class="kt-widget__media kt-hidden-">
                        <img src="./assets/media/users/100_1.jpg" alt="image">
                    </div>
                    <div
                        class="kt-widget__pic kt-widget__pic--danger kt-font-danger kt-font-boldest kt-font-light kt-hidden">
                        JM
                    </div>
                    <div class="kt-widget__content">
                        <div class="kt-widget__head">
                            <a href="#" class="kt-widget__username">
                                Tài xế: ${data.driver.user.name}
                                <i class="flaticon2-correct"></i>
                            </a>

                            <div class="kt-widget__action">
                                <span class="btn btn-label-brand btn-sm btn-bold btn-upper">Biển số: ${data.car ? data.car.numberPlate : ''}</span>
                                <span class="btn btn-label-brand btn-sm btn-bold btn-upper">ĐANG THỰC HIỆN</span>
                            </div>
                        </div>

                        <div class="kt-widget__subhead" style="font-size: 15px;">
                            <div class="row">
                                <i class="flaticon2-map"></i>&nbsp;
                                <label for="route-name" class="form-control-label">Cung đường:</label>&nbsp;
                                <a href="#" id="route-name">${data.route.name}</a>
                            </div>
                            <div class="row">
                                <i class="flaticon2-calendar-1"></i>&nbsp;
                                <label for="time-start" class="form-control-label">Thời gian khởi hành:</label>&nbsp;
                                <a href="#" id="time-start">${moment(data.startTime).format("DD/MM/YYYY, HH:MM")}</a>
                            </div>
                            <div class="row">
                                <div class="col-12" style="padding-left: 0px;">
                                    <i class="flaticon2-phone"></i>&nbsp;
                                    <label for="phonenumber" class="form-control-label">Liên hệ:</label>&nbsp;
                                    <a href="#" id="phonenumber">${data.driver.user.phone}</a>
                                    <div class="fa-pull-right">
                                        <button type="button" class="btn btn-danger btn-sm modify-button" data-json=\'${JSON.stringify(data)}\'>Sửa</button>
                                        <span></span>
                                        <a href="tripManager/${data._id}"><button type="button" class="btn btn-success btn-sm">Xem thông tin</button></a>
                                    </div>
                                    
                                </div>    
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
}