import './routeInfo.html';
import {
    FlowRouter
} from 'meteor/kadira:flow-router';

import {
    MeteorCall,
    handleError,
    popupDefault,
    removeLayerByID,
    removeAllLayer,
    handleSuccess
} from '../../../../../functions';

import {
    _METHODS,
    _SESSION,
    _MARKER_CONFIG
} from '../../../../../variableConst';

let accessToken, tripID, studentList = [],
    carStopList = [],
    markersList = [],
    carStopIDs = [],
    polyID,
    studentListID,
    startCarStop,
    endCarStop,
    startCarStopMarker = L.icon(_MARKER_CONFIG.blue),
    endCarStopMarker = L.icon(_MARKER_CONFIG.red),
    normalCarStopMarker = L.icon(_MARKER_CONFIG.gray);

Template.routeInfo.onCreated(() => {
    accessToken = Cookies.get('accessToken');
    Session.set('routeInfo', {});
});

Template.routeInfo.onRendered(() => {
    $(".anchorHeight").css({
        "height": 400
    })
    $(".kt-content").css({
        "padding-bottom": 0
    })
    $(".kt-footer--fixed").css({
        "padding-bottom": 0
    })
    reloadData();
    initMap();

});

Template.routeInfo.helpers({
    routeInfo() {
        return Session.get('routeInfo')
    },
    carStopList() {
        return Session.get('carStopList')
    }
})

Template.routeStudentRow.helpers({
    index() {
        return ++this.index
    }
})

Template.routeInfo.events({
    'click .addressTab': clickCarStop,
    'drag .addressTab': dragTab,
    'click .confirmButton': confirmPath,
})

Template.routeInfo.onDestroyed(() => {
    carStopList = []
    stopCoor = []
    markersList = []
    Session.delete('studentTripData')
    Session.delete('studenInfoData')
    Session.delete('tripID')
    removeAllLayer(markerGroup)
})

function reloadData() {
    let routeID = FlowRouter.getParam('id')
    MeteorCall(_METHODS.route.GetById, {
        _id: routeID
    }, accessToken).then(result => {
        console.log(result);
        startCarStop = result.startCarStop
        endCarStop = result.endCarStop
        Session.set('routeInfo', result)
        carStopList = result.studentList ? result.studentList.carStops || [] : [];
        carStopIDs = result.studentList ? result.studentList.carStopIDs || [] : [];
        carStopList.forEach(item => {
            bindMarker(item)
        })
        // add start, end marker
        bindMarker(result.startCarStop, startCarStopMarker)
        bindMarker(result.endCarStop, endCarStopMarker)

        reloadMap()
    }).catch(handleError)
}

function initMap() {
    L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images/';
    window.routeMiniMap = L.map('routeMiniMap', {
        drawControl: true,
        zoomControl: false
    }).setView([21.0388, 105.7886], 14);
    L.tileLayer('https://apis.wemap.asia/raster-tiles/styles/osm-bright/{z}/{x}/{y}@2x.png?key=vpstPRxkBBTLaZkOaCfAHlqXtCR', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(routeMiniMap);
    setInterval(() => { routeMiniMap.invalidateSize(); }, 0) //invalidate Size of map
    window.markerGroup = L.layerGroup().addTo(routeMiniMap); //create markerGroup
}

function dragTab(event) {
    if (event.drag.type === 'dragend') {
        setTimeout(() => {
            let newCarStopIDList = $('#kt_sortable_portlets div[carStopID]:not(.ui-sortable-helper)').map((index, item) => {
                return item.getAttribute('carStopID')
            }).toArray()
            console.log(newCarStopIDList)
            console.log(carStopIDs)
            if (JSON.stringify(newCarStopIDList) == JSON.stringify(carStopIDs)) {
                clickCarStop(event)
            } else {
                carStopIDs = newCarStopIDList
                newCarStopList = carStopIDs.map(carStopID => {
                    return carStopList.filter(item => item._id == carStopID)[0]
                })
                carStopList = newCarStopList
                reloadMap()
            }
        }, 500)
    }
}

function clickCarStop(event) {
    event.preventDefault();
    let indx = parseInt($(event.currentTarget).attr("index"));
    let tarMark = markerGroup._layers[markersList[indx]];
    let latval = tarMark._latlng.lat;
    let lngval = tarMark._latlng.lng;
    tarMark.openPopup();
    window.routeMiniMap.setView([latval, lngval], 25);
}

function addPoly(arr) {
    removeLayerByID(markerGroup, polyID)
    let poly = L.polyline(arr, { color: 'blue', weight: 4, opacity: 0.5, smoothFactor: 1 }).addTo(markerGroup);
    polyID = markerGroup.getLayerId(poly);
}

function swapPcs(arr) {
    let c = arr[1];
    arr[1] = arr[0];
    arr[0] = c;
    return arr;
}


function confirmPath(event) {
    let studentListID = Session.get('routeInfo').studentList._id
    MeteorCall(_METHODS.studentList.Update, { _id: studentListID, carStopIDs: carStopIDs }, accessToken).then(result => {
        //console.log(result);
        handleSuccess('Cập nhật thành công')
    }).catch(handleError)
}

function bindMarker(carStop, icon = normalCarStopMarker) {
    let marker = L.marker(carStop.location, { icon }).bindTooltip(carStop.name, { permanent: false }).addTo(markerGroup);
    markersList.push(markerGroup.getLayerId(marker))
    let popup = popupDefault(carStop.name, carStop.address)
    marker.bindPopup(popup, {
        minWidth: 301
    });
}

function reloadMap() {
    let carStopListAll = [startCarStop, startCarStop].concat(carStopList).concat([endCarStop])
    console.log(carStopListAll)
    let coorArr = carStopListAll.map(item => item.location)
    console.log(carStopListAll)
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