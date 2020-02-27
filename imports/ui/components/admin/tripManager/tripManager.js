import './tripManager.html'

import {
    MeteorCall,
    handleError
} from '../../../../functions'

import {
    _METHODS
} from '../../../../variableConst'

let accessToken;

Template.tripManager.onCreated(() => {
    accessToken = Cookies.get('accessToken')
})

Template.tripManager.onRendered(() => {
    reloadTable();
    renderRouteSelect();
})

Template.tripManager.events({
    'submit form': SubmitForm,
    'click .modify-button': ClickModifyButton,
    'click .add-more': ClickAddMoreButton
})

function renderRouteSelect() {
    $("#start-time").datetimepicker({});
    MeteorCall(_METHODS.route.GetAll, null, accessToken).then(result => {
        let options = result.data.map(route => {
            return `<option value="${route._id}">${route.name}</option>`
        })
        $("#routeSelect").html(options.join(" "));
    }).catch(handleError)
}

function ClickModifyButton(event) {
    let data = $(event.currentTarget).data("json")
    $("#start-time").val(moment(data.startTime).format("YYYY/MM/DD HH:mm"));
    // console.log(moment(data.startTime).format("MMMM DD YYYY, h:mm"))
    $("#routeSelect").val(data.route._id);

    $('#editTripManagerModal').modal('show')
    // console.log($("#routeSelect").val())
    $('#editTripManagerModal').attr("modify", data._id)
}

function ClickAddMoreButton(event) {
    $('#editTripManagerModal').attr("modify", "")
}

function SubmitForm(event) {
    event.preventDefault();
    // console.log(moment($("#start-time").val(), "YYYY/MM/DD HH:mm").valueOf());
    let data = {
        startTime: moment($("#start-time").val(), "YYYY/MM/DD HH:mm").valueOf(),
        routeID: $("#routeSelect").val()
    }
    let modify = $('#editTripManagerModal').attr("modify");
    if (modify == "") {
        MeteorCall(_METHODS.trip.Create, data, accessToken).then(result => {
            reloadTable();
            $('#editTripManagerModal').modal('hide')
        }).catch(handleError)
    } else {
        console.log(modify)
        console.log(data)
        data._id = modify;
        MeteorCall(_METHODS.trip.Update, data, accessToken).then(result => {
            
            reloadTable();
            $('#editTripManagerModal').modal('hide')
        })
    }

}

function reloadTable() {
    MeteorCall(_METHODS.trip.GetAll, null, accessToken).then(result => {
        console.log(result);
        let html = result.data.map(htmlRow);
        $(".trip_list").html(html.join(" "));
    })
}

function htmlRow(data) {
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
                                Tài xế: ${data.route.driver.user.name}
                                <i class="flaticon2-correct"></i>
                            </a>

                            <div class="kt-widget__action">
                                <span class="btn btn-label-brand btn-sm btn-bold btn-upper">Biển số: ${data.route.car.numberPlate}</span>
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
                                <a href="#" id="time-start">${moment(data.startTime).format("DD MMM YY, h:mm")}</a>
                            </div>
                            <div class="row">
                                <div class="col-12" style="padding-left: 0px;">
                                    <i class="flaticon2-phone"></i>&nbsp;
                                    <label for="phonenumber" class="form-control-label">Liên hệ:</label>&nbsp;
                                    <a href="#" id="phonenumber">${data.route.driver.user.phone}</a>
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

