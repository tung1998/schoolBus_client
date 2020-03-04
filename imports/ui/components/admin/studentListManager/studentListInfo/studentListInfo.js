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
let studentStopPoint = [];
let htmlSortable = '';
let stopPointOrder = [];
Template.studentListInfo.onCreated(() => {
    accessToken = Cookies.get('accessToken');
});

Template.studentListInfo.onRendered(() => {
    reloadTable().then(result => {
        console.log($(".ui-sortable")[0])
        setSortableData(htmlSortable)
        initClassSelect2()
        $(".anchorHeight").css({
            "max-height": 400
        })
        console.log(stopPointOrder)
    })

});

Template.studentListInfo.onDestroyed(() => {
    studentIDs = null
});

Template.studentListInfo.events({
    'click input.student-checkbox': clickStudentCheckBox,
})

Template.carStopList_studentListInfo.onCreated(() => {

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
    setInterval(() => { carStopmap.invalidateSize(); }, 0)
    window.markerGroup = L.layerGroup().addTo(carStopmap);
    window.polyGroup = L.LayerGroup("a", { width: 1, height: 1 }).addTo(carStopmap);
    setMarker([21.040276, 105.782988]); //school
    setMarker([21.030443, 105.835688]); //startPoint
})

Template.carStopList_studentListInfo.events({
    'drag .kt-portlet--sortable': function(event, t) {
        if (event.drag.type === 'dragend') {
            let targetID = event.target.getAttribute('id');
            let ID_order = [];
            let modPos;

            $('.carStopContainer').children('div').each(function() {
                if ($(this).attr('id') != undefined) {
                    if ($(this).attr('id') != targetID) {
                        ID_order.push($(this).attr('id'));
                    }
                } else {
                    ID_order.push(targetID);
                    modPos = ID_order.length - 1;
                    //console.log(modPos)
                }
            })

            //console.log(ID_order)
            if (stopPointOrder != ID_order) {
                //console.log(ID_order, modPos)
                let fixPoint1 = ID_order[modPos + 1], //điểm sau điểm sửa
                    fixPoint2 = ID_order[modPos - 1], //điểm trước điểm sửa 1
                    fixPoint3 = ID_order[modPos - 2]; //điểm trước điểm sửa 2
                //console.log(fixPoint1, fixPoint2, fixPoint3)
                coordinates1 = studentStopPoint[fixPoint1];
                coordinates2 = studentStopPoint[fixPoint2];
                coordinates3 = studentStopPoint[fixPoint3];
                //console.log(coordinates1, coordinates2, coordinates3)
                let route = {
                    startLat: coordinates1.location[0],
                    startLng: coordinates1.location[1],
                    desLat: coordinates2.location[0],
                    desLng: coordinates2.location[1]
                }
                addPoly(coordinates1.location, coordinates2.location)
                MeteorCall(_METHODS.wemap.getDrivePath, route, accessToken).then(result => {
                    console.log(result)
                }).catch(handleError)
            }
        }
    }
})

function initClassSelect2() {
    MeteorCall(_METHODS.class.GetAll, null, accessToken).then(result => {
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
        console.log(result);
        studentIDs = result.studentIDs;
        studentStopPoint = result.carStops;
        studentStopPoint.map((data, index) => {
            stopPointOrder.push(index);
            setMarker(data.location)
            htmlSortable +=
                `<div class="kt-portlet kt-portlet--mobile kt-portlet--sortable" id="${index}">
                    <div class="kt-portlet__head ui-sortable-handle">
                        <div class="kt-portlet__head-label">
                            <h3 class="kt-portlet__head-title">
                                ${data.name}        
                            </h3>
                        </div>
                    </div>
                    <div class="kt-portlet__body">${data.address}</div>
                </div>`
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

function setMarker(arr) {
    let mark = L.marker(arr).addTo(markerGroup);
}

function setSortableData(str) {
    document.getElementById("kt_sortable_portlets").innerHTML += str;
}

function addPoly(point1, point2) {
    let poly = L.polyline([point1, point2], { color: 'blue', weight: 8, opacity: 0.5, smoothFactor: 1 }).addTo(markerGroup);
}