import './tripDetail.html'

import {
    FlowRouter
} from 'meteor/kadira:flow-router';

const Cookies = require('js-cookie');

import {
    MeteorCall,
    handleError,
    handleConfirm,
    handleSuccess
} from '../../../../functions';

import {
    _METHODS
} from '../../../../variableConst';

let accessToken
let status = 0

Template.tripDetail.onCreated(() => {
    accessToken = Cookies.get('accessToken')
})

Template.tripDetail.onRendered(() => {
    reloadData()
})

Template.tripDetail.events({
    'click #attendance-button': clickAttendanceButton,
    'click #cancel-attendance-button': clickCancelAttendanceButton,

})

function clickAttendanceButton(event) {

}

function clickCancelAttendanceButton(event) {
    
}

function reloadData() {
    let tripID = FlowRouter.getParam('tripID')
    MeteorCall(_METHODS.trip.GetById, {_id: tripID}, accessToken).then(result => {
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
        let dataStudent = result.route.studentList.students
        let table = $('#table-studentList')
        let row = dataStudent.map((key, index) => {
            let studentInfo = {
                _id: key._id,
                IDStudent: key.IDStudent,
                name: key.user.name,
                phone: key.user.phone,
                class: key.class.name,
                teacher: key.class.teacher.user.name,
                school: key.class.school.name,
                schoolAddress: key.class.school.address,
                status: key.status
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
                        <td>
                            <button type="button" class="btn btn-success" id="attendance-button">Điểm danh</button>
                            <button type="button" class="btn btn-danger disabled" id="cancel-attendance-button" disabled>Hủy</button>
                        </td>
                </tr>`
        })
        table.find("tbody").html(row.join(""))

    }).catch(handleError)
}
