import './monitoring.html';
const Cookies = require("js-cookie");
import {
    MeteorCall,
    handleError
} from "../../../../functions";
import {
    _METHODS
} from "../../../../variableConst";
let accessToken;
var markers = [];
Template.carStop.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.monitor_map.onRendered(function() {
    setMapHeight()
    L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images/';
    window.monitormap = L.map('monitormap', {
        drawControl: true,
        zoomControl: false
    }).setView([21.0388, 105.7886], 14);
    L.tileLayer('https://apis.wemap.asia/raster-tiles/styles/osm-bright/{z}/{x}/{y}@2x.png?key=vpstPRxkBBTLaZkOaCfAHlqXtCR', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(monitormap);
    setMarker(21.0388, 105.7886, monitormap)
})

Template.monitoring.events({
    'click tr': (event) => {
        console.log(event.currentTarget)
        setViewCar(21.0388, 105.7886, markers[0])
    }
})

function setMapHeight() {
    let windowHeight = $(window).height();
    let sHeaderHeight = $(".kt-subheader").height();
    let footerHeight = $("#kt_footer").height();
    let topBarHeight = $("#kt_header").height();
    if ($(window).width() < 1024) {
        topBarHeight = $("#kt_header_mobile").height();
        $("#monitormap").css({
            "height": windowHeight - topBarHeight - sHeaderHeight - footerHeight
        })
        $('.kt-content').css({
            "padding-top": 0,
            "padding-bottom": 0
        })
    } else {

        $("#monitormap").css({
            "height": windowHeight - topBarHeight - sHeaderHeight - footerHeight
        })
        $('.kt-content').css({
            "padding-top": 0,
            "padding-bottom": 0
        })
    }
}

function setMarker(lat, lng, monitormap) {
    let mark = L.marker([lat, lng]).addTo(window.monitormap);
    let popup = contentInfoMarker({})
    mark.bindPopup(popup, { minWidth: 301 });
    markers.push(mark);
}

function setViewCar(lat, lng, marker) {
    marker.openPopup();
    window.monitormap.setView([lat, lng], 20);
}

function contentInfoMarker(json) {
    const fullDate = moment(Number(json.timestamp)).format('HH:mm:ss DD/MM/YYYY');
    return `
        <div class="font-14">
            <dl class="row mr-0 mb-0">
                <dt class="col-sm-5">Biển số:</dt>
               
            </dl>
        </div>
    `
}