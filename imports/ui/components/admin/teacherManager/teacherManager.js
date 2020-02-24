import './teacherManager.html';
import { Session } from 'meteor/session'
const Cookies = require('js-cookie');

import {
    MeteorCall,
    handleError
} from '../../functions'

import {
    _METHODS
} from '../../variableConst'

let accessToken
let index
Template.teacherManager.onCreated(() => {
    console.log('created')
    accessToken = Cookies.get('accessToken')
})

Template.teacherManager.onRendered(() => {
    MeteorCall(_METHODS.teacher.GetAll, {}, accessToken).then(result => {
        if ($(document).ready) {
            let wrap = document.getElementById('tableBody')
            for (let i = 0; i < result.data.length; i++) {
                /*wrap.appendChild(`<tr id='${i}'>
                <th scope="row">3</th>
                <td>${result.data[i].name}</td>
                <td>dob</td>
                <td>address</td>
                <td>phoneNumber</td>
                <td>email</td>
                <td>school</td>
                <td></td>
                <td>
                  <button type="button" class="btn btn-outline-brand" data-toggle="modal" data-target="#editTeacherModal">Sửa</button>
                  <button type="button" class="btn btn-outline-danger">Xóa</button>
                </td>
                </tr>`)*/
                $('#tableBody').append(
                    `<tr id='${i}'>
                        <th scope="row">3</th>
                        <td>${result.data[i].name}</td>
                        <td>dob</td>
                        <td>address</td>
                        <td>phoneNumber</td>
                        <td>email</td>
                        <td>school</td>
                        <td></td>
                    <td>
                    <button type="button" class="btn btn-outline-brand" data-toggle="modal" data-target="#editTeacherModal">Sửa</button>
                    <button type="button" class="btn btn-outline-danger">Xóa</button>
                    </td>
                    </tr>`)
            }
        }
    }).catch(handleError)
})

Template.teacherManager.helpers({

})
Template.editTeacherModal.events({
    'submit form': function(event) {
        event.preventDefault();
        const target = event.target;
        let teacher = {
            name: target.name.value,
            dob: target.dob.value,
            address: target.address.value,
            phoneNumber: target.phoneNumber.value,
            email: target.email.value,
            school: target.school.value,
            class: target.class.value,
            //avatar: target.adminType
        }
        appendTeacher(teacher)
        let accessToken = Cookies.get('accessToken')
        MeteorCall(_METHODS.teacher.Create, teacher, accessToken).then(result => {
            console.log(result.length)
        }).catch(handleError)
    }
})

//function getAllList(){
//  MeteorCall(_METHODS)
//}
console.log(index)

function appendTeacher(teacher) {
    if ($(document).ready) {
        let count = $("tableBody").children().length
        console.log(count)
        $('#tableBody').append(
            `<tr>
                <th scope="row">3</th>
                <td>${teacher.name}</td>
                <td>dob</td>
                <td>address</td>
                <td>phoneNumber</td>
                <td>email</td>
                <td>school</td>
                <td></td>
            <td>
            <button type="button" class="btn btn-outline-brand" data-toggle="modal" data-target="#editTeacherModal">Sửa</button>
            <button type="button" class="btn btn-outline-danger">Xóa</button>
            </td>
            </tr>`)
    }
}