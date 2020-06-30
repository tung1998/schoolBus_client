import './monitoring.html';

const Cookies = require("js-cookie");
import {
    MeteorCall,
    handleError,
    MeteorCallNoEfect,
    contentInfoMarker,
    getJsonDefault,
    removeAllLayer
} from "../../../../functions";
import {
    _METHODS,
    _TRIP_STUDENT,
    _TRIP,
    TIME_DEFAULT
} from "../../../../variableConst";

import {
    COLLECTION_TASK
} from '../../../../api/methods/task'

let accessToken;
var markers_id = {};
var carID = [];
Template.monitoring.onCreated(() => {
    accessToken = Cookies.get("accessToken");
    Session.set("tripData", [])
    Meteor.subscribe('task.byName', 'Trip')
});

Template.monitoring.onRendered(() => {
    setMapHeight()
    initMap()
    updateData()
    this.realTimeTracker = Tracker.autorun(() => {
        let task = COLLECTION_TASK.find({
            name: 'Trip'
        }).fetch()
        if (task.length && task[0].tasks.length) {
            if (task.length && task[0].tasks.length && task[0].updatedTime > Date.now() - TIME_DEFAULT.check_task)
                updateData()
        }
    });
    this.updateGPS = setInterval(() => {
        updateGPS()
    }, 5000)
})

Template.monitoring.events({
    'click .monitoring-trip-row':clickMonitoringTripRow
})

Template.monitoring.helpers({
    hasData() {
        return Session.get('tripsData') && Session.get('tripsData').length
    },
    tripsData() {
        return Session.get('tripsData')
    },
})

Template.monitoringListTrip.helpers({
    index() {
        return ++this.index
    },
    tripStatus() {
        return getJsonDefault(_TRIP.status, "number", this.tripData.status)
    },
    tripType() {
        return getJsonDefault(_TRIP.type, "number", this.tripData.type)
    },
    totalStudent() {
        return this.tripData.students.length
    },
    pickUpStudent() {
        return this.tripData.students.filter(item => item.status === _TRIP_STUDENT.status.pickUp.number).length
    },
    getOffStudent() {
        return this.tripData.students.filter(item => item.status === _TRIP_STUDENT.status.getOff.number).length
    },
    requestStudent() {
        return this.tripData.students.filter(item => item.status === _TRIP_STUDENT.status.request.number).length
    },
    absentStudent() {
        return this.tripData.students.filter(item => item.status === _TRIP_STUDENT.status.absent.number).length
    },
})

Template.monitoring.onDestroyed(() => {
    clearInterval(this.updateGPS)
    Session.delete('tripsData')
    if (this.realTimeTracker) this.realTimeTracker.stop()
    removeAllLayer(markerGroup)
})

function initMap() {
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
}

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

function setMarker(lat, lng, json) {
    markerGroup.clearLayers()
    let mark = L.marker([lat, lng]).addTo(markerGroup);
    contentInfoMarker(lat, lng, json, mark)
    markers_id[json.carID]=markerGroup.getLayerId(mark)
}

function appendLatlng(data, markerID) {
    let lat = data.location[0],
        lng = data.location[1];
    markerGroup._layers[markerID].setLatLng([lat, lng])
    contentInfoMarker(lat, lng, data, markerGroup._layers[markerID])
}

function updateData() {
    MeteorCallNoEfect(_METHODS.trip.GetAllCurrentTrip, {
        beforeTime:"6000000",
        afterTime:"6000000"
    }, accessToken).then(tripsData => {
        Session.set("tripsData", tripsData)
        let GPSData = tripsData.map(item => item.carID)
            .filter((item, index, array) => array.indexOf(item) === index)
            .map(item => {
                return MeteorCallNoEfect(_METHODS.gps.getLastByCar, {
                    _id: item
                }, accessToken)
            })
        return Promise.all(GPSData)
    }).then(result => {
        if (result && result.length) {
            result.forEach(data => {
                setMarker(data.location[0], data.location[1], data)
            })
        }
    }).catch(handleError)

}

function updateGPS() {
    let tripsData = Session.get('tripsData')
    let GPSData = tripsData.map(item => item.carID)
        .filter((item, index, array) => array.indexOf(item) === index)
        .map(item => {
            return MeteorCallNoEfect(_METHODS.gps.getLastByCar, {
                _id: item
            }, accessToken)
        })
    Promise.all(GPSData).then(result => {
        if (result && result.length) {
            result.forEach(data => {
                appendLatlng(data, markers_id[data.carID]);
            })
        }
    }).catch(handleError)
}

function clickMonitoringTripRow(e){
    let carID = e.currentTarget.getAttribute("carID")
    markerGroup._layers[markers_id[carID]].openPopup()
}