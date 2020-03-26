import './routeInfo.html';
import {
    FlowRouter
} from 'meteor/kadira:flow-router';

import {
    drawPath,
    addPoly,
    swapPcs
} from '../../studentListManager/studentListInfo/studentListInfo.js'

import {
    MeteorCall,
    handleError,
    handleConfirm,
    handleSuccess
} from '../../../../../functions';

import {
    _METHODS
} from '../../../../../variableConst';

let accessToken
let tripID
let studentList = []
let carStopList = []
let stopCoor = []
let markers_id = []
let htmlStopPane = ''
Template.routeInfo.onCreated(() => {
    accessToken = Cookies.get('accessToken');
});

Template.routeInfo.onRendered(() => {
    reloadData();
    $(".anchorHeight").css({
        "height": 400
    })
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
});

Template.routeInfo.events({
    // 'click #addRouteButton': clickAddRouteButton,
    'click .addressTab': (event)=>{
        event.preventDefault();
        let indx = parseInt($(event.currentTarget).attr("id"));
        let tarMark = routeMiniMap._layers[markers_id[indx]];
        let latval = tarMark._latlng.lat;
        let lngval = tarMark._latlng.lng;
        tarMark.openPopup();
        window.routeMiniMap.setView([latval, lngval], 25);
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

function reloadData() {
    let routeID = FlowRouter.getParam('id')
    MeteorCall(_METHODS.route.GetById, {
        _id: routeID
    }, accessToken).then(result => {
        //get info route
        console.log(result);
        let dataTrip = {
            driverName: result.driver.user.name,
            driverPhone: result.driver.user.phone,
            nannyName: result.nanny.user.name,
            nannyPhone: result.nanny.user.phone,
            carNunberPlate: result.car.numberPlate,
            startTime: result.startTime,
        }
        carStopList = result.studentList.carStops;
        carStopList.map((data, index)=>{
            stopCoor.push(data.location);
            let mark = L.marker(data.location).bindTooltip(data.name, { permanent: false }).addTo(routeMiniMap);
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
        let dataStudent = result.studentList.students
        let table = $('#table-studentList')
        let htmlTable = dataStudent.map(htmlRow)
        table.find("tbody").html(htmlTable.join(""))

    }).catch(handleError)
}


function htmlRow(key, index) {
    // console.log(key)
    let studentInfo = {
        _id: key.studentID,
        IDStudent: key.IDStudent,
        name: key.user.name,
        phone: key.user.phone,
        class: key.class.name,
        teacher: key.class.teacher.user.name,
        school: key.class.school.name,
        schoolAddress: key.class.school.address,
    }

    return `<tr id="${studentInfo._id}">
                <th scope="row">${index + 1}</th>
                <td>${studentInfo.IDStudent}</td>
                <td>${studentInfo.name}</td>
                <td>${studentInfo.phone}</td>
                <td>${studentInfo.class}</td>
                <td>${studentInfo.teacher}</td>
                <td>${studentInfo.school}</td>
                <td>${studentInfo.schoolAddress}</td>
        </tr>`
}