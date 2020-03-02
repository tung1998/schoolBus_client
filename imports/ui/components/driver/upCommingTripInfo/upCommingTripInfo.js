import './upCommingTripInfo.html';


Template.upCommingTripInfo.onCreated(() => {

})

Template.upCommingTripInfo.onRendered(() => {
    $(document).ready(() => {
        $(".kt-footer").hide();
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
    let testData = [{
        location: {
            lat: 21.028751,
            lng: 105.813189
        },
        info: {
            name: "Trịnh Minh Hoàng",
            age: "20",
            email: "abc@gmail.com",
            phoneNumber: "0658412666",
            parentsPhoneNumber: "08716262625",
            pickupAddress: "hà nội"
        }
    },
    {
        location: {
            lat: 21.008561,
            lng: 105.826406
        },
        info: {
            name: "Lê Ngọc nLinh",
            age: "20",
            email: "abc@gmail.com",
            phoneNumber: "0658412666",
            parentsPhoneNumber: "08716262625",
            pickupAddress: "hà nội"
        }
    },
    ]
    let map = L.map('map').setView([testData[0].location.lat, testData[0].location.lng], 16);
    map.locate({ setView: true, maxZoom: 16 });
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 16,
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoibGluaGxuIiwiYSI6ImNrMTZpZ2R5ZDAzcXMzbmt3cGZ5ejlxaXEifQ.egi3vPgOfYIKA1psvosktg'
    }).addTo(map);

    renderStudentLocation(testData, map);
}

function renderStudentLocation(dt, map) {
    dt.forEach((item, index) => {
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