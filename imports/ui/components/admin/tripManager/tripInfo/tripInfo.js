import './tripInfo.html'
import './instascan.js'
import {
    FlowRouter
} from 'meteor/kadira:flow-router';

import {
    swapPcs
} from '../../studentListManager/studentListInfo/studentListInfo.js'

const Cookies = require('js-cookie');
import {
    MeteorCall,
    handleError,
    handleConfirm,
    handleSuccess
} from '../../../../../functions';

import {
    _METHODS,
    _TRIP_STUDENT
} from '../../../../../variableConst';

import {
    renderStudentInfoModal
} from './instascan'

let accessToken, 
    carStopList = [],
    stopCoor = [],
    markers_id = [],
    polyID;

Template.tripDetail.onCreated(async () => {
    accessToken = Cookies.get('accessToken')
    Session.set('studentTripData', [])
    Session.set('studenInfoData', {})
})

Template.tripDetail.onRendered(() => {
    reloadData();
    $(".anchorHeight").css({
        "height": 400
    })
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
    drawPath(stopCoor);
})

Template.tripDetail.helpers({
    studentTripData() {
        return Session.get('studentTripData')
    }
})

Template.tripDetail.events({
    'click .status-btn': clickStatusButton,
    'click #openScannerModal': clickOpenScannerModal,
    'click .studentRow': clickStudentRow,
    'click .addressTab': (event) => {
        event.preventDefault();
        let indx = parseInt($(event.currentTarget).attr("id"));
        let tarMark = tripMap._layers[markers_id[indx]];
        let latval = tarMark._latlng.lat;
        let lngval = tarMark._latlng.lng;
        tarMark.openPopup();
        window.tripMap.setView([latval, lngval], 25);
    },
    'click .nav-link[href="#timeline"]': renderTimeLine,
    'mousemove .addressTab': (event) => {
        event.preventDefault();
        let indx = parseInt($(event.currentTarget).attr("id"));
        let tarMark = routeMiniMap._layers[markers_id[indx]];
        let latval = tarMark._latlng.lat;
        let lngval = tarMark._latlng.lng;
        tarMark.openPopup();
        window.routeMiniMap.setView([latval, lngval], 14);
    },
    'click .polyToggle': (event) => {
        event.preventDefault();
        removeLayerByID(polyID);
    }
})

Template.tripDetail.onDestroyed(() => {
    carStopList = null
    stopCoor = null
    markers_id = null
    Session.delete('studentTripData')
    Session.delete('studenInfoData')
    Session.delete('tripID')
})

Template.studentInfoModal.helpers({
    studenInfoData() {
        return Session.get('studenInfoData')
    }
})

function clickStudentRow(e) {
    renderStudentInfoModal($(e.currentTarget).attr("id"))
}

function clickStatusButton(e) {
    let target = e.currentTarget
    let tripID = target.getAttribute('tripID')
    let studentID = target.getAttribute('studentID')
    let status = Number(target.getAttribute('status'))
    console.log("reload data")
    MeteorCall(_METHODS.trip.Attendace, {
        tripID,
        status,
        studentID
    }, accessToken).then(async result => {
        handleSuccess('Đã cập nhật')
        reloadData()
        renderStudentInfoModal(studentID)
    }).catch(handleError)
}

function clickOpenScannerModal() {
    $('#instascannerModal').modal('show')
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
    let routeName = FlowRouter.getRouteName()
    try {
        if (routeName == 'tripManager.tripDetail')
            tripData = await MeteorCall(_METHODS.trip.GetById, {
                _id: FlowRouter.getParam('tripID')
            }, accessToken)
        else if (routeName == 'driver.upCommingTripInfo')
            tripData = await MeteorCall(_METHODS.trip.GetNext, null, accessToken)

        //get info trip
        console.log(tripData)
        Session.set('tripID', tripData._id)
        let dataTrip = {
            driverName: tripData.driver.user.name,
            driverPhone: tripData.driver.user.phone,
            nannyName: tripData.nanny.user.name,
            nannyPhone: tripData.nanny.user.phone,
            carNunberPlate: tripData.car?tripData.car.numberPlate:'',
            startTime: tripData.startTime,
        }
        carStopList = tripData.route.studentList.carStops;
        carStopList.forEach((data, index) => {
            stopCoor.push(data.location);
            let mark = L.marker(data.location).bindTooltip(data.name, {
                permanent: false
            }).addTo(tripMap);
            markers_id.push(markerGroup.getLayerId(mark))
            let popup = `
                <div class="font-14">
                    <dl class="row mr-0 mb-0">
                        <dt class="col-sm-3">Tên điểm dừng: </dt>
                        <dt class="col-sm-9">${data.name}</dt>
                        <dt class="col-sm-3">Địa chỉ: </dt>
                        <dt class="col-sm-9">${data.address}</dt>
                    </dl>
                </div>
            `
            mark.bindPopup(popup, {
                minWidth: 301
            });
        })
        drawPath(stopCoor)
        $('#driver-name').html(dataTrip.driverName)
        $('.phone:eq(0)').html(`Số điện thoại: ${dataTrip.driverPhone}`)
        $('#nanny-name').html(dataTrip.nannyName)
        $('.phone:eq(1)').html(`Số điện thoại: ${dataTrip.nannyPhone}`)
        $('#car-numberPlate').html(dataTrip.carNunberPlate)
        $('#start-time').html(dataTrip.startTime)

        //data học sinh
        Session.set('studentTripData', tripData.students.map((item, index) => {
            item.index = index + 1
            return item
        }))
    } catch (error) {
        handleError(error, 'Không có dữ liệu')
        $('tripData').addClass('kt-hidden')
        $('noData').removeClass('kt-hidden')
    }
}

function renderTimeLine() {
    MeteorCall(_METHODS.trip.GetTripLogByTripID, {
        tripID: Session.get('tripID')
    }, accessToken).then(result => {
        console.log(result)
    })
}

function removeLayerByID(id) {
    let found = false
    markerGroup.eachLayer(function (layer) {
        if (layer._leaflet_id === id) {
            markerGroup.removeLayer(layer);
            found = true;
        }
    });
    if (found == false) {
        addPoly(stopCoor)
    }
}

function addPoly(arr) {
    poly = L.polyline(arr, {
        color: 'blue',
        weight: 4,
        opacity: 0.5,
        smoothFactor: 1
    }).addTo(markerGroup);
    polyID = markerGroup.getLayerId(poly);
}

function drawPath(arr) {
    MeteorCall(_METHODS.wemap.getDrivePath, arr, accessToken).then(result => {
        let pol = []
        let a = result.routes[0].legs
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < a[i].steps.length; j++) {
                for (let k = 0; k < a[i].steps[j].intersections.length; k++) {
                    pol.push(swapPcs(a[i].steps[j].intersections[k].location))
                }
            }
        }
        pol.push(arr[0])
        stopCoor = pol;
        //addPoly(pol)
    }).catch(handleError);
}