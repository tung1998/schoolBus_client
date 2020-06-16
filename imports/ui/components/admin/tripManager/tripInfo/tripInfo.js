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
    _TRIP_LOG,
    _TRIP_CARSTOP
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
    Session.set('tripLog', [])
})

Template.tripDetail.onRendered(() => {
    reloadData();
    $(".anchorHeight").css({
        "height": 400
    })
    initMap()
})

Template.tripDetail.helpers({
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
    tripStatusBtn() {
        let tripStatus = Session.get('tripStatus')
        if (tripStatus === _TRIP.status.accident.number)
            return `<span class="kt-badge kt-badge--${_TRIP.status.accident.classname} kt-badge--inline kt-badge--pill kt-badge--rounded">Chuyến đi gặp sự cố</span>`
        else if (tripStatus === _TRIP.status.ready.number)
            return `<button type="button" class="btn btn-success btn-sm status-trip-btn" status="${_TRIP.status.moving.number}">
                        <i class="fas fa-play"></i> Bắt đầu
                    </button>`
        else if (tripStatus === _TRIP.status.moving.number) {
            let carStop = checkCarstop()
            if (carStop && carStop.status === _TRIP_CARSTOP.status.arrived.number) {
                return `<button type="button" class="btn btn-primary btn-sm status-trip-carStop-btn" carStopID="${carStop.carStopID}" status="${_TRIP_CARSTOP.status.leaved.number}">
                            <i class="fas fa-play"></i>Rời điểm dừng
                        </button>`
            } else if (carStop && carStop.status === _TRIP_CARSTOP.status.notArrived.number) {
                return `<button type="button" class="btn btn-primary btn-sm status-trip-carStop-btn" carStopID="${carStop.carStopID}" status="${_TRIP_CARSTOP.status.arrived.number}">
                            <i class="fas fa-play"></i>Đến điểm dừng tiếp theo
                        </button>`
            }
            return ` <button type="button" class="btn btn-dark btn-sm status-trip-btn" status="${_TRIP.status.finish.number}">
                        <i class="fas fa-stop"></i>Kết thúc
                    </button>`
        } else if (tripStatus === _TRIP.status.finish.number) {
            return ` <span class="kt-badge kt-badge--success kt-badge--inline kt-badge--pill kt-badge--rounded">Chuyến đi đã kết thúc</span>`
        }
    },
    reportBtn() {
        let tripStatus = Session.get('tripStatus')
        if (tripStatus === _TRIP.status.ready.number || tripStatus === _TRIP.status.moving.number)
            return `<button type="button" class="btn btn-warning btn-sm" data-toggle="modal"
                    data-target="#reportModal">
                        <i class="fas fa-exclamation-triangle"></i>
                    Báo cáo sự cố
                </button>`
        else if (tripStatus === _TRIP.status.accident.number) {
            return `<button type="button" class="btn btn-success btn-sm status-trip-btn" status="${_TRIP.status.moving.number}" tripID="${Session.get('tripID')}">
                        <i class="fas fa-play"></i> Tiếp tục</button>`
        }
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
    'click .status-trip-btn': updateTripStatus,
    'click .status-trip-carStop-btn': updateTripCarstopStatus,
    'click #report-button': reportIssues,
    'change input[type=radio][name=report]': chooseReport,
    'change #carstopStudentFilter': carstopStudentFilterChange,
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
        if (this.action.includes('Update trip student status')) {
            let tripStudent = getJsonDefault(_TRIP_STUDENT.status, 'number', this.data.status)
            tripLogJson.html = `<p>Học sinh: 
                                    <strong>${this.data.student.user.name}</strong> 
                                    <span class="text-${tripStudent.classname}">${tripStudent.text}</span>
                                </p>`
        }
        else if (this.action.includes('Update trip status')) {
            let tripStatus = getJsonDefault(_TRIP.status, 'number', this.data.status)
            tripLogJson.html = `<p>Thay đổi trạng thái chuyến đi: 
                                    <span class="text-${tripStatus.classname}">${tripStatus.text}</span>
                                </p>`
        }
        else if (this.action.includes('Update trip carStop')) {
            let tripStatus = getJsonDefault(_TRIP_CARSTOP.status, 'number', this.data.status)

            tripLogJson.html = `<p> 
                                    <span class="text-${tripStatus.classname}">${tripStatus.text}</span>:  ${this.data.carStop.name}
                                </p>`
        }else if (this.action.includes('Update trip')&&this.data.status===_TRIP.status.accident.number) {
            let tripStatus = getJsonDefault(_TRIP_CARSTOP.status, 'number', this.data.status)

            tripLogJson.html = `<p> 
                                    <span class="text-${tripStatus.classname}">Xe gặp sự cố  <strong>${this.data.note}</strong></span>:
                                </p>`
        }
        return tripLogJson
    }
})

