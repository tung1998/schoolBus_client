import './carStop.html'
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'

Template.minimap.onRendered(function() {
    setMapHeight()
    L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images/';
    var minimap = L.map('minimap', { drawControl: true, zoomControl: false }).setView([21.0388, 105.7886], 19);
    L.tileLayer('https://apis.wemap.asia/raster-tiles/styles/osm-bright/{z}/{x}/{y}@2x.png?key=vpstPRxkBBTLaZkOaCfAHlqXtCR', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(minimap);

    var marker = L.marker([21.03709858, 105.78349972]).addTo(minimap);
    minimap.on('move', function() {
        marker.setLatLng(minimap.getCenter());
    });

    //Dragend event of map for update marker position
    minimap.on('dragend', function(e) {
        var cnt = minimap.getCenter();
        var position = marker.getLatLng();
        lat = Number(position['lat']).toFixed(5);
        lng = Number(position['lng']).toFixed(5);
        $('.position').val(lat + ' ' + lng);
    });
})

function setMapHeight() {
    let windowHeight = $(window).height();
    let mapHeight = $("#minimap").height();
    let sHeaderHeight = $("#kt_content").height();
    let footerHeight = $("#kt_footer").height();
    let topBarHeight = $("#kt_header").height();
    console.log(windowHeight - topBarHeight - sHeaderHeight - footerHeight)
    if ($(window).width() < 1024) {
        topBarHeight = $("#kt_header_mobile").height();
        $("#minimap").css({
            //"height": windowHeight - topBarHeight - sHeaderHeight - footerHeight
            "height": $(".col-lg-6").height()
        })
        $('.kt-content').css({
            "padding-top": 0,
            "padding-bottom": 0
        })
        $('.col-lg-6').css({
            "padding": 0
        })
    } else {
        $("#minimap").css({
                //"height": windowHeight - topBarHeight - sHeaderHeight - footerHeight
                "height": $(".col-lg-6").height()
            })
            /*$("#kt_wrapper").css({
                "padding-top": 60
            })*/
        $('.kt-content').css({
            "padding-top": 0,
            "padding-bottom": 0
        })

        $('.col-lg-6').css({
            "padding": 0,
            //"height": windowHeight - topBarHeight - sHeaderHeight - footerHeight
        })
    }
}