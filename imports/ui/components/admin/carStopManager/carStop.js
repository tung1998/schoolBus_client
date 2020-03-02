import './carStop.html'

const Cookies = require("js-cookie");
import {
    MeteorCall,
    handleError
} from "../../../../functions";
import {
    _METHODS
} from "../../../../variableConst";
let accessToken;
//let position = [0, 0];
Template.carStop.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.carStop.onRendered(() => {
    //reloadTable();
});

Template.minimap.onRendered(function() {
    setMapHeight()
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
    minimap.on('move', function() {
        marker.setLatLng(minimap.getCenter());
    });

    //Dragend event of map for update marker position
    minimap.on('dragend', function(e) {
        let cnt = minimap.getCenter();
        let position = marker.getLatLng();
        lat = Number(position['lat']);
        lng = Number(position['lng']);
        let adr = getAddress(lat, lng);
        console.log(adr)

        MeteorCall(_METHODS.wemap.getAddress, { lat: lat, lng: lng }, accessToken).then(result => {
            let props = result.features[0].properties;
            let cor = result.features[0].geometry.coordinates;
            let addressElement = {
                name: props.name,
                housenumber: props.housenumber,
                street: props.street,
                city: props.city,
                district: props.district,
                state: props.state
            }

            address = addressElement.name + ', ' +
                addressElement.housenumber + ', ' +
                addressElement.street + ', ' +
                addressElement.city + ', ' +
                addressElement.district + ', ' +
                addressElement.state + ', ';
            $('.position').val(cor[1] + ' ' + cor[0]);
            $('.address').val(address)
        }).catch(handleError)
    });
})

Template.carStop.events({
    'submit form': (event) => {
        event.preventDefault();
        let carStopInfo = {
            stopType: event.target.stopType.value,
            name: event.target.stopName.value,
            address: event.target.address.value,
            location: getLatLng(event.target.location.value)
        }
        event.target.stopType.value = " ";
        event.target.stopName.value = " ";
        event.target.address.value = " ";
        event.target.location.value = " ";
        MeteorCall(_METHODS.carStop.Create, carStopInfo, accessToken)
            .then(result => {
                console.log(result)

                //let htmlTable = result.data.map(htmlRow);
                //$("#table-body").html(htmlTable.join(" "));
            })
            .catch(handleError);
    }
})

function setMapHeight() {
    let windowHeight = $(window).height();
    let mapHeight = $("#minimap").height();
    let sHeaderHeight = $(".kt-subheader").height();
    let footerHeight = $("#kt_footer").height();
    let topBarHeight = $("#kt_header").height();
    console.log(windowHeight - topBarHeight - sHeaderHeight - footerHeight)
    console.log(windowHeight);
    console.log(topBarHeight);
    console.log(sHeaderHeight);
    console.log(footerHeight);
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

function getLatLng(string) {
    let LatLng = string.split(" ");
    LatLng[0] = parseFloat(LatLng[0]);
    LatLng[1] = parseFloat(LatLng[1]);
    return LatLng;
}

async function getAddress(lat, lng) {
    try {
        let result = await MeteorCall(_METHODS.wemap.getAddress, { lat: lat, lng: lng }, accessToken);
        console.log(result)
        let props = result.features[0].properties;
        let addressElement = {
            name: props.name,
            housenumber: props.housenumber,
            street: props.street,
            city: props.city,
            district: props.district,
            state: props.state
        }

        let address = addressElement.name + ', ' +
            addressElement.housenumber + ', ' +
            addressElement.street + ', ' +
            addressElement.city + ', ' +
            addressElement.district + ', ' +
            addressElement.state + ', ';
        //console.log(address)
        return address
    } catch (err) {
        handleError(err)
    }
}