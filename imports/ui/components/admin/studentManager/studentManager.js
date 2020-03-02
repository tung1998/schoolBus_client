import "./studentManager.html";
import {
  Session
} from "meteor/session";

const Cookies = require("js-cookie");

import {
  MeteorCall,
  handleError,
  handleSuccess,
  handleConfirm
} from "../../../../functions";

import {
  _METHODS
} from "../../../../variableConst";

let accessToken;

Template.studentManager.onCreated(() => {
  accessToken = Cookies.get("accessToken");
});

Template.studentManager.onRendered(() => {
  reloadTable();
  renderSchoolName();
  renderCarStopID();
  initSelect2()
});

Template.studentManager.events({
  "click .modify-button": ClickModifyButton,
  "click .delete-button": ClickDeleteButton,
  "click .add-more": ClickAddMoreButton,
  "submit form": SubmitForm,
  "change #student-school": renderClassName
});

function renderSchoolName() {
  MeteorCall(_METHODS.school.GetAll, {}, accessToken)
    .then(result => {
      let optionSelects = result.data.map((key) => {
        return `<option value="${key._id}">${key.name}</option>`;
      });
      $("#student-school").append(optionSelects.join(""));
    })
    .catch(handleError);
}

function renderClassName() {
  MeteorCall(_METHODS.class.GetAll, {}, accessToken)
    .then(result => {
      let optionSelects = result.data.map((key) => {
        if (key.schoolID === $('#student-school').val()) {
          return `<option value="${key._id}">${key.name}</option>`;
        }
      });

      $("#student-class").html('<option></option>').append(optionSelects.join(" "));
    })
    .catch(handleError);
}

function renderCarStopID() {
  MeteorCall(_METHODS.carStop.GetAll, {}, accessToken).then(result => {
    let select = $('#student-carStopID')

    let optionSelects = result.data.map((key) => {
      return `<option value="${key._id}">${key.name}</option>`
    })
    select.append(optionSelects.join(""))
  })
}

function addToTable(dt, result) {
  let data = {
    _id: result._id,
    name: dt.name,
    phone: dt.phone,
    email: dt.email,
    classID: dt.classID,
    schooID: dt.schoolID,
    className: $('#select2-student-class-container').text(),
    schoolName: $('#select2-student-school-container').text(),
    carStop: $('#select2-student-carStopID-container').text(),
    address: dt.address,
    IDStudent: dt.IDStudent,
    status: dt.status
  }
  $("#table-body").prepend(`<tr id=${data._id}>
                                <td>${data.name}</td>
                                <td>${data.address}</td>
                                <td>${data.phone}</td>
                                <td>${data.email}</td>
                                <td>${data.schoolName}</td>
                                <td>${data.className}</td>
                                <td>${data.IDStudent}</td>
                                <td>${data.carStop}</td>
                                <td>
                                <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(
                                data
                                )}\'>Sửa</button>
                                <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(
                                data
                                )}\'>Xóa</button>
                                </td>
                            </tr>`);
}

function modifyTable(dt) {
  let data = {
    _id: dt._id,
    name: dt.name,
    phone: dt.phone,
    email: dt.email,
    classID: dt.classID,
    schooID: dt.schoolID,
    className: $('#select2-student-class-container').text(),
    schoolName: $('#select2-student-school-container').text(),
    carStop: $('#select2-student-carStopID-container').text(),
    address: dt.address,
    IDStudent: dt.IDStudent,
    status: dt.status
  }
  $(`#${data._id}`).html(`    
                            <td>${data.name}</td>
                            <td>${data.address}</td>
                            <td>${data.phone}</td>
                            <td>${data.email}</td>
                            <td>${data.schoolName}</td>
                            <td>${data.className}</td>
                            <td>${data.IDStudent}</td>
                            <td>${data.carStop}</td>
                            <td>
                              <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(
                              data
                              )}\'>Sửa</button>
                              <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(
                              data
                              )}\'>Xóa</button>
                            </td>`);
}

function deleteRow(data) {
  $(`#${data._id}`).remove();
}

async function reloadTable() {
  MeteorCall(_METHODS.student.GetAll, {}, accessToken).then(result => {
    let html = result.data.map(htmlRow);
    $("#table-body").html(html.join(" "));
  });
}

