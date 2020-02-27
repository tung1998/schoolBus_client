import './tripMannager.html'

import {
    MeteorCall,
    handleError
} from '../../../../functions'

import {
    _METHODS
} from '../../../../variableConst'

let accessToken;

Template.tripMannager.onCreated(() => {
    accessToken = Cookies.get('accessToken')
})

Template.tripMannager.onRendered(()=>{
    reloadTable();
    renderRouteSelect();
})

Template.tripMannager.events({
    'submit form': SubmitForm,
})

function renderRouteSelect(){
    $("#start-time").datetimepicker();
    MeteorCall(_METHODS.route.GetAll, null, accessToken).then(result => {
        let options = result.data.map(route => {
            return `<option value="${route._id}">${route.name}</option>`
        })
        $("#routeSelect").html(options.join(" "));
    }).catch(handleError)
}

function SubmitForm(event){
    event.preventDefault();
    // console.log(moment($("#start-time").val(), "YYYY/MM/DD HH:mm").valueOf());
    let data = {
        startTime: moment($("#start-time").val(), "YYYY/MM/DD HH:mm").valueOf(),
        routeID: $("#routeSelect").val()
    }
    MeteorCall(_METHODS.trip.Create, data, accessToken).then(result => {
        reloadTable();
        $('#editTripMannagerModal').modal('hide')
    }).catch(handleError)
}

function reloadTable(){
    MeteorCall(_METHODS.trip.GetAll, null, accessToken).then(result => {
        console.log(result);
        let html = result.data.map(htmlRow);
        $(".trip_list").html(html.join(" "));
    })
}

function htmlRow(data){
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
                                <i class="flaticon2-placeholder"></i>&nbsp;
                                <label for="route-name" class="form-control-label">Cung đường:</label>&nbsp;
                                <a href="#" id="route-name">${data.route.name}</a>
                            </div>
                            <div class="row">
                                <i class="flaticon2-calendar-9"></i>&nbsp;
                                <label for="time-start" class="form-control-label">Thời gian khởi hành:</label>&nbsp;
                                <a href="#" id="time-start">${moment(data.startTime).format("DD MMM YY, h:mm")}</a>
                            </div>
                            <div class="row">
                                <div class="col-12" style="padding-left: 0px;">
                                    <i class="flaticon2-calendar-9"></i>&nbsp;
                                    <label for="phonenumber" class="form-control-label">Liên hệ:</label>&nbsp;
                                    <a href="#" id="phonenumber">${data.route.driver.user.phone}</a>
                                    <a href="tripMannager/${data._id}"><button type="button" class="btn btn-success btn-sm fa-pull-right">Xem thông tin</button></a>
                                </div>    
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
}

