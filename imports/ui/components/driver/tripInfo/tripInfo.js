import './tripInfo.html'
import {
    FlowRouter
} from 'meteor/kadira:flow-router';

const Cookies = require('js-cookie');
import {
    MeteorCall,
    handleError,
    handleConfirm,
    handleSuccess,
    getJsonDefault,
    convertTime,
    popupDefault,
    removeLayerByID,
    removeAllLayer
} from '../../../../functions';

import {
    _METHODS,
    _TRIP_STUDENT,
    _TRIP,
    _MARKER_CONFIG,
    _TRIP_LOG,
    _TRIP_CARSTOP,
    _URL_images
} from '../../../../variableConst';

let accessToken,
    carStopList = [],
    stopCoor = [],
    markersList = [],
    polyID,
    startCarStop,
    endCarStop,
    startCarStopMarker = L.icon(_MARKER_CONFIG.blue),
    endCarStopMarker = L.icon(_MARKER_CONFIG.red),
    normalCarStopMarker = L.icon(_MARKER_CONFIG.gray);

Template.tripDetailNoButton.onCreated(async () => {
    accessToken = Cookies.get('accessToken')
    Session.set('studentTripData', [])
    Session.set('studenInfoData', {})
    Session.set('tripData', {})
    Session.set('tripStatus', '')
    Session.set('tripLog', [])
})

Template.tripDetailNoButton.onRendered(() => {
    reloadData();
    $(".anchorHeight").css({
        "height": 400
    })
    initMap()
})

Template.tripDetailNoButton.helpers({
    studentTripData() {
        return Session.get('studentTripData')
    },
    tripData() {
        return Session.get('tripData')
    },
    tripLog() {
        return Session.get('tripLog')
    },
    startTime() {
        let tripData = Session.get('tripData')
        return convertTime(tripData.startTime, true, 'DD/MM/YYYY, HH:MM')
    },
    tripStatus() {
        return getJsonDefault(_TRIP.status, 'number', Session.get('tripStatus'))
    },
})

Template.tripDetailNoButton.events({
    'click .studentRow': clickStudentRow,
    'click .addressTab': (event) => {
        event.preventDefault();
        let indx = parseInt($(event.currentTarget).attr("id"));
        let tarMark = tripMap._layers[markersList[indx]];
        let latval = tarMark._latlng.lat;
        let lngval = tarMark._latlng.lng;
        tarMark.openPopup();
        window.tripMap.setView([latval, lngval], 25);
    },
    'click .nav-link[href="#timeline"]': renderTimeLine,
    'click .polyToggle': (event) => {
        event.preventDefault();
        removeLayerByID(polyID);
    },
})

Template.tripDetailNoButton.onDestroyed(() => {
    carStopList = []
    stopCoor = []
    markersList = []
    Session.delete('studentTripData')
    Session.delete('studenInfoData')
    Session.delete('tripID')
    Session.delete('tripStatus')
    Session.delete('tripData')
    Session.delete('tripLog')
    removeAllLayer(markerGroup)
})

Template.studentInfoModalNoButton.helpers({
    studenInfoData() {
        return Session.get('studenInfoData')
    }
})


function initMap() {
    L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images/';
    window.tripMap = L.map('tripMap', {
        drawControl: true,
        zoomControl: false
    }).setView([21.0388, 105.7886], 14);
    L.tileLayer('https://apis.wemap.asia/raster-tiles/styles/osm-bright/{z}/{x}/{y}@2x.png?key=vpstPRxkBBTLaZkOaCfAHlqXtCR', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(tripMap);
    setInterval(() => {
        tripMap.invalidateSize();
    }, 0) //invalidate Size of map
    window.markerGroup = L.layerGroup().addTo(tripMap); //create markerGroup
}

function clickStudentRow(e) {
    updateStudentInfoModalData($(e.currentTarget).attr("id"))
}


async function reloadData() {
    $(".anchorHeight").css({
        "height": 400
    })
    $(".kt-content").css({
        "padding-bottom": 0
    })
    $(".kt-footer--fixed").css({
        "padding-bottom": 0
    })
    let tripData
    try {
        tripData = await MeteorCall(_METHODS.trip.GetById, {
            _id: FlowRouter.getParam('tripID')
        }, accessToken)
        //get info trip
        console.log(tripData)

        Session.set('tripData', tripData)
        Session.set('tripID', tripData._id)
        startCarStop = tripData.route.startCarStop
        endCarStop = tripData.route.endCarStop
        carStopList = tripData.route.studentList.carStops;
        carStopList.forEach(item => {
            bindMarker(item)
        })
        bindMarker(tripData.route.startCarStop, startCarStopMarker)
        bindMarker(tripData.route.endCarStop, endCarStopMarker)
        //data học sinh
        Session.set('studentTripData', tripData.students)
        //get status trip
        Session.set('tripStatus', tripData.status)

        reloadMap()
    } catch (error) {
        handleError(error, 'Không có dữ liệu')
        $('#tripData').addClass('kt-hidden')
        $('#noData').removeClass('kt-hidden')
    }
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



function renderTimeLine() {
    MeteorCall(_METHODS.trip.GetTripLogByTripID, {
        tripID: Session.get('tripID')
    }, accessToken).then(result => {
        Session.set('tripLog', result.data)
        console.log(result)
    })
}


function updateStudentInfoModalData(studentID) {
    let studenInfoData = checkStudentInfo(studentID)
    studenInfoData.tripID = Session.get('tripID')
    if (studenInfoData.student.user.image) {
        studenInfoData.image = `${_URL_images}/${studenInfoData.student.user.image}/0`
    } else {
        studenInfoData.image = `/assets/media/users/user5.jpg`
    }
    Session.set('studenInfoData', studenInfoData)
    $("#studentInfoModal").modal("show")
}

function checkStudentInfo(studentID) {
    console.log(studentID)
    return Session.get('studentTripData').filter(student => student.studentID == studentID)[0]
}