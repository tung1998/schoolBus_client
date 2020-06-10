import './tripInfo.html'
import './instascan.js'
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
} from '../../../../../functions';

import {
    _METHODS,
    _TRIP_STUDENT,
    _TRIP,
    _MARKER_CONFIG,
    _TRIP_LOG
} from '../../../../../variableConst';

import {
    updateStudentInfoModalData
} from './instascan'

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

Template.tripDetail.onCreated(async () => {
    accessToken = Cookies.get('accessToken')
    Session.set('studentTripData', [])
    Session.set('studenInfoData', {})
    Session.set('tripData', {})
    Session.set('tripStatus', '')
    Session.set('tripLog',[])
})

Template.tripDetail.onRendered(() => {
    reloadData();
    $(".anchorHeight").css({
        "height": 400
    })
    initMap()

    this.checkTripStatus = Tracker.autorun(() => {
        if (Session.get('tripStatus') === 0) {
            $('#trip-status').html(`
                    <button type="button" class="btn btn-success btn-sm" id="status-trip" data-json=\'${JSON.stringify({status: Session.get('tripStatus')})}\'><i class="fas fa-play"></i> Bắt đầu</button>
                `)
        } else if (Session.get('tripStatus') === 1) {
            $('#trip-status').html(`
                    <button type="button" class="btn btn-dark btn-sm" id="status-trip" data-json=\'${JSON.stringify({status: Session.get('tripStatus')})}\'><i class="fas fa-stop"></i>Kết thúc</button>
                `)
            $('#report-status').html(`
                <button type="button" class="btn btn-warning btn-sm" data-toggle="modal"
                    data-target="#reportModal">
                    <i class="fas fa-exclamation-triangle"></i>
                    Báo cáo sự cố
                </button>
            `)
            
        }
        else if(Session.get('tripStatus') === 3) {
            $('#report-status').html(`
            <button type="button" class="btn btn-success btn-sm" id="status-trip" data-json=\'${JSON.stringify({status: Session.get('tripStatus')})}\'><i class="fas fa-play"></i> Tiếp tục</button>
            `)
            
        }
        else if (Session.get('tripStatus') === 2){
            $('#trip-status').html('<span class="kt-badge kt-badge--success kt-badge--inline kt-badge--pill kt-badge--rounded">Chuyến đi đã kết thúc</span>')
            $('#report-status').html('')
        }
    })
})

Template.tripDetail.helpers({
    studentTripData() {
        return Session.get('studentTripData')
    },
    tripData(){
        return Session.get('tripData')
    },
    tripLog(){
        return Session.get('tripLog')
    },
    startTime(){
        let tripData = Session.get('tripData')
        return convertTime(tripData.startTime, true, 'DD/MM/YYYY, HH:MM')
    }
})

Template.tripDetail.events({
    'click .status-btn': clickStatusButton,
    'click #openScannerModal': clickOpenScannerModal,
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
    'click #status-trip': modifyTripStatus,
    'click #report-button': reportIssues,
    'change input[type=radio][name=report]': chooseReport
})

Template.tripDetail.onDestroyed(() => {
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
    if (this.checkTripStatus) this.checkTripStatus = null
})

Template.studentInfoModal.helpers({
    studenInfoData() {
        return Session.get('studenInfoData')
    }
})

Template.tripLogElement.helpers({
    actionTime() {
        return moment(this.time).format('HH:MM') 
    },
    action() {
        let tripLogJson = getJsonDefault(_TRIP_LOG.type, 'number', this.type)
        tripLogJson.html = ''
        if(this.action.includes('Update trip student status')){
            let tripStudent = getJsonDefault(_TRIP_STUDENT.status, 'number', this.data.status)
            tripLogJson.html = `<p>Học sinh: 
                                    <strong>${this.data.student.user.name}</strong> 
                                    <span class="text-${tripStudent.classname}">${tripStudent.text}</span>
                                </p>`
        }
        if(this.action.includes('Update trip status')){
            let tripStatus = getJsonDefault(_TRIP.status, 'number', this.data.status)
            tripLogJson.html = `<p>Thay đổi trạng thái chuyến đi: 
                                    <span class="text-${tripStatus.classname}">${tripStatus.text}</span>
                                </p>`
        }
        return tripLogJson
    }
})

function initMap(){
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
        return reloadData()
    }).then(result=>{
        updateStudentInfoModalData(studentID)
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
        else if (routeName == 'driver.upCommingTripInfo'||routeName == 'nanny.upCommingTripInfo')
            tripData = await MeteorCall(_METHODS.trip.GetNext, null, accessToken)

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
        Session.set('studentTripData', tripData.students.map((item, index) => {
            item.index = index + 1
            return item
        }))
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

function modifyTripStatus(e) {
    let data = $(e.currentTarget).data('json')
    let value = ''
    switch(data.status) {
        case 0:
            value = 1
            break;
        case 1:
            value = 2
            break;
        case 3: 
            value = 1
            break;
        default:
            break;
    }
    console.log(value);
    MeteorCall(_METHODS.trip.ModifyTripStatus, {
        tripID: Session.get('tripID'),
        status: value
    }, accessToken).then(result => {
        reloadData();
    }).catch(handleError)
}

function reportIssues(e) {
    let value = $('input[name=report]:checked')
    let data = {
        _id: Session.get('tripID'),
        note: "",
        status: 3
    }
    if (value.val() == 5) {
        data.note = $('#report-content').val()
    } else {
        data.note = value.parent().text().trim()
    }
    MeteorCall(_METHODS.trip.Update, data, accessToken).then(result => {
        reloadData();
        $('#reportModal').modal('hide')
    }).catch(handleError)
}

function chooseReport(e) {
    let value = e.currentTarget.value
    if (value == 5) {
        $('#report-content').removeAttr("disabled")
    } else {
        $('#report-content').attr("disabled", 'disabled')
    }
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