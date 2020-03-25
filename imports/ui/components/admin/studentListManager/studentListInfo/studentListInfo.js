import './studentListInfo.html'
import {
    FlowRouter
} from 'meteor/kadira:flow-router';
const Cookies = require('js-cookie');

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

let accessToken;
let studentIDs = [];
let studentStopPoint = []; //contains addressName, carStopCoordinates
let stopPointCoors = []; //contains all carStopCoordinates
let htmlSortable = ''; //contains all html dragable tabs
let stopPointOrder = [];
let defaultStopPoint;
//array that contains order of stopPoints from 0 to studentSTopPoints.length
//sorted by distance from anchor point to each individual stopPoints
let polyID;
//array that contains ID of polyline-layers in markerGroup
let polyCoor = [];
let defaultCarStop = [];
let carStopIDs = [];
Template.studentListInfo.onCreated(() => {
    accessToken = Cookies.get('accessToken');
});

Template.studentListInfo.onRendered(() => {
    reloadTable().then(result => {
        
        initClassSelect2()
        $(".anchorHeight").css({
                "height": 400
            }) //set fixxed height of sortable tabs
            //sort stopPointsCoor by distance to anchor point
        defaultStopPoint = stopPointCoors;
        drawPath(defaultStopPoint)
        //}
        //append HTML sortable tabs to tab-pane
        for (let i = 0; i <= stopPointOrder.length - 1; i++) {
            htmlSortable +=
                `<div class="kt-portlet kt-portlet--mobile kt-portlet--sortable" id="${stopPointOrder[i]}">
                    <div class="kt-portlet__head ui-sortable-handle">
                        <div class="kt-portlet__head-label">
                            <h3 class="kt-portlet__head-title title="${studentStopPoint[stopPointOrder[i]].address}">
                                ${studentStopPoint[stopPointOrder[i]].name}        
                            </h3>
                        </div>
                    </div>
                    
                </div>`
                //<div class="kt-portlet__body">${studentStopPoint[stopPointOrder[i]].address}</div>
        }
        setSortableData(htmlSortable)
    })
});

Template.studentListInfo.onDestroyed(() => {
    studentIDs = null
});

Template.studentListInfo.events({
    'click input.student-checkbox': clickStudentCheckBox,
})

