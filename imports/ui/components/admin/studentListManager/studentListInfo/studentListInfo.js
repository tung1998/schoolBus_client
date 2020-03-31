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
let markers_id = [];
let poly;
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
                `<div class="kt-portlet kt-portlet--mobile addressTab" id="${stopPointOrder[i]}">
                    <div class="kt-portlet__head">
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
        let idx = parseInt(stopPointOrder[stopPointOrder.length - 1])
        setColor(0, "destination", studentStopPoint[stopPointOrder[0]].address);
        setColor(idx, "start", studentStopPoint[idx].address)
    })
});

Template.studentListInfo.onDestroyed(() => {
    studentIDs = null
    document.getElementById("kt_sortable_portlets").innerHTML = '';
    markerGroup.eachLayer((layer) => {
        markerGroup.removeLayer(layer)
    });
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
    'mousemove .addressTab': (event) => {
        event.preventDefault();
        let indx = parseInt($(event.currentTarget).attr("id"));
        let tarMark = carStopmap._layers[markers_id[indx]];
        let latval = tarMark._latlng.lat;
        let lngval = tarMark._latlng.lng;
        tarMark.openPopup();
        window.carStopmap.setView([latval, lngval], 14);
    },
    'click .polyToggle': (event) => {
        event.preventDefault();
        removeLayerByID(polyID);
    }
    /*'click .confirmButton': confirmPath,
    'click .autoDirect': (event)=>{
        
        removeLayerByID(polyID)
        stopPointCoors = DistanceAutoCal([21.040276, 105.782988], stopPointCoors);
        carStopIDs = reArrange(carStopIDs, [], stopPointOrder);
        //console.log(carStopIDs)
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
    'drag .kt-portlet--sortable': dragTab*/
})

Template.carStopList_studentListInfo.onDestroyed(() => {
    carStopList = null
    stopCoor = null
    markers_id = null
    document.getElementById("carStopContainer").innerHTML = '';
    markerGroup.eachLayer((layer) => {
        markerGroup.removeLayer(layer)
    });

})

function initClassSelect2() {
    MeteorCall(_METHODS.class.GetAll, null, accessToken).then(result => {
        //console.log(result)
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
    $(".anchorHeight").css({
        "height": 400
    })
    $(".kt-content").css({
        "padding-bottom": 0
    })
    $(".kt-footer--fixed").css({
        "padding-bottom": 0
    })
    let studentListID = FlowRouter.getParam("id")
    return MeteorCall(_METHODS.studentList.GetById, {
        _id: studentListID
    }, accessToken).then(result => {
        //console.log(result)
        studentIDs = result.studentIDs;
        studentStopPoint = result.carStops;
        carStopIDs = result.carStopIDs;
        defaultCarStop = result.carStopIDs;
        studentStopPoint.map((data, index) => {
            stopPointOrder.push(index);
            setMarker(data.location, data.name, data.address)
            stopPointCoors.push(data.location);
        })
        renderStudentTable($('#studentTable'), result.students)
        return result
    }).catch(handleError)
}

function htmlRow(data, index, type = false) {
    return ` <tr studentID="${data._id}">
                <th scope="row">${index + 1}</th>
                <td>${data.IDStudent}</td>
                <td>${data.user.name}</td>
                <td>${data.class ? data.class.name : ""}</td>
                <td>${data.user.email}</td>
                <td>${data.user.phone}</td>
                
                ${type ? `<td>
                            <div class="from-group">
                                <label class="kt-checkbox kt-checkbox--brand">
                                <input type="checkbox" class="student-checkbox" studentID="${data._id}" ${studentIDs.includes(data._id) ? 'checked' : ''}>
                                <span></span>
                                </label>
                            </div>
                        </td>`: ''}
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

function setMarker(arr, des, address) {
    let mark = L.marker(arr).bindTooltip(des, { permanent: false }).addTo(carStopmap);
    markers_id.push(markerGroup.getLayerId(mark))
    let popup = `
                <div class="font-14">
                    <dl class="row mr-0 mb-0">
                        <dt class="col-sm-3">Tên điểm dừng: </dt>
                        <dt class="col-sm-9">${des}</dt>
                        <dt class="col-sm-3">Địa chỉ: </dt>
                        <dt class="col-sm-9">${address}</dt>
                    </dl>
                </div>
            `
    mark.bindPopup(popup, {
        minWidth: 301
    });
}

function setSortableData(str) {
    document.getElementById("carStopContainer").innerHTML = " ";
    document.getElementById("carStopContainer").innerHTML += str;
}

function addPoly(arr) {
    poly = L.polyline(arr, { color: 'blue', weight: 4, opacity: 0.5, smoothFactor: 1 }).addTo(markerGroup);
    polyID = markerGroup.getLayerId(poly);
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
        addPoly(stopPointCoors)
    }
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
        //addPoly(pol)
    }).catch(handleError);
}


function setColor(id, pos, name) {
    if (pos == 'destination') {
        let element = document.getElementById(`${id}`);
        element.classList.add(`kt-portlet--skin-solid`, `kt-bg-danger`);
    } else if (pos == 'start') {
        let element = document.getElementById(`${id}`);
        element.classList.add(`kt-portlet--skin-solid`, `kt-bg-brand`);
    }
}

function swapPcs(arr){
    let c=arr[1];
    arr[1]=arr[0];
    arr[0]=c;
    return arr;
}

export {
    drawPath,
    addPoly,
    swapPcs,
}