Template.studentTripRow.helpers({
    status() {
        return getJsonDefault(_TRIP_STUDENT.status, 'number', this.value.status)
    },
    index() {
        return ++this.index
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
    }).then(result => {
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
        else if (routeName == 'driver.upCommingTripInfo' || routeName == 'nanny.upCommingTripInfo')
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
        carstopStudentFilterChange()
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

async function updateTripStatus(e) {
    let target = e.currentTarget
    let status = Number(target.getAttribute('status'))
    let tripData = Session.get('tripData')
    let checkConfirm
    if (status === _TRIP.status.finish.number && tripData.type == _TRIP.type.toSchool.number) {
        let studentIncar = tripData.students.filter(item => item.status === _TRIP_STUDENT.status.pickUp.number)
        if (studentIncar.length) {
            handleError('Chưa xác nhận đủ học sinh', `Có ${studentIncar.length} học sinh chưa xuống xe?`)
            return
        } else {
            let studentGetOff = tripData.students.filter(item => item.status === _TRIP_STUDENT.status.getOff.number)
            let studentIncar = tripData.students.filter(item => item.status === _TRIP_STUDENT.status.pickUp.number)
            let studentRequest = tripData.students.filter(item => item.status === _TRIP_STUDENT.status.request.number)
            let studentAbsent = tripData.students.filter(item => item.status === _TRIP_STUDENT.status.absent.number)
            checkConfirm = await handleConfirm(`<div><strong class="">Học sinh xuống xe: ${studentGetOff.length}</strong></div>
                                            <div><strong class="">Học sinh trên xe: ${studentIncar.length}</strong></div>
                                            <div><strong class="">Học sinh xin nghỉ: ${studentRequest.length}</strong></div>
                                            <div><strong class="">Học sinh vắng mặt: ${studentAbsent.length}</strong></div>`)
        }
    } else
        checkConfirm = await handleConfirm("Xác nhận")
    if (checkConfirm.value)
        MeteorCall(_METHODS.trip.UpdateTripStatus, {
            tripID: Session.get('tripID'),
            status
        }, accessToken).then(result => {
            reloadData();
        }).catch(handleError)
}

async function updateTripCarstopStatus(e) {
    let target = e.currentTarget
    let tripData = Session.get('tripData')
    let carStopID = target.getAttribute('carStopID')
    let status = Number(target.getAttribute('status'))
    let checkConfirm
    if (tripData.type == _TRIP.type.toSchool.number && status === _TRIP_CARSTOP.status.leaved.number) {
        let studentsInCarStopID = tripData.students.filter(item => item.student.carStopID == carStopID)
        let studentNotConfirm = studentsInCarStopID.filter(item => item.status === _TRIP_STUDENT.status.undefined.number)
        if (studentNotConfirm.length) {
            handleError('Chưa xác nhận đủ học sinh', `Có ${studentNotConfirm.length} học sinh chưa lên xe?`)
            return
        }
        else {
            let studentIncar = studentsInCarStopID.filter(item => item.status === _TRIP_STUDENT.status.pickUp.number)
            let studentRequest = studentsInCarStopID.filter(item => item.status === _TRIP_STUDENT.status.request.number)
            let studentAbsent = studentsInCarStopID.filter(item => item.status === _TRIP_STUDENT.status.absent.number)
            checkConfirm = await handleConfirm(`<div><strong class="">Học sinh trên xe: ${studentIncar.length}</strong></div>
                                                <div><strong class="">Học sinh xin nghỉ: ${studentRequest.length}</strong></div>
                                                <div><strong class="">Học sinh vắng mặt: ${studentAbsent.length}</strong></div>`)
        }
    } else if (tripData.type == _TRIP.type.toHome.number) {
        studentNotConfirm = tripData.students.filter(item => item.status === _TRIP_STUDENT.status.undefined.number)
        if (studentNotConfirm.length) {
            handleError('Chưa xác nhận đủ học sinh', `Có ${studentNotConfirm.length} học sinh chưa lên xe?`)
            return
        }

        else {
            if (status === _TRIP_CARSTOP.status.leaved.number) {
                let studentsInCarStopID = tripData.students.filter(item => item.student.carStopID == carStopID)
                let studentIncar = studentsInCarStopID.filter(item => item.status === _TRIP_STUDENT.status.pickUp.number)
                if (studentIncar.length) {
                    handleError('Chưa xác nhận đủ học sinh', `Có ${studentIncar.length} học sinh tại điểm dừng còn trên xe?`)
                    return
                }
                else {
                    let studentGetOff = studentsInCarStopID.filter(item => item.status === _TRIP_STUDENT.status.getOff.number)
                    checkConfirm = await handleConfirm(`<div><strong class="">Đã trả ${studentGetOff.length} học sinh tại điểm dừng</strong></div>`)
                }
            } else {
                let studentGetOff = tripData.students.filter(item => item.status === _TRIP_STUDENT.status.getOff.number)
                let studentIncar = tripData.students.filter(item => item.status === _TRIP_STUDENT.status.pickUp.number)
                let studentRequest = tripData.students.filter(item => item.status === _TRIP_STUDENT.status.request.number)
                let studentAbsent = tripData.students.filter(item => item.status === _TRIP_STUDENT.status.absent.number)

                checkConfirm = await handleConfirm(`<div><strong class="">Học sinh xuống xe: ${studentGetOff.length}</strong></div>
                                                <div><strong class="">Học sinh trên xe: ${studentIncar.length}</strong></div>
                                                <div><strong class="">Học sinh xin nghỉ: ${studentRequest.length}</strong></div>
                                                <div><strong class="">Học sinh vắng mặt: ${studentAbsent.length}</strong></div>`)
            }
        }
    } else
        checkConfirm = await handleConfirm(`Xác nhận!`)

    if (checkConfirm.value)
        MeteorCall(_METHODS.trip.UpdateCarStop, {
            tripID: Session.get('tripID'),
            carStopID,
            status
        }, accessToken).then(result => {
            reloadData();
        }).catch(handleError)
}

function reportIssues(e) {
    $('#reportModal').modal('hide')
    handleConfirm('Xác nhận báo cáo sự cố').then(result => {
        if (result.value) {
            let value = $('input[name=report]:checked')
            let data = {
                _id: Session.get('tripID'),
                note: "",
                status: _TRIP.status.accident.number
            }
            if (value.val() == 0) {
                data.note = $('#report-content').val()
            } else {
                data.note = value.parent().text().trim()
            }
            MeteorCall(_METHODS.trip.Update, data, accessToken).then(result => {
                reloadData();
            }).catch(handleError)
        }
    })
}

function chooseReport(e) {
    let value = e.currentTarget.value
    if (value == 0) {
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

function checkCarstop() {
    let tripData = Session.get('tripData')
    let arrivedCarstop = tripData.carStops.filter(item => item.status == _TRIP_CARSTOP.status.arrived.number)[0]
    if (arrivedCarstop) return arrivedCarstop
    let notArrivedCarStop = tripData.carStops.filter(item => item.status == _TRIP_CARSTOP.status.notArrived.number || item.status === null)[0]
    if (notArrivedCarStop) return notArrivedCarStop
    return false
}

function carstopStudentFilterChange(e) {
    let value = $('#carstopStudentFilter').prop('checked')
    let tripData = Session.get('tripData')
    let currentCarStop = tripData.carStops.filter(item => item.status === _TRIP_CARSTOP.status.arrived.number)[0]
    if (currentCarStop) {
        if (value) {
            let studentFilter = tripData.students.filter(item => item.student.carStopID == currentCarStop.carStopID)
            Session.set('studentTripData', studentFilter)
        } else {
            Session.set('studentTripData', tripData.students)
        }
    } else {
        if (e)
            handleError(null, "Xe chưa đến điểm dừng")
        $('#carstopStudentFilter').prop('checked', false)
        Session.set('studentTripData', tripData.students)
    }

}