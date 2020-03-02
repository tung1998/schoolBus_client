import "./teacherManager.html";
import { Session } from "meteor/session";
const Cookies = require("js-cookie");

import {
  MeteorCall,
  handleError,
  handleSuccess,
  handleConfirm
 } from "../../../../functions";

import { _METHODS } from "../../../../variableConst";

let accessToken;
Template.teacherManager.onCreated(() => {
  console.log("created");
  accessToken = Cookies.get("accessToken");
});

Template.teacherManager.onRendered(() => {
  reloadTable();
  renderSchoolName();
  initSelect2()
});

Template.teacherManager.helpers({});

Template.teacherManager.events({
  "click .modify-button": ClickModifyButton,
  "click .add-more": ClickAddmoreButton,
  "click .delete-button": ClickDeleteButton,
  "submit form": SubmitForm,
});

function renderSchoolName() {
  MeteorCall(_METHODS.school.GetAll, {}, accessToken)
    .then(result => {
      let optionSelects = result.data.map((key) => {
        return `<option value="${key._id}">${key.name}</option>`;
      });
      $("#school-select").append(optionSelects.join(" "));
    })
    .catch(handleError);
}

function ClickModifyButton(e) {
  let teacherData = $(e.currentTarget).data("json");
  $("#editTeacherModal").attr("teacherID", teacherData._id);
  $(".modal-title").html("Chỉnh Sửa");
  $(".confirm-button").html("Sửa");
  $("#editTeacherModal").modal("show");

  $(' input[name="name"]').val(teacherData.name);
  $(' input[name="phoneNumber"]').val(teacherData.phone);
  $(' input[name="email"]').val(teacherData.email);
  $(' input[name="school"]').val(teacherData.school);
  $(' input[name="class"]').val(teacherData.class);

  $("#school-select").val(teacherData.schoolID).trigger('change')
}

function ClickAddmoreButton(e) {
  $("#editTeacherModal").attr("teacherID", "");
  $(".modal-title").html("Thêm Mới");
  $(".confirm-button").html("Thêm");
  clearForm();
}

function ClickDeleteButton(event) {
  handleConfirm().then(result => {
    if (result.value) {
      let data = $(event.currentTarget).data("json");
      console.log(data);
      MeteorCall(_METHODS.teacher.Delete, data, accessToken)
      .then(result => {
        Swal.fire({
          icon: "success",
          text: "Đã xóa thành công",
          timer: 3000
        })
        reloadTable()
      }).catch(handleError)
    } else {

    }
  })
}

function SubmitForm(event) {
  event.preventDefault();
  const target = event.target;
  let data = {
    name: target.name.value,
    username: target.phoneNumber.value,
    // address: target.address.value,
    phone: target.phoneNumber.value,
    email: target.email.value,
    password: "12345678",
    schoolID: $("#school-select").val(),
    schoolName: $('#select2-school-select-container').attr('title'),
  };
  let modify = $("#editTeacherModal").attr("teacherID");
  if (modify == "") {
    MeteorCall(_METHODS.teacher.Create, data, accessToken)
      .then(result => {
        // console.log(result);
        handleSuccess("Thêm", "Giáo viên").then(() => {
          $("#editTeacherModal").modal("hide");
        })
        reloadTable()
      })
      .catch(handleError);
  } else {
    data._id = modify;
    MeteorCall(_METHODS.teacher.Update, data, accessToken)
      .then(result => {
        // console.log(result);
        handleSuccess("Cập nhật", "Giáo viên").then(() => {
          $("#editTeacherModal").modal("hide");
        })
        reloadTable()
      })
      .catch(handleError);
  }
}

async function reloadTable() {
	try {

		let teacherData = await MeteorCall(_METHODS.teacher.GetAll, { extra: ["school", "user"] }, accessToken)
		// teacherData.data.map(teacher => {
		// 	let schoolName = schoolData.data.map(school => {
		// 		if(school._id == teacher.schoolID){
		// 			return school.name;
		// 		}
		// 	})
		// 	teacher.school = {
		// 		name: schoolName
		// 	}
		// 	let html = htmlRow(teacher);
		// 	$("#table-body").append(html);
    // })
    let html = teacherData.data.map(htmlRow)
    $('#table-body').html(html.join(" "))
	}
    catch(err){
		handleError(err)
	}
}

function htmlRow(result, index) {
  let data = {
    _id: result._id,
    name: result.user.name,
    username: result.user.username,
    phone: result.user.phone,
    email: result.user.email,
    schoolID: result.schoolID,
	  schoolName: result.school.name
  };
  return ` <tr id=${data._id}>
                <td scope="row">${index + 1}</td>
                <td>${data.name}</td>
                <td>${data.username}</td>
                <td>${data.phone}</td>
                <td>${data.email}</td>
                <td>${data.schoolName}</td>
                <td>
                <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(
                  data
                )}\'>Sửa</button>
                <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(
                  data
                )}\'>Xóa</button>
                </td>
            </tr>`;
}

function clearForm() {
  $(' input[name="name"]').val("");
  // $(' input[name="address"]').val("");
  $(' input[name="phoneNumber"]').val("");
  $(' input[name="email"]').val("");
  $(' input[name="avatar"]').val("");

 $('#school-select').val('').trigger('change')
}

function initSelect2() {
  $('#school-select').select2({
    placeholder: "Chọn trường",
    width: "100%"
  })
}