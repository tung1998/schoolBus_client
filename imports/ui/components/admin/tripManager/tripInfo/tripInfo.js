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

Template.tripDetail.onCreated(() => {
    accessToken = Cookies.get('accessToken')
    tripID = FlowRouter.getParam('tripID')
})

Template.tripDetail.onRendered(() => {
    reloadData()
})

Template.tripDetail.events({
    'click .status-btn': clickStatusButton,
    'click #openScannerModal': clickOpenScannerModal,
    'click .studentRow': clickStudentRow
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