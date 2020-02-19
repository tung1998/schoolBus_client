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
    'click .leaflet-marker-icon': ClickStudentLocation
})

function setMapHeight() {
    let windowHeight = $(window).height();
    let headerHeight = $(".kt-header-mobile").height();
    $("#map").css({
        "height": windowHeight - headerHeight
    })
}

function renderMap() {
    let map = L.map('map').setView([21.018531670363743, 105.8111550447129], 16);
    map.locate({ setView: true, maxZoom: 16 });
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 16,
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoibGluaGxuIiwiYSI6ImNrMTZpZ2R5ZDAzcXMzbmt3cGZ5ejlxaXEifQ.egi3vPgOfYIKA1psvosktg'
    }).addTo(map);

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
    $('.student-info').show();
    let name = $(event.currentTarget).attr("name");
    let age = $(event.currentTarget).attr("age");
    let phoneNumber = $(event.currentTarget).attr("phoneNumber");
    let parentsPhoneNumber = $(event.currentTarget).attr("parentsPhoneNumber");
    let pickupAddress = $(event.currentTarget).attr("parentsPhoneNumber");
    let email = $(event.currentTarget).attr("email");

    $("#studentName").html(name);
    $("#email").html(email);
    $("#phoneNumber").html(phoneNumber);
    $("#pickupAddress").html(pickupAddress);
    $("#parentsPhoneNumber").html(parentsPhoneNumber);
}