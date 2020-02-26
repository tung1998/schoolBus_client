import "./studentManager.html";
import { Session } from "meteor/session";

const Cookies = require("js-cookie");

import { MeteorCall, handleError } from "../../../../functions";

import { _METHODS } from "../../../../variableConst";

let accessToken;

Template.studentManager.onCreated(() => {
  accessToken = Cookies.get("accessToken");
});

Template.studentManager.onRendered(() => {
  reloadTable();
  renderSchoolName();
});

Template.studentManager.events({
  "click .modify-button": ClickModifyButton,
  "click .delete-button": ClickDeleteButton,
  "click .add-more": ClickAddMoreButton,
  "click .school-option": ClickSelectSchoolOption,
  "click .class-option": ClickSelectClassOption,
  "submit form": SubmitForm
});

function renderSchoolName() {
  MeteorCall(_METHODS.school.GetAll, {}, accessToken)
    .then(result => {
      let optionSelects = result.data.map(res => {
        return `<li>
                        <a
                          role="option"
                          class="dropdown-item school-option"
                          id=${res._id}
                          tabindex="0"
                          aria-setsize="6"
                          aria-posinset="1"
                          ><span class="text">${res.name}</span></a
                        >
                      </li>`;
      });
      $("#school-select").html(optionSelects.join(" "));
      renderClassName();
    })
    .catch(handleError);
}

function renderClassName() {
  MeteorCall(_METHODS.class.GetAll, {}, accessToken)
    .then(result => {
      let optionSelects = result.data.map(res => {
        if (res.schoolID == $(".school-option").attr("id")) {
          return `<li>
                        <a
                          role="option"
                          class="dropdown-item class-option"
                          id=${res._id}
                          tabindex="0"
                          aria-setsize="6"
                          aria-posinset="1"
                          ><span class="text">${res.name}</span></a
                        >
                      </li>`;
        }
      });
      $("#class-select").html(optionSelects.join(" "));
    })
    .catch(handleError);
}

function addToTable(dt, result) {
  let data = {
      _id: result._id,
      user: {
          name: dt.name,
          phone: dt.phone,
          email: dt.email
      },
      class: {
          school: {
            name: dt.schoolName
          },
          name: dt.className
      },
      address: dt.address,
      IDStudent: dt.IDStudent
  }
  $("#table-body").prepend(`<tr id=${data._id}>
                                <td scope="row"></td>
                                <td>${data.user.name}</td>
                                <td>${data.address}</td>
                                <td>${data.user.phone}</td>
                                <td>${data.user.email}</td>
                                <td>${data.class.school.name}</td>
                                <td>${data.class.name}</td>
                                <td>${data.IDStudent}</td>
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
        user: {
            name: dt.name,
            phone: dt.phone,
            email: dt.email
        },
        class: {
            school: {
              name: dt.schoolName
            },
            name: dt.className
        },
        address: dt.address,
        IDStudent: dt.IDStudent
    }
  $(`#${data._id}`).html(`    
                            <td scope="row"></td>
                            <td>${data.user.name}</td>
                            <td>${data.address}</td>
                            <td>${data.user.phone}</td>
                            <td>${data.user.email}</td>
                            <td>${data.class.school.name}</td>
                            <td>${data.class.name}</td>
                            <td>${data.IDStudent}</td>
                            <td>
                            <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(
                            data
                            )}\'>Sửa</button>
                            <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(
                            data
                            )}\'>Xóa</button>
                            </td>`
                        );
}

function deleteRow(data) {
  $(`#${data._id}`).remove();
}

async function reloadTable() {
  MeteorCall(_METHODS.students.GetAll, {}, accessToken).then(result => {
    let html = result.data.map(htmlRow);
    $("#table-body").html(html.join(" "));
  });
}

function htmlRow(data) {
  return `<tr id=${data._id}>
            <td scope="row"></td>
            <td>${data.user.name}</td>
            <td>${data.address}</td>
            <td>${data.user.phone}</td>
            <td>${data.user.email}</td>
            <td>${data.class.school.name}</td>
            <td>${data.class.name}</td>
            <td>${data.IDStudent}</td>
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

function ClickSelectSchoolOption(e) {
  let id = $(e.currentTarget).attr("id");
  let school = $(e.currentTarget).text();
  $(".school-result").html(school);
  $(".button-school-selected").attr("title", school);
  $(".school-result").attr("schoolID", id);
}

function ClickSelectClassOption(e) {
  let id = $(e.currentTarget).attr("id");
  let school = $(e.currentTarget).text();
  $(".class-result").html(school);
  $(".button-class-selected").attr("title", school);
  $(".class-result").attr("classID", id);
}

function ClickModifyButton(e) {
  let studentData = $(e.currentTarget).data("json");
  $("#editStudentModal").modal("show");
  $("#editStudentModal").attr("studentID", studentData._id);
  $(".modal-title").html("Chỉnh Sửa");
  $(".confirm-button").html("Sửa");

  $('input[name="IDstudent"]').val(studentData.IDStudent);
  $('input[name="address"]').val(studentData.address);
  $('input[name="name"]').val(studentData.user.name);
  $('input[name="email"]').val(studentData.user.email);
  $('input[name="phone"]').val(studentData.user.phone);
  $(".class-result").attr("classID", studentData.class._id);
  $(".class-result").html(studentData.class.name);
  $(".school-result").attr("schoolID", studentData.class.school._id);
  $(".school-result").html(studentData.class.school.name);
  $('input[name="status"]').val(studentData.status);
}

function ClickAddMoreButton(e) {
  $("#editStudentModal").attr("studentID", "");
  $(".modal-title").html("Thêm Mới");
  $(".confirm-button").html("Thêm");
  clearForm();
}

function ClickDeleteButton(event) {
  let data = $(event.currentTarget).data("json");
  MeteorCall(_METHODS.students.Delete, data, accessToken)
    .then(result => {
        deleteRow(data);
    })
    .catch(handleError);
}

function SubmitForm(event) {
  event.preventDefault();
  let data = {
    IDStudent: $('input[name="IDstudent"]').val(),
    address: $('input[name="address"]').val(),
    name: $('input[name="name"]').val(),
    email: $('input[name="email"]').val(),
    phone: $('input[name="phone"]').val(),
    classID: $(".class-result").attr("classID"),
    status: $('input[name="status"]').val(),
    className: $(".class-result").text(),
    schoolName: $(".school-result").text()
  };

  let modify = $("#editStudentModal").attr("studentID");
  console.log(modify);
  if (modify == "") {
    MeteorCall(_METHODS.students.Create, data, accessToken)
      .then(result => {
        $("#editStudentModal").modal("hide");
        addToTable(data, result)
      })
      .catch(handleError);
  } else {
    data._id = modify;
    MeteorCall(_METHODS.students.Update, data, accessToken)
      .then(result => {
        $("#editStudentModal").modal("hide");
        modifyTable(data)
      })
      .catch(handleError);
  }
}

function clearForm() {
  $('input[name="IDstudent"]').val("");
  $('input[name="address"]').val("");
  $('input[name="name"]').val("");
  $('input[name="email"]').val("");
  $('input[name="phone"]').val("");
  $(".class-result").attr("classID", "");
  $(".class-result").html("Lớp");
  $(".school-result").attr("schoolID", "");
  $(".school-result").html("Trường");
  $('input[name="status"]').val("");
}
