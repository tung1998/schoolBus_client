import './schoolManager.html';

const Cookies = require('js-cookie');

import {
    MeteorCall,
    handleError
} from '../../../../functions'

import {
    _METHODS
} from '../../../../variableConst'

let accessToken;
Template.schoolManager.onCreated(() => {
    accessToken = Cookies.get('accessToken')
    
})

Template.schoolManager.onRendered(()=>{
    reloadTable();
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
    $("#editSchoolModal").modal("show");
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
            console.log(result);
            // console.log(data);
            $("#editSchoolModal").modal("hide");
            addToTable(data, result);
        }).catch(handleError)
    } else {
        data._id = modify;
        MeteorCall(_METHODS.school.Update, data, accessToken).then(result => {
            // console.log(result);
            $("#editSchoolModal").modal("hide");
            modifyTable(data);
        }).catch(handleError)
    }
}

function ClickDeleteButton(e){
    let data = $(e.currentTarget).data("json");
    // console.log(data._id)
    MeteorCall(_METHODS.school.Delete, data, accessToken).then(result => {
        // console.log(result);
        deleteRow(data);
    }).catch(handleError)
}

function addToTable(data, result){
    data._id = result._id;
    $("#table-body").prepend(`<tr id=${result._id}>
                                <td>${data.name}</td>
                                <td>${data.address}</td>
                                <td>
                                    <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(
                                        data
                                    )}\'>Sửa</button>
                                    <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(
                                        data
                                    )}\'>Xóa</button>
                                </td>
                            </tr>`
    )
}

function modifyTable(data){
    $(`#${data._id}`).html(`    
                                <td>${data.name}</td>
                                <td>${data.address}</td>
                                <td>
                                    <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(
                                        data
                                    )}\'>Sửa</button>
                                    <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(
                                        data
                                    )}\'>Xóa</button>
                                </td>`
        )
}

function deleteRow(data){
    $(`#${data._id}`).remove();
}

function reloadTable(){
    MeteorCall(_METHODS.school.GetAll, {}, accessToken).then(result => {
        let htmlTable = result.data.map(htmlRow);
        $("#table-body").html(htmlTable.join(" "));
    }).catch(handleError)
}

function htmlRow(data){
        let item = {
            _id: data._id,
            name: data.name,
            address: data.address
        }
        return ` <tr id=${item._id}>
                    <td>${item.name}</td>
                    <td>${item.address}</td>
                    <td>
                    <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(item)}\'>Sửa</button>
                    <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(item)}\'>Xóa</button>
                    </td>
                </tr>`
}

function clearForm(){
    $("#name-input").val("");
    $("#address-input").val("");
}