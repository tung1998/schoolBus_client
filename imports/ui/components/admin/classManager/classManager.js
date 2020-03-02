import "./classManager.html";

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

Template.classManager.onCreated(() => {
  accessToken = Cookies.get("accessToken");
});

Template.classManager.onRendered(() => {
  reloadTable();
  renderSchoolName();
  initSelect2();
});

Template.classManager.events({
  "submit form": SubmitForm,
  "click .modify-button": ClickModifyButton,
  "click .add-more": ClickAddmoreButton,
  "click .delete-button": ClickDeleteButton,
  "change #school-select": renderTeacherName,
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

function renderTeacherName() {
  let data = {
    _id: $("#school-select").val()
  };
  MeteorCall(_METHODS.teacher.GetBySchoolID, data, accessToken)
    .then(result => {
      let optionSelects = result.map((key) => {
        return `<option value="${key._id}">${key.user.name}</option>`;
      });
      $("#teacher-select").html(`<option value=""></option>`).append(optionSelects.join(" "));
    })
    .catch(handleError);
}


function ClickModifyButton(event) {
  let classData = $(event.currentTarget).data("json");
  $("#editClassModal").attr("classID", classData._id);
  $(".modal-title").html("Chỉnh Sửa");
  $(".confirm-button").html("Sửa");

  $("input[name='className']").val(classData.name);
  $("#school-select").val(classData.schoolID).trigger('change')
  $("teacher-select").val(classData.teacherID).trigger('change')
  $('#select2-school-select-container').attr('title', classData.schoolName),
    $('#select2-teacher-select-container').attr('title', classData.teacherName)
  $("#editClassModal").modal("show");
}

function ClickAddmoreButton(event) {
  $("#editClassModal").attr("classID", "");
  $(".modal-title").html("Thêm Mới");
  $(".confirm-button").html("Thêm");
  $("#editClassModal").modal("show");
  clearForm();
}

function SubmitForm(event) {
  event.preventDefault();
  const target = event.target;
  let data = {
    name: target.className.value,
    schoolID: $("#school-select").val(),
    teacherID: $("#teacher-select").val(),
    schoolName: $('#select2-school-select-container').attr('title'),
    teacherName: $('#select2-teacher-select-container').attr('title')
  };
  let modify = $("#editClassModal").attr("classID");
  if (modify == "") {

    MeteorCall(_METHODS.class.Create, data, accessToken)
      .then(result => {
        reloadTable()
        handleSuccess("Thêm", "Lớp học").then(() => {
          $("#editClassModal").modal("hide");
        })
      })
      .catch(handleError);
  } else {
    data._id = modify;
    MeteorCall(_METHODS.class.Update, data, accessToken)
      .then(result => {
        handleSuccess("Cập nhật", "Lớp học").then(() => {
          $("#editClassModal").modal("hide");
        })
        reloadTable()
      })
      .catch(handleError);
  }
}

function ClickDeleteButton(event) {
  handleConfirm().then(result => {
    if (result.value) {
      let data = $(event.currentTarget).data("json");
      MMeteorCall(_METHODS.class.Delete, data, accessToken)
      .then(() => {
        Swal.fire({
          icon: "success",
          text: "Đã xóa thành công",
          timer: 3000
        })
      }).catch(handleError)
    } else {

    }
  })
}

async function reloadTable() {
  try {
    let classData = await MeteorCall(_METHODS.class.GetAll, {}, accessToken);
    // let teacherData = await MeteorCall(_METHODS.teacher.GetAll, {
    //   extra: "user"
    // }, accessToken);
    let html = classData.data.map(htmlRow)
    $("#table-body").html(html.join(''))
    // classData.data.map(c => {

    //   let teacher = teacherData.data.map(t => {
    //     if (t._id == c.teacherID) {
    //       return t.user.name
    //     }
    //   })
    //   c.teacherName = teacher;
    //   c.schoolName = c.school.name;
    //   let htmlTable = htmlRow(c);
    //   $("#table-body").append(htmlTable);
    // })
  } catch (err) {
    handleError(err)
  }
}

function htmlRow(result, index) {
  let data = {
    _id: result._id,
    schoolName: result.school.name,
    name: result.name,
    schoolID: result.schoolID,
    teacherID: result.teacherID,
    teacherName: result.teacher.user.name
  }
  return ` <tr id = ${data._id}>
                <th scope="row">${index + 1}</th>
                <td>${data.schoolName}</td>
                <td>${data.name}</td>
                <td>${data.teacherName}</td>
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
  $("input[name='className']").val("");
  $("#school-select").val('').trigger('change')
  $("#teacher-select").val('').trigger('change')
}

function initSelect2() {
  let initSelect2 = [{
      id: 'school-select',
      name: 'Chọn trường'
    },
    {
      id: 'teacher-select',
      name: 'Chọn giáo viên'
    }
  ]
  initSelect2.map((key) => {
    $(`#${key.id}`).select2({
      placeholder: key.name,
      width: '100%'
    })
  })
}