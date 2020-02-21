import './schoolManager.html';

const Cookies = require('js-cookie');

import {
    MeteorCall,
    handleError
} from '../../functions'

import {
    _METHODS
} from '../../variableConst'

let accessToken;
Template.schoolManager.onCreated(() => {
    accessToken = Cookies.get('accessToken')
    
})

Template.schoolManager.onRendered(()=>{
    this.computation = Tracker.autorun(()=>{
        renderTableRow();
    })
})

Template.schoolManager.onDestroyed(()=>{
    if(this.computation){
        this.computation.stop();
    }
})

Template.schoolManager.events({
    'click .modify-button': ClickModifyButton,
    'click .confirm-button': ClickConfirmButton,
    'click .add-more': ClickAddmoreButton,
    'click .delete-button': ClickDeleteButton,
})

function ClickModifyButton(e){
    let schoolData = $(e.currentTarget).data("json");
    $("#editSchoolModal").attr("schoolID", schoolData._id);
    $(".modal-title").html("Chỉnh Sửa");
    $(".confirm-button").html("Sửa")
    $("#name-input").val(schoolData.name) ;
    $("#address-input").val(schoolData.address);
    // $("#editSchoolModal").modal("show");
}

function ClickAddmoreButton(e){
    $("#editSchoolModal").attr("schoolID", "");
    $(".modal-title").html("Thêm Mới");
    $(".confirm-button").html("Thêm")
    clearForm();
}

function ClickConfirmButton(){
    let data = {
        name: $("#name-input").val(),
        address:  $("#address-input").val(),
        status: 0
    }
    let modify = $("#editSchoolModal").attr("schoolID");
    if (modify == "") {
        MeteorCall(_METHODS.school.Create, data, accessToken).then(result => {
            // console.log(result);
            // $("#editSchoolModal").modal("hide");
        }).catch(handleError)
    } else {
        data._id = modify;
        MeteorCall(_METHODS.school.Update, data, accessToken).then(result => {
            // console.log(result);
            // $("#editSchoolModal").modal("hide");
        }).catch(handleError)
    }
    renderTableRow();
}

function ClickDeleteButton(e){
    let data = $(e.currentTarget).data("json");
    // console.log(data._id)
    MeteorCall(_METHODS.school.Delete, data, accessToken).then(result => {
        // console.log(result);
        renderTableRow();
    }).catch(handleError)
}

function clearForm(){
    $("#name-input").val("");
    $("#address-input").val("");
}

function renderTableRow(data){
    MeteorCall(_METHODS.school.GetAll, {}, accessToken).then(result => {
        let data = result.data;
        let row = data.map(item => {
        return ` <tr>
                    <th scope="row">${item.name}</th>
                    <td>${item.address}</td>
                    <td>
                    <button type="button" class="btn btn-outline-brand modify-button" data-toggle="modal" data-target="#editSchoolModal" data-json=\'${JSON.stringify(item)}\'>Sửa</button>
                    <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(item)}\'>Xóa</button>
                    </td>
                </tr>`
        })
        $("#table-body").html(row.join(""));
    }).catch(handleError)
}