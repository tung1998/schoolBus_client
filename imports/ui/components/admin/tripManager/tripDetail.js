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
    _METHODS,
    _TRIP_STUDENT
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
    'click .status-btn': clickStatusButton,

})

function clickStatusButton(e) {
    let target = e.currentTarget
    let tripID = target.getAttribute('tripID')
    let studentID = target.getAttribute('studentID')
    let status = Number(target.getAttribute('status'))
    MeteorCall(_METHODS.trip.Attendace, {
        tripID,
        status,
        studentID
    }, accessToken).then(result => {
        handleSuccess('Cập nhật', "tình trạng học sinh")
        reloadData()
    }).catch(handleError)
}

function reloadData() {
    let tripID = FlowRouter.getParam('tripID')
    MeteorCall(_METHODS.trip.GetById, {
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
        let dataStudent = result.students
        let table = $('#table-studentList')
        let row = dataStudent.map((key, index) => {
            let studentInfo = {
                _id: key.studentID,
                IDStudent: key.student.IDStudent,
                name: key.student.user.name,
                phone: key.student.user.phone,
                class: key.student.class.name,
                teacher: key.student.class.teacher.user.name,
                school: key.student.class.school.name,
                schoolAddress: key.student.class.school.address,
                status: key.status
            }

            let buttonHtml = ''
            switch (key.status) {
                case 0:
                    buttonHtml = `<button type="button" class="btn btn-success status-btn" tripID="${tripID}" studentID="${key.studentID}" status="1" >Điểm danh</button>
                                    <button type="button" class="btn btn-danger status-btn" tripID="${tripID}" studentID="${key.studentID}" status="3">Vắng mặt</button>`
                    break
                case 1:
                    buttonHtml = `<button type="button" class="btn btn-success status-btn" tripID="${tripID}" studentID="${key.studentID}" status="2">Xuống xe</button>`
                    break
                case 2:
                    buttonHtml = `<span class="kt-badge kt-badge--success kt-badge--inline">Đã xuống xe</span>`
                    break
                case 3:
                    buttonHtml = `<span class="kt-badge kt-badge--danger kt-badge--inline">Vắng mặt</span>`
                    break
                default:
                    buttonHtml = ``
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
                            ${buttonHtml}
                        </td>
                </tr>`
        })
        table.find("tbody").html(row.join(""))

    }).catch(handleError)
}