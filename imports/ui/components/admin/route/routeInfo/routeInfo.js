import './routeInfo.html';
import {
    FlowRouter
} from 'meteor/kadira:flow-router';

import {
    MeteorCall,
    handleError,
    handleConfirm,
    handleSuccess
} from '../../../../../functions';

import {
    _METHODS,
    _SESSION
} from '../../../../../variableConst';

let accessToken, tripID, studentList = [],
carStopList = [],
stopPointCoors = [],
markers_id = [],
carStopIDs = [],
htmlStopPane = '',
defaultStopPoint = [],
defaultCarStop = [],
stopPointOrder = [],
polyID,
studentListID,
address = [],
name = [],
schoolID,
desCoor,
startCoor,
destinationPointMarker = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
}),
startPointMarker = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

Template.routeInfo.onCreated(() => {
    accessToken = Cookies.get('accessToken');
});

Template.routeInfo.onRendered(() => {
    reloadData();
    
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
    'click .addressTab': (event) => {
        event.preventDefault();
        let indx = parseInt($(event.currentTarget).attr("id"));
        let tarMark = markerGroup._layers[markers_id[indx]];
        let latval = tarMark._latlng.lat;
        let lngval = tarMark._latlng.lng;
        tarMark.openPopup();
        window.routeMiniMap.setView([latval, lngval], 25);
    },
    'mousemove .addressTab': (event) => {
        event.preventDefault();
        let indx = parseInt($(event.currentTarget).attr("id"));
        let tarMark = markerGroup._layers[markers_id[indx]];
        let latval = tarMark._latlng.lat;
        let lngval = tarMark._latlng.lng;
        tarMark.openPopup();
        window.routeMiniMap.setView([latval, lngval], 14);
    },
    'drag .addressTab': dragTab,
    'click .autoDirect': autoDirect,
    'click .confirmButton': confirmPath,
})

Template.routeInfo.onDestroyed(() => {
    carStopList = null
    stopCoor = null
    markers_id = null
    Session.delete('studentTripData')
    Session.delete('studenInfoData')
    Session.delete('tripID')
    document.getElementById("kt_sortable_portlets").innerHTML = '';
    markerGroup.eachLayer((layer) => {
        markerGroup.removeLayer(layer)
    });

})

function reloadData() {
    $(".anchorHeight").css({
        "height": 400
    })
    $(".kt-content").css({
        "padding-bottom": 0
    })
    $(".kt-footer--fixed").css({
        "padding-bottom": 0
    })
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
        studentListID = result.studentListID;
        carStopList = result.studentList.carStops;
        let len = carStopList.length;
        carStopList.map((data, index) => {
            address.push(data.address);
            name.push(data.name);
            stopPointCoors.push(data.location);
            defaultStopPoint.push(data.location);
            carStopIDs.push(data._id);
            defaultCarStop.push(data._id);
            stopPointOrder.push(index);
            let mark;
            if (index === 0) {
                desCoor = data.location;
                document.getElementById("des").innerHTML +=
                    `<div class="kt-portlet kt-portlet--mobile addressTab kt-portlet--skin-solid kt-bg-danger" id="${index}">
                        <div class="kt-portlet__head">
                            <div class="kt-portlet__head-label">
                                <h3 class="kt-portlet__head-title title="${data.name}">
                                    ${data.name}        
                                </h3>
                            </div>
                        </div> 
                    </div>`
                let mark = L.marker(data.location, { icon: destinationPointMarker }).bindTooltip(data.name, { permanent: false }).addTo(markerGroup);
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
            } else if (index === len - 1) {
                startCoor = data.location
                document.getElementById("start").innerHTML +=
                    `<div class="kt-portlet kt-portlet--mobile addressTab kt-portlet--skin-solid kt-bg-brand" id="${index}">
                            <div class="kt-portlet__head">
                                <div class="kt-portlet__head-label">
                                    <h3 class="kt-portlet__head-title title="${data.name}">
                                        ${data.name}        
                                    </h3>
                                </div>
                            </div> 
                        </div>`
                let mark = L.marker(data.location, { icon: startPointMarker }).bindTooltip(data.name, { permanent: false }).addTo(markerGroup);
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
            } else {
                htmlStopPane +=
                    `<div class="kt-portlet kt-portlet--mobile addressTab kt-portlet--sortable" id="${index}">
                        <div class="kt-portlet__head ui-sortable-handle">
                            <div class="kt-portlet__head-label">
                                <h3 class="kt-portlet__head-title title="${data.name}">
                                    ${data.name}        
                                </h3>
                            </div>
                        </div>
                    </div>`
                let mark = L.marker(data.location).bindTooltip(data.name, { permanent: false }).addTo(markerGroup);
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
            }
        })
        
        drawPath(stopPointCoors);
        document.getElementById("kt_sortable_portlets").innerHTML += htmlStopPane;
        //setColor(0, 'destination');
        //setColor(stopPointOrder[stopPointOrder.length], 'start');

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
    //console.log(key)
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

function dragTab(event) {
    let targetID = event.target.getAttribute('id'),
        ID_order = [0],
        modPos;
    if (event.drag.type === 'dragend') {
        $('.carStopContainer').children('div').each(function () {
            if ($(this).attr('id') != undefined) {
                if ($(this).attr('id') != targetID) {
                    ID_order.push($(this).attr('id'));
                }
            } else {
                ID_order.push(targetID);
                modPos = ID_order.length - 1; //điểm di chuyển
            }
        })
        ID_order.push(ID_order.length);
        if (ID_order != stopPointOrder) {
            console.log(ID_order)

            stopPointCoors = reArrange(defaultStopPoint, [], ID_order)
            carStopIDs = reArrange(defaultCarStop, [], ID_order)
            removeLayerByID(polyID)
            console.log(stopPointCoors, carStopIDs)
            console.log(stopPointCoors)
            console.log(carStopIDs)
            drawPath(stopPointCoors)
        } else {
            //console.log(2)
        }
    }
}

function addPoly(arr) {
    let poly = L.polyline(arr, { color: 'blue', weight: 4, opacity: 0.5, smoothFactor: 1 }).addTo(markerGroup);
    polyID = markerGroup.getLayerId(poly);
    console.log(polyID)
}

function removeLayerByID(id) {
    markerGroup.eachLayer(function (layer) {
        if (layer._leaflet_id === id) {
            markerGroup.removeLayer(layer)
        }
    });
}

function reArrange(arr1, arr2, idxArr) {
    arr2[0]=arr1[0];
    arr2[idxArr.length-1]=arr1[idxArr.length-1]
    for (let i = 1; i < idxArr.length-1; i++) {
        if (arr1[idxArr[i]] != undefined) {
            arr2[i] = arr1[idxArr[i]];
        }
    }
    return arr2;
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
        addPoly(pol)
    }).catch(handleError);
}