function htmlRow(result, index) {
  let data = {
    _id: result._id,
    name: result.user.name,
    address: result.address,
    phone: result.user.phone,
    email: result.user.email,
    schoolID: result.class.school._id,
    schoolName: result.class.school.name,
    classID: result.class._id,
    className: result.class.name,
    IDStudent: result.IDStudent,
    carStopID: result.carStopID,
    carStop: result.carStop.name,
    status: result.status
  }
  return `<tr id=${data._id}>
            <td>${data.name}</td>
            <td>${data.address}</td>
            <td>${data.phone}</td>
            <td>${data.email}</td>
            <td>${data.schoolName}</td>
            <td>${data.className}</td>
            <td>${data.IDStudent}</td>
            <td>${data.carStop}</td>
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

function ClickModifyButton(e) {
  let studentData = $(e.currentTarget).data("json");
  $("#editStudentModal").modal("show");
  $("#editStudentModal").attr("studentID", studentData._id);
  $(".modal-title").html("Chỉnh Sửa");
  $(".confirm-button").html("Sửa");

  $('input[name="IDstudent"]').val(studentData.IDStudent);
  $('input[name="address"]').val(studentData.address);
  $('input[name="name"]').val(studentData.name);
  $('input[name="email"]').val(studentData.email);
  $('input[name="phone"]').val(studentData.phone);
  $('#student-school').val(studentData.schoolID).trigger('change')
  // $('#student-class').val(studentData.classID).trigger('change')
  $('#student-carStopID').val(studentData.carStopID).trigger('change')
  $('input[name="status"]').val(studentData.status);
}

function ClickAddMoreButton(e) {
  $("#editStudentModal").attr("studentID", "");
  $(".modal-title").html("Thêm Mới");
  $(".confirm-button").html("Thêm");
  clearForm();
}

function ClickDeleteButton(event) {
  handleConfirm().then(result => {
    console.log(result);
    if (result.value) {
      let data = $(event.currentTarget).data("json");
      MeteorCall(_METHODS.student.Delete, data, accessToken).then(result => {
        console.log(result);
        Swal.fire({
          icon: "success",
          text: "Đã xóa thành công",
          timer: 3000
        })
        deleteRow(data)
      }).catch(handleError)
    } else {

    }
  })
}

function SubmitForm(event) {
  event.preventDefault();
  let data = {
    IDStudent: $('input[name="IDstudent"]').val(),
    address: $('input[name="address"]').val(),
    name: $('input[name="name"]').val(),
    email: $('input[name="email"]').val(),
    phone: $('input[name="phone"]').val(),
    status: $('input[name="status"]').val(),
    carStopID: $('#student-carStopID').val(),
    classID: $('#student-class').val(),
    schoolID: $('#student-school').val()
  };
  let modify = $("#editStudentModal").attr("studentID");

  if (modify == "") {
    MeteorCall(_METHODS.student.Create, data, accessToken)
      .then(result => {
        handleSuccess("Thêm", "học sinh").then(() => {
          // $("#editStudentModal").modal("hide");
        })
        addToTable(data, result)
        clearForm()
      })
      .catch(handleError);
  } else {
    data._id = modify;
    MeteorCall(_METHODS.student.Update, data, accessToken)
      .then(result => {
        handleSuccess("Cập nhật", "học sinh").then(() => {
          $("#editStudentModal").modal("hide");
        })
        modifyTable(data)
        
      })
      .catch(handleError);
  }
}

function clearForm() {
  $('input[name="IDstudent"]').val("");
  $('input[name="name"]').val("");
  $('input[name="address"]').val("");
  $('input[name="email"]').val("");
  $('input[name="phone"]').val("");
  $('#student-school').val("").trigger('change')
  $('#student-class').val("").trigger('change')
  $('#student-carStopID').val("").trigger('change')
  $('input[name="status"]').val("");
}

function initSelect2() {
  let initSelect2 = [
    {
      id: 'student-school',
      name: 'Chọn trường'
    },
    {
      id: 'student-class',
      name: 'Chọn lớp'
    },
    {
      id: 'student-carStopID',
      name: 'Chọn điểm đón, trả'
    }
  ]
  initSelect2.map((key) => {
    $(`#${key.id}`).select2({
      placeholder: key.name,
      width: '100%'
    })
  })


}