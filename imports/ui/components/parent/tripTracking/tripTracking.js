import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'
import './tripTracking.html';

Template.tripTracking.rendered = function() {
    L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images/';
    var mymap = L.map('testmap').setView([21.0388, 105.7886], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(mymap);
    setMapHeight()
        /*var marker = L.marker([21.0369024, 105.7811870]).addTo(mymap).on('click', function() {
            FlowRouter.go('point1', { _id: '/' })
        });

        var marker = L.marker([21.029484, 105.827625]).addTo(mymap).on('click', function() {
            FlowRouter.go('point2', { _id: '/' })
        });

        var marker = L.marker([21.048169, 105.790342]).addTo(mymap).on('click', function() {
            FlowRouter.go('point3', { _id: '/' })
        });*/
};

function setMapHeight() {
    let windowHeight = $(window).height();
    let mapHeight = $("#testmap").height();
    let footerHeight = $("#kt_footer").height();
    let topBarHeight = $("#kt_header").height();

    if ($(window).width() < 1024) {
        topBarHeight = $("#kt_header_mobile").height();
        $("#testmap").css({
            "height": windowHeight - topBarHeight - 2 * footerHeight + 17
        })
        $('#kt_content').css({
            "padding-top": 0,
            "padding-bottom": 0
        })
    } else {
        $("#testmap").css({
            "height": windowHeight - topBarHeight - 2 * footerHeight - 17
        })
        $("#kt_wrapper").css({
            "padding-top": 60
        })
        $('#kt_content').css({
            "padding-top": 0,
            "padding-bottom": 0
        })
    }
}