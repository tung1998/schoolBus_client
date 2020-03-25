import './tripInfo.html'
import './instascan.js'
import {
    FlowRouter
} from 'meteor/kadira:flow-router';

import {
    drawPath,
    addPoly,
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

export {
    checkStudentInfo
}

let accessToken
let tripID
let studentList = []
let carStopList = []
let stopCoor = []
let markers_id = []
let htmlStopPane = ''
Template.tripDetail.onCreated(() => {
    accessToken = Cookies.get('accessToken')
    tripID = FlowRouter.getParam('tripID')
    
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
    setInterval(() => { tripMap.invalidateSize(); }, 0) //invalidate Size of map
    window.markerGroup = L.layerGroup().addTo(tripMap); //create markerGroup
})


Template.tripDetail.events({
    'click .status-btn': clickStatusButton,
    'click #openScannerModal': clickOpenScannerModal,
    'click .studentRow': clickStudentRow,
    'click .addressTab': (event)=>{
        event.preventDefault();
        let indx = parseInt($(event.currentTarget).attr("id"));
        let tarMark = tripMap._layers[markers_id[indx]];
        let latval = tarMark._latlng.lat;
        let lngval = tarMark._latlng.lng;
        tarMark.openPopup();
        window.tripMap.setView([latval, lngval], 25);
    },
    'mousemove .addressTab': (event)=>{
        event.preventDefault();
        let indx = parseInt($(event.currentTarget).attr("id"));
        let tarMark = routeMiniMap._layers[markers_id[indx]];
        let latval = tarMark._latlng.lat;
        let lngval = tarMark._latlng.lng;
        tarMark.openPopup();
        window.routeMiniMap.setView([latval, lngval], 14);
    }
})

Template.tripDetail.onDestroyed(() => {
    studentList = null
    tripID = null
})


function clickStudentRow(e){
    renderStudentInfoModal($(e.currentTarget).attr("id"))
}

function checkStudentInfo(studentID) {
    let result = null;
    console.log(studentList)
    studentList.map(student => {
        if(student.studentID == studentID) {
            result = student;
        }
    })
    return result;
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
        handleSuccess('Cập nhật', "tình trạng học sinh")
        await reloadData()
        renderStudentInfoModal(studentID)
    }).catch(handleError)
}

function clickOpenScannerModal() {
    $('#instascannerModal').modal('show')
}

function reloadData() {

    return MeteorCall(_METHODS.trip.GetById, {
        _id: tripID
    }, accessToken).then(result => {
        //get info trip
        console.log(result);
        let dataTrip = {
            driverName: result.route.driver.user.name,
            driverPhone: result.route.driver.user.phone,
            nannyName: result.route.nanny.user.name,
            nannyPhone: result.route.nanny.user.phone,
            carNunberPlate: result.route.car.numberPlate,
            startTime: result.startTime,
        }
        carStopList = result.route.studentList.carStops;
        carStopList.map((data, index)=>{
            stopCoor.push(data.location);
            let mark = L.marker(data.location).bindTooltip(data.name, { permanent: false }).addTo(tripMap);
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
                htmlStopPane += 
                `<div class="kt-portlet kt-portlet--mobile addressTab" id="${index}">
                    <div class="kt-portlet__head">
                        <div class="kt-portlet__head-label">
                            <h3 class="kt-portlet__head-title title="${data.name}">
                                ${data.name}        
                            </h3>
                        </div>
                    </div>
                    
                </div>`
        })
        drawPath(stopCoor)
        document.getElementById("carStopContainer").innerHTML += htmlStopPane;
        
        $('#driver-name').html(dataTrip.driverName)
        $('.phone:eq(0)').html(`Số điện thoại: ${dataTrip.driverPhone}`)
        $('#nanny-name').html(dataTrip.nannyName)
        $('.phone:eq(1)').html(`Số điện thoại: ${dataTrip.nannyPhone}`)
        $('#car-numberPlate').html(dataTrip.carNunberPlate)
        $('#start-time').html(dataTrip.startTime)

        //data học sinh
        studentList = result.students
        let table = $('#table-studentList')
        let row = studentList.map(htmlRow)
        table.find("tbody").html(row.join(""))
    }).catch(handleError)
}


function htmlRow(key, index) {
    let studentInfo = {
        _id: key.studentID,
        IDStudent: key.student ? key.student.IDStudent : '',
        name: key.student.user.name,
        phone: key.student.user.phone,
        class: key.student.class ? key.student.class.name : '',
        teacher: key.student.class ? key.student.class.teacher.user.name : '',
        school: key.student.class ? key.student.class.school.name : '',
        schoolAddress: key.student.class ? key.student.class.school.address : '',
        status: key.status
    }
    // <td>${studentInfo.class}</td>
    // <td>${studentInfo.teacher}</td>
    // <td>${studentInfo.school}</td>
    // <td>${studentInfo.schoolAddress}</td>

    return `<tr id="${studentInfo._id}" class="studentRow">
                <th scope="row">${index + 1}</th>
                <td>${studentInfo.IDStudent}</td>
                <td>${studentInfo.name}</td>
                <td>${studentInfo.phone}</td>
        </tr>`
}