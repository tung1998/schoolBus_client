import "./teacherManager.html";
import { Session } from "meteor/session";
const Cookies = require("js-cookie");

import { MeteorCall, handleError } from "../../../../functions";

import { _METHODS } from "../../../../variableConst";

let accessToken;
Template.teacherManager.onCreated(() => {
  console.log("created");
  accessToken = Cookies.get("accessToken");
});

Template.teacherManager.onRendered(() => {
  Tracker.autorun(()=>{
      reloadTable();
  }) 
});

Template.teacherManager.helpers({});

Template.teacherManager.events({
  "click .modify-button": ClickModifyButton,
  "click .add-more": ClickAddmoreButton,
  "click .delete-button": ClickDeleteButton,
  "submit form": SubmitForm
});

function ClickModifyButton(e) {
  let teacherData = $(e.currentTarget).data("json");
  $("#editTeacherModal").attr("teacherID", teacherData._id);
  $(".modal-title").html("Chỉnh Sửa");
  $(".confirm-button").html("Sửa");
  $("#editTeacherModal").modal("show");
  $(' input[name="password"]').parent().parent().hide();

  $(' input[name="name"]').val(teacherData.name);
  $(' input[name="username"]').val(teacherData.username);
//   $(' input[name="password"]').val(teacherData.password);
  $(' input[name="phoneNumber"]').val(teacherData.phone);
  $(' input[name="email"]').val(teacherData.email);
  $(' input[name="school"]').val(teacherData.school);
  $(' input[name="class"]').val(teacherData.class);
  // $(' input[name="avatar"]').val("");
}

function ClickAddmoreButton(e) {
  $("#editTeacherModal").attr("teacherID", "");
  $(".modal-title").html("Thêm Mới");
  $(".confirm-button").html("Thêm");
  console.log("add");
  clearForm();
}

function ClickDeleteButton(e) {
  let data = $(e.currentTarget).data("json");
  // console.log(data._id)
  MeteorCall(_METHODS.teacher.Delete, data, accessToken)
    .then(result => {
      // console.log(result);
      deleteRow(data)
    })
    .catch(handleError);
}

function SubmitForm(event) {
  event.preventDefault();
  const target = event.target;
  let data = {
    name: target.name.value,
    username: target.username.value,
    // address: target.address.value,
    phone: target.phoneNumber.value,
    email: target.email.value,
    password: target.password.value
    // schoolID: "5e536a220a36ed5f0c2a5b88"
  };
  console.log(data);
  let modify = $("#editTeacherModal").attr("teacherID");
  if (modify == "") {
    MeteorCall(_METHODS.teacher.Create, data, accessToken)
      .then(result => {
        // console.log(result);
        $("#editTeacherModal").modal("hide");
        addToTable(data, result)
      })
      .catch(handleError);
  } else {
    data._id = modify;
    MeteorCall(_METHODS.teacher.Update, data, accessToken)
      .then(result => {
        // console.log(result);
        $("#editTeacherModal").modal("hide");
        modifyTable(data)
      })
      .catch(handleError);
  }
}

function addToTable(data, result){
    data._id = result._id;
    $("#table-body").prepend(`<tr id=${result._id}>
                                <th scope="row"></th>
                                <td>${data.name}</td>
                                <td>${data.username}</td>
                                <td>${data.phone}</td>
                                <td>${data.email}</td>
                                <td>Trường</td>
                                <td>Lớp</td>
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
                                <td scope="row"></td>
                                <td>${data.name}</td>
                                <td>${data.username}</td>
                                <td>${data.phone}</td>
                                <td>${data.email}</td>
                                <td>Trường</td>
                                <td>Lớp</td>
                                <td>
                                <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(
                                    data
                                )}\'>Sửa</button>
                                <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(
                                    data
                                )}\'>Xóa</button>
                                </td>
                            `
        )
}

function deleteRow(data){
    $(`#${data._id}`).remove();
}

function reloadTable() {
  MeteorCall(_METHODS.teacher.GetAll, { extra: "user" }, accessToken)
    .then(result => {
      console.log(result);
      let htmlTable = result.data.map(htmlRow);
      $("#table-body").html(htmlTable.join(" "));
    })
    .catch(handleError);
}

function htmlRow(data) {
  let dt = {
    name: data.user.name,
    _id: data._id,
    username: data.user.username,
    phone: data.user.phone,
    email: data.user.email
  };
  return ` <tr id=${dt._id}>
                <td scope="row"></td>
                <td>${dt.name}</td>
                <td>${dt.username}</td>
                <td>${dt.phone}</td>
                <td>${dt.email}</td>
                <td>Trường</td>
                <td>Lớp</td>
                <td>
                <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(
                  dt
                )}\'>Sửa</button>
                <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(
                  dt
                )}\'>Xóa</button>
                </td>
            </tr>`;
}

function clearForm() {
  $(' input[name="name"]').val("");
  $(' input[name="username"]').val("");
  // $(' input[name="address"]').val("");
  $(' input[name="phoneNumber"]').val("");
  $(' input[name="email"]').val("");
  $(' input[name="school"]').val("");
  $(' input[name="class"]').val("");
  $(' input[name="avatar"]').val("");
}
