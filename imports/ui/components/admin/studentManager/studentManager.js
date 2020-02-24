import './studentManager.html';
import { Session } from 'meteor/session';

const Cookies = require('js-cookie');

import {
    MeteorCall,
    handleError
} from '../../../../functions'

import {
    _METHODS
} from '../../../../variableConst'


let accessToken
let studentManagerData;
Template.studentManager.onCreated(() => {
    console.log('created')
    accessToken = Cookies.get('accessToken')
    
})

Template.studentManager.onRendered(()=>{
    this.computation = Tracker.autorun(()=>{
        MeteorCall(_METHODS.students.GetAll, {}, accessToken).then(result => {
        studentManagerData = result; 
        console.log(studentManagerData);
        }).catch(err => {
            console.log(err);
        })
    })
})

Template.studentManager.events({
    'click #modify-button': ClickModifyButton,
    'click #confirm-button': ClickConfirmButton,

})

Template.studentManager.onDestroyed(()=>{
    if(this.computation){
        this.computation.stop();
    }
})

function renderTableRow(data){
    let row = ` <tr>
                    <td><img src="/assets/media/users/100_3.jpg" alt="image"></td>
                    <td></td>
                    <td>Larry</td>
                    <td>Larry</td>
                    <td>Larry</td>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                    <td>@twitter</td>
                    <td>
                    <button type="button" class="btn btn-outline-brand" data-toggle="modal"
                        data-target="#editStudentModal">Sửa</button>
                    <button type="button" class="btn btn-outline-danger">Xóa</button>
                    </td>
                </tr>`
}

function ClickModifyButton(e) {
    console.log(e);
    let studentData = $(e.currentTarget).data("json");
    $("#editStudentModal").attr("studentID", studentData._id);
}

function ClickConfirmButton() {
    let name = $("#name-input").val();
    let dateOfBirth = $("#date-input").val();
    let address = $("#address-input").val();
    let phoneNumber = $("#phonenumber-input").val();
    let email = $("#email-input").val();
    let school = $("#school-input").val();
    let className = $("#class-input").val();
    let studentID = $("student-id-input").val();
    
    let data = {
        IDStudent: $("student-id-input").val(),
        address:  $("#address-input").val(),
        name: $("#name-input").val(),
        classID: "15h5cnllty15f",
        status: 0
    }

    console.log(data);

    let modify = $("#editStudentModal").attr("studentID");
    console.log(modify);
    if(!modify){
        MeteorCall(_METHODS.students.Create, data, accessToken).then(result => {
            console.log(result);
        }).catch(handleError)
    } else {
        MeteorCall(_METHODS.students.Update, data, accessToken).then(result => {
            console.log(result);
        }).catch(handleError)
    }
}
