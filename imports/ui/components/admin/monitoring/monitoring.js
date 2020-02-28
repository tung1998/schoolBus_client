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
var markers_id = [];
Template.monitoring.onCreated(() => {
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
    window.markerGroup = L.layerGroup().addTo(monitormap);
    MeteorCall(_METHODS.gps.getLast, null, accessToken).then(result => {
            console.log(markerGroup)
            let htmlTable = result.map(htmlRow);
            $("#table-body").html(htmlTable.join(" "));
        })
        .catch(handleError)
        //console.log(layer._leaflet_id)
    setInterval(() => {
        let newLatLng = new L.LatLng(21.0388, 105.7886);
    }, 5000)
})

Template.monitor_map.onRendered(() => {
    reUpdate()
})

Template.monitoring.events({
    'click tr': (event) => {
        let indx = parseInt($(event.currentTarget).attr("id"));
        let tarMark = markerGroup._layers[markers_id[indx]]
        let latval = tarMark._latlng.lat;
        let lngval = tarMark._latlng.lng;
        setViewCar(tarMark, latval, lngval)
    },
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
    let mark = L.marker([lat, lng]).addTo(markerGroup);
    let popup = contentInfoMarker({})
    mark.bindPopup(popup, {
        minWidth: 301
    });
}

function setViewCar(marker, lat, lng) {
    marker.openPopup();
    window.monitormap.setView([lat, lng], 25);
}

function contentInfoMarker(json) {
    const fullDate = moment(Number(json.timestamp)).format('HH:mm:ss DD/MM/YYYY');
    return `
        <div class="font-14">
            <dl class="row mr-0 mb-0">
                <dt class="col-sm-5">Biển số:${json.car.numberPlate}</dt>
                <dt class="col-sm-5"></dt>
            </dl>
        </div>
    `
}

function htmlRow(data, index) {
    let item = {
        _id: data._id,
        numberPlate: data.car.numberPlate,
        velocity: 0
    }
    markers_id.push(47 + 2 * index)
    let lat = data.location[0],
        lng = data.location[1];
    setMarker(lat, lng, monitormap)
        //console.log(markers_id)
    return ` <tr id = ${index}>
                <th scope="row">${index}</th>
                <td>${item.numberPlate}</td>
                <td>${item.velocity}</td>
            </tr>`;
}

function appendLatlng(data, markerID) {
    let lat = data.location[0],
        lng = data.location[1];
    markerGroup._layers[markerID].setLatLng([lat, lng])
}

function reUpdate() {
    setInterval(() => {
        MeteorCall(_METHODS.gps.getLast, null, accessToken).then(result => {
                //let marker_id = 47; 
                console.log(markers_id)
                    //markerGroup.clearLayers()
                    //console.log(result)
                let htmlTable = result.map((data, index) => {
                    appendLatlng(data, markers_id[index]);
                    //dconsole.log(marker_id)

                })
            })
            .catch(handleError)
    }, 5000)
}
//event triggered => get orderNumber => setViewCar(lat,lng,markers[orderNumber])