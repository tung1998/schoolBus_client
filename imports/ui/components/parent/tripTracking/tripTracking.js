import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'
import './tripTracking.html';

Template.tripTracking.onRendered(function() {
    setMapHeight()
    L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images/';
    var mymap = L.map('testmap', { drawControl: true }).setView([21.0388, 105.7886], 13);
    L.tileLayer('https://apis.wemap.asia/raster-tiles/styles/osm-bright/{z}/{x}/{y}@2x.png?key=vpstPRxkBBTLaZkOaCfAHlqXtCR', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(mymap);
    L.marker([21.03709858, 105.78349972]).addTo(mymap);
    var pointList = [new L.LatLng(21.03709858, 105.78349972)];
    mymap.on('click', function(e) {
        addPoly(e, pointList, mymap)
    });
})

function setMapHeight() {
    let windowHeight = $(window).height();
    let mapHeight = $("#testmap").height();
    let sHeaderHeight = $("#kt_content").height();
    let footerHeight = $("#kt_footer").height();
    let topBarHeight = $("#kt_header").height();
    console.log(sHeaderHeight)
    if ($(window).width() < 1024) {
        topBarHeight = $("#kt_header_mobile").height();
        $("#testmap").css({
            "height": windowHeight - topBarHeight - sHeaderHeight - footerHeight
        })
        $('.kt-content').css({
            "padding-top": 0,
            "padding-bottom": 0
        })
    } else {
        $("#testmap").css({
                "height": windowHeight - topBarHeight - sHeaderHeight - footerHeight
            })
            /*$("#kt_wrapper").css({
                "padding-top": 60
            })*/
        $('.kt-content').css({
            "padding-top": 0,
            "padding-bottom": 0
        })
    }
}

function addPoly(e, pointList, mymap) {
    let point = new L.LatLng(e.latlng.lat, e.latlng.lng);
    pointList.push(point);
    new L.polyline([pointList[pointList.length - 2], point], { color: 'blue', weight: 10, opacity: 0.5, smoothFactor: 1 }).addTo(mymap);
}