Template.carStopList_studentListInfo.onRendered(() => {
    L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images/';
    window.carStopmap = L.map('carStopmap', {
        drawControl: true,
        zoomControl: false
    }).setView([21.0388, 105.7886], 14);
    L.tileLayer('https://apis.wemap.asia/raster-tiles/styles/osm-bright/{z}/{x}/{y}@2x.png?key=vpstPRxkBBTLaZkOaCfAHlqXtCR', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(carStopmap);
    setInterval(() => { carStopmap.invalidateSize(); }, 0) //invalidate Size of map
    window.markerGroup = L.layerGroup().addTo(carStopmap); //create markerGroup
})

Template.carStopList_studentListInfo.events({
    /*'mousemove .kt-portlet--sortable': function(event) {
        console.log(1)
    },*/
    'click .confirmButton': confirmPath,
    'click .autoDirect': function(event) {
        
        removeLayerByID(polyID)
        stopPointCoors = DistanceAutoCal([21.040276, 105.782988], stopPointCoors);
        carStopIDs = reArrange(carStopIDs, [], stopPointOrder);
        console.log(carStopIDs)
        drawPath(stopPointCoors)
        htmlSortable = ''
        for (let i = 0; i <=stopPointOrder.length - 1; i++) {
            
            htmlSortable +=
                `<div class="kt-portlet kt-portlet--mobile kt-portlet--sortable" id="${stopPointOrder[i]}">
                    <div class="kt-portlet__head ui-sortable-handle">
                        <div class="kt-portlet__head-label">
                            <h3 class="kt-portlet__head-title title="${studentStopPoint[stopPointOrder[i]].address}">
                                ${studentStopPoint[stopPointOrder[i]].name}        
                            </h3>
                        </div>
                    </div>
                    
                </div>`
                //<div class="kt-portlet__body">${studentStopPoint[stopPointOrder[i]].address}</div>
        }
        setSortableData(htmlSortable)
    },
    'drag .kt-portlet--sortable': dragTab
})

function initClassSelect2() {
    MeteorCall(_METHODS.class.GetAll, null, accessToken).then(result => {
        console.log(result)
        if (result.data) {
            let htmlClassOption = result.data.map(item => `<option value="${item._id}">${item.name}</option>`)
            $('#classSelect').html(htmlClassOption.join('')).select2({
                width: '100%',
                placeholder: "Select class"
            }).on('select2:select', classChangeEvent).trigger('select2:select');
        }
    }).catch(handleError)
}

function classChangeEvent(e) {
    let classID = e.currentTarget.value
    MeteorCall(_METHODS.student.GetByClass, {
        classID
    }, accessToken).then(result => {
        renderStudentTable($('#modalStudentTable'), result, true)
    }).catch(handleError)
}

function renderStudentTable(jqEl, data, type) {
    let htmlTable = data.map((item, index) => htmlRow(item, index, type))
    jqEl.html(htmlTable.join(''))
}

function reloadTable() {
    let studentListID = FlowRouter.getParam("id")
    return MeteorCall(_METHODS.studentList.GetById, {
        _id: studentListID
    }, accessToken).then(result => {
        console.log(result)
        studentIDs = result.studentIDs;
        studentStopPoint = result.carStops;
        carStopIDs = result.carStopIDs;
        defaultCarStop = result.carStopIDs;
        studentStopPoint.map((data, index) => {
            stopPointOrder.push(index);
            setMarker(data.location, data.name)
            stopPointCoors.push(data.location);
        })
        renderStudentTable($('#studentTable'), result.students)
        return result
    }).catch(handleError)
}

function htmlRow(data, index, type = false) {
    return ` <tr studentID="${data._id}">
                <th scope="row">${index}</th>
                <td>${data.IDStudent}</td>
                <td>${data.user.name}</td>
                <td>${data.class?data.class.name:""}</td>
                <td>${data.user.email}</td>
                <td>${data.user.phone}</td>
                
                ${type?`<td>
                            <div class="from-group">
                                <label class="kt-checkbox kt-checkbox--brand">
                                <input type="checkbox" class="student-checkbox" studentID="${data._id}" ${studentIDs.includes(data._id)?'checked':''}>
                                <span></span>
                                </label>
                            </div>
                        </td>`:''}
            </tr>`
}
//event
function clickStudentCheckBox(e) {
    let studentListID = FlowRouter.getParam("id")
    let studentID = e.currentTarget.getAttribute('studentID')
    if (e.currentTarget.checked) {
        MeteorCall(_METHODS.studentList.AddStudentIDs, {
            _id: studentListID,
            studentIDs: [studentID]
        }, accessToken).then(result => {
            handleSuccess('Thêm', 'học sinh')
            reloadTable()
        }).catch(handleError)
    } else {
        MeteorCall(_METHODS.studentList.RemoveStudentIDs, {
            _id: studentListID,
            studentIDs: [studentID]
        }, accessToken).then(result => {
            handleSuccess('Loại', 'học sinh')
            reloadTable()
        }).catch(handleError)
    }

}

function setMarker(arr, des) {
    let mark = L.marker(arr).bindTooltip(des, { permanent: false }).addTo(carStopmap);
}

function setSortableData(str) {
    document.getElementById("kt_sortable_portlets").innerHTML = " ";
    document.getElementById("kt_sortable_portlets").innerHTML += str;
}

function addPoly(arr) {
    let poly = L.polyline(arr, { color: 'blue', weight: 4, opacity: 0.5, smoothFactor: 1 }).addTo(markerGroup);
   
    polyID = markerGroup.getLayerId(poly)
}

function swapPcs(arr){
    let c=arr[1];
    arr[1]=arr[0];
    arr[0]=c;
    return arr;
}

function removeLayerByID(id) {
	markerGroup.eachLayer(function (layer) {
		if (layer._leaflet_id === id){
			markerGroup.removeLayer(layer)
		}
	});	
}

function reArrange(arr1, arr2, idxArr){
    for (let i=0; i<idxArr.length; i++){
        if (arr1[idxArr[i]]!=undefined){
            arr2[i] = arr1[idxArr[i]];
        }
    }
    return arr2;
}

function DistanceAutoCal(dest, coorArr){
    let distance = [];
    let distOrder = [];
    let finalCoorOrder = [];
    for (let i=0; i<coorArr.length; i++){
        distance.push(getDistance(dest,coorArr[i]));
        //console.log(getDistance(dest,coorArr[i]))
        distOrder.push(i);
    }

    distOrder.sort(function (a, b) { return distance[a] < distance[b] ? -1 : distance[a] > distance[b] ? 1 : 0; });
    stopPointOrder = distOrder;
    for (let i=0; i<distOrder.length; i++){
        finalCoorOrder.push(coorArr[distOrder[i]]);
    }
    //console.log(finalCoorOrder);
    return finalCoorOrder;
} //dest: [[lat,lng]] //coorArr: tập hợp các carStop

function getDistance(origin, destination) {
    // return distance in meters
    var lon1 = toRadian(origin[1]),
        lat1 = toRadian(origin[0]),
        lon2 = toRadian(destination[1]),
        lat2 = toRadian(destination[0]);

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
}

function toRadian(degree) {
    return degree*Math.PI/180;
}

function drawPath(arr){
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

function dragTab(event) {
        let targetID = event.target.getAttribute('id'),
            ID_order = [],
            modPos;
        if (event.drag.type === 'dragend') {
            $('.carStopContainer').children('div').each(function() {
                if ($(this).attr('id') != undefined) {
                    if ($(this).attr('id') != targetID) {
                        ID_order.push($(this).attr('id'));
                    }
                } else {
                    ID_order.push(targetID);
                    modPos = ID_order.length - 1; //điểm di chuyển
                }
            })
            if (ID_order != stopPointOrder) {
               console.log(ID_order)
                stopPointCoors = reArrange(defaultStopPoint, [], ID_order)
                carStopIDs = reArrange(defaultCarStop, [], ID_order)
                removeLayerByID(polyID)
                console.log(stopPointCoors)
                console.log(carStopIDs)
                drawPath(stopPointCoors)
            } else {
                console.log(2)
            }
        }
    }

function confirmPath(event) {
    let studentListID = FlowRouter.getParam("id")
    MeteorCall(_METHODS.studentList.Update, { _id: studentListID, carStopIDs: carStopIDs }, accessToken).then(result=>{
        console.log(result)
    }) 
}
//tạo loading modal while drawing path
//confirm button
export {
    drawPath,
    addPoly,
    swapPcs
}