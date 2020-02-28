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
    _METHODS
} from '../../../../../variableConst';

let accessToken

Template.routeInfo.onCreated(() => {
    accessToken = Cookies.get('accessToken');
});

Template.routeInfo.onRendered(() => {
    reloadData();
});

Template.routeInfo.events({
    // 'click #addRouteButton': clickAddRouteButton,
})

function reloadData() {
    let routeID = FlowRouter.getParam('id')
    MeteorCall(_METHODS.route.GetById, {
        _id: routeID
    }, accessToken).then(result => {
        //get info trip
        console.log(result);
        let dataTrip = {
            driverName: result.driver.user.name,
            driverPhone: result.driver.user.phone,
            nannyName: result.nanny.user.name,
            nannyPhone: result.nanny.user.phone,
            carNunberPlate: result.car.numberPlate,
            startTime: result.startTime,
        }

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