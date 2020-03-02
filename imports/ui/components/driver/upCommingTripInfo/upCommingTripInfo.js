import './upCommingTripInfo.html';

import {
    MeteorCall,
    handleError
} from '../../../../functions'

import {
    _METHODS
} from '../../../../variableConst'

let accessToken;

Template.upCommingTripInfo.onCreated(() => {
    accessToken = Cookies.get('accessToken')
})

Template.upCommingTripInfo.onRendered(() => {
    $(document).ready(() => {
        $(".kt-footer").hide();
        $("#map").show();
        $(".student-info").show();
        $(".student-list").hide();
        $("#studentListShowButton").html("Xem danh sách học sinh");
        setMapHeight();
    })

    renderMap();

})

Template.upCommingTripInfo.events({
    'click .leaflet-marker-icon': ClickStudentLocation,
    'click #studentListShowButton': ClickStudentListShowButton
})

function ClickStudentListShowButton(event) {
    if ($("#map").is(":hidden")) {
        $("#map").show();
        $(".student-info").show();
        $(".student-list").hide();
        $("#studentListShowButton").html("Xem danh sách học sinh");
    } else {
        $("#map").hide();
        $(".student-info").hide();
        $(".student-list").show();
        $("#studentListShowButton").html("Xem bản đồ")
    }
}

function setMapHeight() {
    let windowHeight = $(window).height();
    let headerHeight = $(".kt-header-mobile").height();
    $("#map").css({
        "height": windowHeight - headerHeight
    })
}

function renderMap() {
    let map = L.map('map').setView([21.030674, 105.800443], 16);
    map.locate({ setView: true, maxZoom: 16 });
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 16,
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoibGluaGxuIiwiYSI6ImNrMTZpZ2R5ZDAzcXMzbmt3cGZ5ejlxaXEifQ.egi3vPgOfYIKA1psvosktg'
    }).addTo(map);

    let driverID = "5e58c859ffabd92d6d68dbb5";
    MeteorCall(_METHODS.trip.GetAll, null, accessToken).then(result => {
        let data = result.data.map(trip => {
            if(trip.driver._id == driverID){
                let students = trip.students;
                let studentData = students.map(student => {
                    let location = student.student.carStop.location;
                    let data = {
                        location: {
                            lat: location[0],
                            lng: location[1]
                        },
                        info: {
                            name: student.student.user.name,
                            age: "20",
                            email: student.student.user.email,
                            phoneNumber: student.student.user.phone,
                            parentsPhoneNumber: "08716262625",
                            pickupAddress: student.student.carStop.address
                        }
                    }

                    return data
                })
                renderStudentLocation(studentData, map)
            }
        })
    })
}

function renderStudentLocation(dt, map) {
    dt.map((item, index) => {
        let marker = L.marker([item.location.lat, item.location.lng]).addTo(map);
        marker._icon.classList.add(`map-marker${index}`);
        $(".leaflet-marker-icon").attr("src", "/img/black-marker.png");
        $(`.map-marker${index}`).attr({
            name: item.info.name,
            age: item.info.age,
            phoneNumber: item.info.phoneNumber,
            parentsPhoneNumber: item.info.parentsPhoneNumber,
            pickupAddress: item.info.pickupAddress,
            email: item.info.email
        });
    })
}

function ClickStudentLocation(event) {
    event.preventDefault();
    $(".leaflet-marker-icon").attr("src", "/img/black-marker.png");
    $(event.currentTarget).attr("src", "/img/red-marker.png")
   let data = {
     name: $(event.currentTarget).attr("name"),
     age: $(event.currentTarget).attr("age"),
     phoneNumber: $(event.currentTarget).attr("phoneNumber"),
     parentsPhoneNumber: $(event.currentTarget).attr("parentsPhoneNumber"),
     pickupAddress: $(event.currentTarget).attr("parentsPhoneNumber"),
     email: $(event.currentTarget).attr("email")
   }

    renderStudentInfo(data)
}

function renderStudentInfo(data) {
    $("#displayStudentInfoInUpCommingTrip").html(`
            <div class="kt-portlet">
                <div class="kt-portlet__body">
                    <div class="kt-widget kt-widget--user-profile-3">
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
                                    <a href="#" class="kt-widget__username" id="studentName">
                                        ${data.name}
                                        <!-- <i class="flaticon2-correct kt-font-success"></i>   -->

                                    </a>
                                    <span id="status" style="color: red; padding-bottom: 0.6rem;"><b>Chưa lên xe</b></span>

                                    <div class="kt-widget__action">
                                        <button type="button" class="btn btn-label-success btn-sm btn-upper"
                                            id="confirmPickedUp">Đã đón</button>&nbsp;
                                        <button type="button" class="btn btn-brand btn-sm btn-upper"
                                            id="confirmDroppedOut">Đã xuống xe</button>
                                    </div>
                                </div>

                                <div class="kt-widget__subhead">
                                    <div><i class="flaticon2-new-email"></i>&nbsp;Email:&nbsp;<a
                                            id="email">${data.email}</a></div>
                                    <div><i class="flaticon2-calendar-3"></i>&nbsp;Sđt:&nbsp;<a
                                            id="phoneNumber">${data.phoneNumber}</a></div>
                                    <div><i class="flaticon2-placeholder"></i>&nbsp;Địa chỉ đón:&nbsp;<a
                                            id="pickupAddress">${data.pickupAddress}</a></div>
                                    <div><i class="flaticon2-calendar-3"></i>&nbsp;Sđt phụ huynh:&nbsp;<a
                                            id="parentsPhoneNumber">${data.parentsPhoneNumber}</a></div>
                                </div>

                                <div class="kt-widget__info">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    `);
    $('.student-info').show();
}