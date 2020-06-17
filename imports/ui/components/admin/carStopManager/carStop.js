import './carStop.html'

const Cookies = require("js-cookie");
import {
    MeteorCall,
    handleError,
    handleConfirm,
    handleSuccess
} from "../../../../functions";
import {
    _METHODS,
    _SESSION,

} from "../../../../variableConst";
let accessToken;
let carStopID
//let position = [0, 0];
Template.carStop.onCreated(() => {
    accessToken = Cookies.get("accessToken");
    Session.set('schools', [])
});

Template.carStop.onRendered(() => {
    if (Session.get(_SESSION.isSuperadmin))
        initSchoolSelect2()

    carStopID = FlowRouter.getQueryParam('carStopID')
    if (carStopID) {
        MeteorCall(_METHODS.carStop.GetById, {
            _id: carStopID
        }, accessToken).then(result => {
            $('#location').val(result.location.join(' '))
            $('#stopName').val(result.name)
            $('#address').val(result.address)
            $('#school-select').val(result.schoolID)
        })
    }
});

Template.carStop.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    },
    schools() {
        return Session.get('schools')
    }
})

Template.minimap.onRendered(function () {
    setMapHeight()
    document.getElementById("confirm-button").disabled = true;
    L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images/';
    let minimap = L.map('minimap', {
        drawControl: true,
        zoomControl: false
    }).setView([21.0388, 105.7886], 19);
    L.tileLayer('https://apis.wemap.asia/raster-tiles/styles/osm-bright/{z}/{x}/{y}@2x.png?key=vpstPRxkBBTLaZkOaCfAHlqXtCR', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(minimap);

    let marker = L.marker([21.03709858, 105.78349972]).addTo(minimap);
    minimap.on('drag', function () {
        marker.setLatLng(minimap.getCenter());
        document.getElementById("confirm-button").disabled = true;
    });

    minimap.on('zoomend', function () {
        let coor = $("#location").val().split(" ")
        coor[0] = parseFloat(coor[0]);
        coor[1] = parseFloat(coor[1]);
        if ((coor[0]) && (coor[1])) {
            marker.setLatLng([coor[0], coor[1]]);
            minimap.panTo(new L.LatLng(coor[0], coor[1]));
        } else {
            minimap.panTo(new L.LatLng(21.03709858, 105.78349972));
            marker.setLatLng([21.03709858, 105.78349972]);
        }

    })
    //Dragend event of map for update marker position
    minimap.on('dragend', function (e) {
        document.getElementById("confirm-button").disabled = false;
        let cnt = minimap.getCenter();
        let position = marker.getLatLng();
        lat = Number(position['lat']);
        lng = Number(position['lng']);

        MeteorCall(_METHODS.wemap.getAddress, {
            lat: lat,
            lng: lng
        }, accessToken).then(result => {
            let props = result.features[0] ? result.features[0].properties : {};
            let cor = result.features[0] ? result.features[0].geometry.coordinates : {};
            let addressElement = [
                props.name || null,
                props.housenumber || null,
                props.street || null,
                props.city || null,
                props.district || null,
                props.state || null
            ]
            address = addressElement.filter(item => item).join(', ')

            $('.position').val(cor[1] + ' ' + cor[0]);
            $('.address').val(address)
        }).catch(handleError)
    });
})

Template.carStop.events({
    'submit form': (event) => {
        event.preventDefault();
        let carStopInfo = {
            // stopType: event.target.stopType.value,
            name: event.target.stopName.value,
            address: event.target.address.value,
            location: event.target.location.value.split(' ').map(Number)
        }
        //let authorize = false;
        if (Session.get(_SESSION.isSuperadmin)) carStopInfo.schoolID = $('#school-select').val()
        if (carStopInfo.location || carStopInfo.name || carStopInfo.schoolID) {
            if (carStopID) {
                carStopInfo._id = carStopID
                MeteorCall(_METHODS.carStop.Update, carStopInfo, accessToken)
                    .then(result => {
                        handleSuccess("Đã sửa điểm dừng")
                        FlowRouter.go('/carStopList')
                    })
                    .catch(handleError);
            }
            else {
                MeteorCall(_METHODS.carStop.Create, carStopInfo, accessToken)
                    .then(result => {
                        handleSuccess("Đã thêm điểm dừng")
                    })
                    .catch(handleError);
                // event.target.stopType.value = " ";
                event.target.stopName.value = " ";
                event.target.address.value = " ";
                event.target.location.value = " ";
                $('#school-select').val('').trigger('change')
            }
        } else {
            handleError();
        }
    }
})

Template.carStop.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    },
    schools() {
        return Session.get('schools')
    },
});

Template.carStop.onDestroyed(function () {
    carStopID = null
});

function setMapHeight() {
    // let windowHeight = $(window).height();
    // let mapHeight = $("#minimap").height();
    // let sHeaderHeight = $(".kt-subheader").height();
    // let footerHeight = $("#kt_footer").height();
    // let topBarHeight = $("#kt_header").height();
    if ($(window).width() < 1024) {
        topBarHeight = $("#kt_header_mobile").height();
        $("#minimap").css({
            // "height": windowHeight - topBarHeight - sHeaderHeight - footerHeight
            "height": $(".col-lg-6").height()
        })
    } else {

        $("#minimap").css({
            //"height": windowHeight - topBarHeight - sHeaderHeight - footerHeight
            "height": $(".anchorHeight").height()
        })
    }
}

function initSchoolSelect2() {
    MeteorCall(_METHODS.school.GetAll, null, accessToken).then(result => {
        Session.set('schools', result.data)
        $('#school-select').select2({
            width: '100%',
            placeholder: "Chọn trường"
        })
    }).catch(handleError)
}