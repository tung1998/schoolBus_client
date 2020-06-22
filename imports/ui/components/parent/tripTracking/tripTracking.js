import './tripTracking.html';
const Cookies = require('js-cookie');
import {
    MeteorCall, handleError, contentInfoMarker, removeLayerByID, removeAllLayer, popupDefault, MeteorCallNoEfect
} from '../../../../functions';

import {
    _METHODS, _MARKER_CONFIG
} from '../../../../variableConst';

let carStopList = [],
    stopCoor = [],
    markersList = [],
    polyID,
    startCarStop,
    endCarStop,
    startCarStopMarker = L.icon(_MARKER_CONFIG.blue),
    endCarStopMarker = L.icon(_MARKER_CONFIG.red),
    normalCarStopMarker = L.icon(_MARKER_CONFIG.gray);

Template.tripTracking.onCreated(async () => {
    accessToken = Cookies.get('accessToken')
})

Template.tripTracking.onRendered(function () {
    initMap()
    reloadData()
})

Template.tripTracking.onDestroyed(function () {
    clearInterval(window.updateGPS)
    Session.delete('tripData')
    removeAllLayer(markerGroup)
})


function initMap() {
    // L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images/';
    window.trackingMap = L.map('trackingMap', { drawControl: true }).setView([21.0388, 105.7886], 13);
    L.tileLayer('https://apis.wemap.asia/raster-tiles/styles/osm-bright/{z}/{x}/{y}@2x.png?key=vpstPRxkBBTLaZkOaCfAHlqXtCR', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(trackingMap);
    window.markerGroup = L.layerGroup().addTo(trackingMap);
}

async function reloadData() {
    try {
        let tripData = Session.get('tripData')
        if (!tripData) {
            tripData = await MeteorCall(_METHODS.trip.GetById, {
                _id: FlowRouter.getParam('tripID')
            }, accessToken)
            Session.set('tripData', tripData)
        }
        drawRoute(tripData)
        MeteorCall(_METHODS.gps.getLastByCar, {
            _id: tripData.carID
        }, accessToken).then(gpsData => {
            window.carMarker = L.marker(gpsData.location, {
                icon: L.icon({
                    iconUrl: `/img/icon/GrayCar.png`,
                    iconSize: [30, 30],
                })
            }).addTo(trackingMap);
            trackingMap.setView(gpsData.location)
        })

        window.updateGPS = setInterval(() => {
            updateData()
        }, 5000)
    }
    catch (e) {
        handleError(e)
    }
}

function updateData() {
    let tripData = Session.get('tripData')
    MeteorCallNoEfect(_METHODS.gps.getLastByCar, {
        _id: tripData.carID
    }, accessToken).then(gpsData => {
        carMarker.setLatLng(gpsData.location)
        contentInfoMarker(gpsData.location[0], gpsData.location[1], gpsData, carMarker)
    })
}

function drawRoute(tripData) {
    startCarStop = tripData.route.startCarStop
    endCarStop = tripData.route.endCarStop
    carStopList = tripData.route.studentList.carStops;
    carStopList.forEach(item => {
        bindMarker(item)
    })
    bindMarker(tripData.route.startCarStop, startCarStopMarker)
    bindMarker(tripData.route.endCarStop, endCarStopMarker)
    reloadMap()
}

function reloadMap() {
    let carStopListAll = [startCarStop, startCarStop].concat(carStopList).concat([endCarStop, endCarStop])
    let coorArr = carStopListAll.map(item => item.location).reverse()
    MeteorCall(_METHODS.wemap.getDrivePath, coorArr, accessToken).then(result => {
        let pol = []
        let a = result.routes[0].legs
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < a[i].steps.length; j++) {
                for (let k = 0; k < a[i].steps[j].intersections.length; k++) {
                    pol.push(swapPcs(a[i].steps[j].intersections[k].location))
                }
            }
        }
        pol.push(coorArr[0])
        addPoly(pol)
    }).catch(handleError);
}

function swapPcs(arr) {
    let c = arr[1];
    arr[1] = arr[0];
    arr[0] = c;
    return arr;
}

function addPoly(arr) {
    removeLayerByID(markerGroup, polyID)
    poly = L.polyline(arr, {
        color: 'blue',
        weight: 4,
        opacity: 0.5,
        smoothFactor: 1
    }).addTo(markerGroup);
    polyID = markerGroup.getLayerId(poly);
}

function bindMarker(carStop, icon = normalCarStopMarker) {
    let marker = L.marker(carStop.location, { icon }).bindTooltip(carStop.name, { permanent: false }).addTo(markerGroup);
    markersList.push(markerGroup.getLayerId(marker))
    let popup = popupDefault(carStop.name, carStop.address)
    marker.bindPopup(popup, {
        minWidth: 301
    });
}