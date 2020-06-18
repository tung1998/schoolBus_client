import './tripTracking.html';
const Cookies = require('js-cookie');
import {
    MeteorCall, handleError,
} from '../../../../functions';

import {
    _METHODS,
} from '../../../../variableConst';

Template.tripTracking.onCreated(async () => {
    accessToken = Cookies.get('accessToken')
    Session.set('tripData', {})
})

Template.tripTracking.onRendered(function () {
    initMap()
    reloadData()
})

Template.tripTracking.onDestroyed(function () {
    accessToken = Cookies.get('accessToken')
    Session.set('tripData', {})
})


function initMap() {
    // L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images/';
    var mymap = L.map('trackingMap', { drawControl: true }).setView([21.0388, 105.7886], 13);
    L.tileLayer('https://apis.wemap.asia/raster-tiles/styles/osm-bright/{z}/{x}/{y}@2x.png?key=vpstPRxkBBTLaZkOaCfAHlqXtCR', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(mymap);
    L.marker([21.03709858, 105.78349972]).addTo(mymap);
}

async function reloadData() {
    try {
        let tripData = Session.get('TripData')
        let gpsData
        if (!tripData)
            tripData = await MeteorCall(_METHODS.trip.GetById, {
                _id: FlowRouter.getParam('tripID')
            }, accessToken)
        if (tripData)
            gpsData = await MeteorCall(_METHODS.gps.getLastByCar, {
                _id: tripData.carID
            }, accessToken)
        console.log(gpsData)
    }
    catch (e) {
        handleError(e)
    }
}