function swapPcs(arr) {
    let c = arr[1];
    arr[1] = arr[0];
    arr[0] = c;
    return arr;
}

function autoDirect(event) {
    event.preventDefault();
    removeLayerByID(polyID)
    stopPointCoors = DistanceAutoCal(desCoor, startCoor, stopPointCoors);
    carStopIDs = reArrange(carStopIDs, [], stopPointOrder);
    drawPath(stopPointCoors)
    console.log(stopPointOrder)
    htmlStopPane = ''
    for (let i = 1; i < stopPointOrder.length - 1; i++) {

        htmlStopPane +=
            `<div class="kt-portlet kt-portlet--mobile addressTab kt-portlet--sortable" id="${stopPointOrder[i]}">
            <div class="kt-portlet__head ui-sortable-handle">
                <div class="kt-portlet__head-label">
                    <h3 class="kt-portlet__head-title title="${address[stopPointOrder[i]]}">
                        ${name[stopPointOrder[i]]}        
                    </h3>
                </div>
            </div>
            
        </div>`
        //<div class="kt-portlet__body">${studentStopPoint[stopPointOrder[i]].address}</div>
    }
    document.getElementById("kt_sortable_portlets").innerHTML = htmlStopPane;
    //setColor(0, 'destination');
    //setColor(stopPointOrder[stopPointOrder.length], 'start');
}

function confirmPath(event) {
    MeteorCall(_METHODS.studentList.Update, { _id: studentListID, carStopIDs: carStopIDs }, accessToken).then(result => {
        console.log(result);
    }).catch(handleError)
}

function DistanceAutoCal(dest, start, coorArr) {
    let distance = [];
    let distOrder = [];
    let finalCoorOrder = [dest];
    console.log(coorArr);
    for (let i = 1; i < coorArr.length-1; i++) {
        distance.push(getDistance(dest, coorArr[i]));
        //console.log(getDistance(dest,coorArr[i]))
        distOrder.push(i);
    }
    //distOrder.push(coorArr.length - 1);
    distOrder.sort(function (a, b) { return distance[a] < distance[b] ? -1 : distance[a] > distance[b] ? 1 : 0; });
    distOrder.unshift(0);
    distOrder.push(coorArr.length - 1);
    //console.log(distOrder);
    stopPointOrder = distOrder;
    for (let i = 1; i < distOrder.length; i++) {
        finalCoorOrder.push(coorArr[distOrder[i]]);
    }
    //console.log(finalCoorOrder);
    return finalCoorOrder;
} //dest: [[lat,lng]] //coorArr: tập hợp các carStop

function getDistance(origin, destination) {
    // return distance in meters
    let lon1 = toRadian(origin[1]),
        lat1 = toRadian(origin[0]),
        lon2 = toRadian(destination[1]),
        lat2 = toRadian(destination[0]);

    let deltaLat = lat2 - lat1;
    let deltaLon = lon2 - lon1;

    let a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
    let c = 2 * Math.asin(Math.sqrt(a));
    let EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
}

function toRadian(degree) {
    return degree * Math.PI / 180;
}

/*function setColor(id, pos){
    if (pos == 'destination'){
        let element = document.getElementById(`${id}`);
        element.classList.add(`kt-portlet--skin-solid`, `kt-bg-danger`);
    } else if (pos == 'start'){
        let element = document.getElementById(`${id}`);
        element.classList.add(`kt-portlet--skin-solid`, `kt-portlet--`, `kt-bg-brand`);
    }
    console.log(element)
}*/