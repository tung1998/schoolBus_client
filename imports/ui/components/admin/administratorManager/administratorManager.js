import './administratorManager.html'

const Cookies = require('js-cookie');

import {
    MeteorCall,
    handleError
} from '../../functions'

import {
    _METHODS
} from '../../variableConst'

let accessToken;

Template.administratorManager.onCreated(() => {
    accessToken = Cookies.get('accessToken')
    
})

Template.administratorManager.onRendered(() => {
    this.computation = Tracker.autorun(()=>{
        renderTableRow();
    })
    
})

Template.administratorManager.onDestroyed(()=>{
    if(this.computation) {
        this.computation.stop();
    }
})

Template.administratorManager.events({
    'submit form': SubmitForm,
    'click .modify-button': ClickModifyButton,
    'click .add-more': ClickAddmoreButton,
    'click .delete-button': ClickDeleteButton,
})

function ClickModifyButton(event){
    let adminData = $(event.currentTarget).data("json");
    $("#editStudentModal").attr("adminID", adminData._id);
    $(".modal-title").html("Chỉnh Sửa");
    $(".confirm-button").html("Sửa")
    $("#name-input").val(adminData.name);
    $("#address-input").val(adminData.address);
    $("#phonenumber-input").val(adminData.phone);
    $("#email-input").val(adminData.email);
    $("#admintype-input").val(adminData.adminType);
}

function ClickAddmoreButton(event){
    $("#editStudentModal").attr("adminID", "");
    $(".modal-title").html("Thêm Mới");
    $(".confirm-button").html("Thêm")
    clearForm();
}

function SubmitForm(event){
    event.preventDefault();
    const target = event.target;
    let data = {
        name: target.name.value,
        // dob: target.dob.value,
        address: target.address.value,
        phone: target.phoneNumber.value,
        email: target.email.value,
        adminType: target.adminType.value,
        //avatar: target.adminType

    }
    let modify = $("#editStudentModal").attr("adminID");
    if (modify == "") {
        MeteorCall(_METHODS.admin.Create, data, accessToken).then(result => {
            // console.log(result);
            renderTableRow();
            // $("#editSchoolModal").modal("hide");
        }).catch(handleError)
    } else {
        data._id = modify;
        MeteorCall(_METHODS.admin.Update, data, accessToken).then(result => {
            console.log(result);
            renderTableRow();
            // $("#editSchoolModal").modal("hide");
        }).catch(handleError)
    }
    
}

function ClickDeleteButton(event){
    let data = $(event.currentTarget).data("json");
    MeteorCall(_METHODS.admin.Delete, data, accessToken).then(result => {
        // console.log(result);
        renderTableRow();
    }).catch(handleError)
    renderTableRow();
}

function renderTableRow(){
    MeteorCall(_METHODS.admin.GetAll, {extra: "user"}, accessToken).then(result => {
        let data = result.data;
        let row = data.map((item, i)=>{
            let dt = {
                name: item.user.name,
                _id: item._id,
                adminType: item.adminType,
                username: item.user.username,
                phone: item.user.phone,
                email: item.user.email,
            };
            return ` <tr>
                        <th scope="row">${i+1}</th>
                        <td>${dt.name}</td>
                        <td>${dt.username}</td>
                        <td>${dt.phone}</td>
                        <td>${dt.email}</td>
                        <td>${dt.adminType}</td>
                        <td>
                            <button type="button" class="btn btn-outline-brand modify-button" data-toggle="modal" data-target="#editStudentModal" data-json=\'${JSON.stringify(dt)}\'>Sửa</button>
                            <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(dt)}\'>Xóa</button>
                        </td>
                    </tr>`
        })
        $("#table-body").html(row.join(" "));
    }).catch(handleError)
}

function clearForm(){
    $("#name-input").val("");
    $("#address-input").val("");
    $("#phonenumber-input").val("");
    $("#email-input").val("");
    $("#admintype-input").val("");
}