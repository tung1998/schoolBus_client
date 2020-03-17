import "./classManager.html";

const Cookies = require("js-cookie");

import {
  MeteorCall,
  handleError,
  handleSuccess,
  handleConfirm,
  addRequiredInputLabel,
  addPaging,
  tablePaging
} from "../../../../functions";

import {
  _METHODS,
  LIMIT_DOCUMENT_PAGE,
  _SESSION,
  _URL_images,
} from "../../../../variableConst";

let accessToken;
let currentPage = 1;

Template.classManager.onCreated(() => {
  accessToken = Cookies.get("accessToken");
  Session.set(_SESSION.isSuperadmin, true)
  Session.set('schools', [])
});

Template.classManager.onRendered(() => {
  addPaging();
  reloadTable();
  addRequiredInputLabel();
  MeteorCall(_METHODS.user.IsSuperadmin, null, accessToken).then(result => {
    Session.set(_SESSION.isSuperadmin, result)
    console.log(result);
    if (result) {
      initSchoolSelect2()
    } else {
      initTeacherSelect2()
    }
  }).catch(handleError)
});

Template.classManager.events({
  "submit form": SubmitForm,
  "click .modify-button": ClickModifyButton,
  "click .add-more": ClickAddmoreButton,
  "click .delete-button": ClickDeleteButton,
  "change #school-input": renderTeacherName,
  "click .kt-datatable__pager-link": (e) => {
    reloadTable(parseInt($(e.currentTarget).data('page')), getLimitDocPerPage());
    $(".kt-datatable__pager-link").removeClass("kt-datatable__pager-link--active");
    $(e.currentTarget).addClass("kt-datatable__pager-link--active")
    currentPage = parseInt($(e.currentTarget).data('page'));
  },
  "change #limit-doc": (e) => {
    reloadTable(1, getLimitDocPerPage());
  }
});

Template.editClassModal.helpers({
  isSuperadmin() {
    return Session.get(_SESSION.isSuperadmin)
  },
  schools() {
    return Session.get('schools')
  },
});


function renderTeacherName() {
  let _id = $('#school-input').val()
  MeteorCall(_METHODS.teacher.GetBySchoolID, {
      _id
    }, accessToken)
    .then(result => {
      let optionSelects = result.map((key) => {
        return `<option value="${key._id}">${key.user.name}</option>`;
      });
      $("#teacher-select").html(`<option value=""></option>`).append(optionSelects.join(" "));
      $("#teacher-select").select2({
        placeholder: "Chọn giáo viên",
        width: "100%"
      })
    })
    .catch(handleError)

}

function ClickAddmoreButton(event) {
  $("#editClassModal").attr("classID", "");
  $(".modal-title").html("Thêm Mới");
  $(".confirm-button").html("Thêm");
  $("#editClassModal").modal("show");
  clearForm();
}

function ClickModifyButton(event) {
  let classData = $(event.currentTarget).data("json");
  $("#editClassModal").attr("classID", classData._id);
  $(".modal-title").html("Chỉnh Sửa");
  $(".confirm-button").html("Sửa");

  $("input[name='className']").val(classData.name);
  $("teacher-select").val(classData.teacherID).trigger('change')
  if (Session.get(_SESSION.isSuperadmin)) {
    $('#school-input').val(teacherData.schoolID).trigger('change')
  }
  $("#editClassModal").modal("show");
}

function SubmitForm(event) {
  event.preventDefault();
  const target = event.target;
  if (checkInput()) {
    let data = {
      name: target.className.value,
      schoolID: $("#school-select").val(),
      teacherID: $("#teacher-select").val(),
      teacherName: $('#select2-teacher-select-container').attr('title')
    };
    if (Session.get(_SESSION.isSuperadmin)) {
      data.schoolID = $('#school-input').val()
      data.schoolName = $('#select2-school-select-container').attr('title')
    }
    let modify = $("#editClassModal").attr("classID");
    if (modify == "") {
      MeteorCall(_METHODS.class.Create, data, accessToken)
        .then(result => {
          reloadTable(1, getLimitDocPerPage())
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
          reloadTable(currentPage, getLimitDocPerPage())
        })
        .catch(handleError);
    }
  }

}

function checkInput() {
  let name = $('#class-name').val();
  let teacherID = $('#teacher-select').val()

  if (!name || !teacherID) {
    Swal.fire({
      icon: "error",
      text: "Chưa đủ thông tin!",
      timer: 3000
    })
    return false;
  } else {
    if (Session.get(_SESSION.isSuperadmin)) {
      let schoolID = $('#school-input').val()
      if (!schoolID) {
        Swal.fire({
          icon: "error",
          text: "Chưa chọn trường!",
          timer: 2000
        })
        return false;
      }

    }
    return true;
  }

}

function ClickDeleteButton(event) {
  handleConfirm().then(result => {
    if (result.value) {
      let data = $(event.currentTarget).data("json");
      MeteorCall(_METHODS.class.Delete, data, accessToken)
        .then(() => {
          Swal.fire({
            icon: "success",
            text: "Đã xóa thành công",
            timer: 3000
          })
          reloadTable(currentPage, getLimitDocPerPage())
        }).catch(handleError)
    } else {

    }
  })
}

function clearForm() {
  $("input[name='className']").val("");
  $("#teacher-select").val('').trigger('change')
  if (Session.get(_SESSION.isSuperadmin)) {
    $('#school-input').val('').trigger('change')
  }
}

function getLimitDocPerPage() {
  return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
  let table = $('#table-body');
  let emptyWrapper = $('#empty-data');
  table.html('');
  MeteorCall(_METHODS.class.GetByPage, {
    page: page,
    limit: limitDocPerPage
  }, accessToken).then(result => {
    console.log(result)
    tablePaging(".tablePaging", result.count, page, limitDocPerPage)
    $("#paging-detail").html(`Hiển thị ${limitDocPerPage} bản ghi`)
    if (result.count === 0) {
      $('.tablePaging').addClass('d-none');
      table.parent().addClass('d-none');
      emptyWrapper.removeClass('d-none');
    } else if (result.count > limitDocPerPage) {
      $('.tablePaging').removeClass('d-none');
      table.parent().removeClass('d-none');
      emptyWrapper.addClass('d-none');
      // update số bản ghi
    } else {
      $('.tablePaging').addClass('d-none');
      table.parent().removeClass('d-none');
      emptyWrapper.addClass('d-none');
    }
    createTable(table, result, limitDocPerPage)
  })

}

function renderTable(data, page = 1) {
  let table = $('#table-body');
  let emptyWrapper = $('#empty-data');
  table.html('');
  tablePaging('.tablePaging', data.count, page);
  if (carStops.count === 0) {
    $('.tablePaging').addClass('d-none');
    table.parent().addClass('d-none');
    emptyWrapper.removeClass('d-none');
  } else {
    $('.tablePaging').addClass('d-none');
    table.parent().removeClass('d-none');
    emptyWrapper.addClass('d-none');
  }

  createTable(table, data);
}

function createTable(table, result, limitDocPerPage) {
  result.data.forEach((key, index) => {
    key.index = index + (result.page - 1) * limitDocPerPage;
    const row = createRow(key);
    table.append(row);
  });
}

function createRow(data) {
  const data_row = dataRow(data);
  // _id is tripID
  return `
        <tr id="${data._id}">
          ${data_row}
        </tr>
        `
}

function dataRow(result) {
  let data = {
    _id: result._id,
    schoolName: result.school.name,
    name: result.name,
    schoolID: result.schoolID,
    teacherID: result.teacherID,
    teacherName: result.teacher.user.name
  }
  return `
                <th scope="row">${result.index}</th>
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
    `;
}

function initSchoolSelect2() {
  MeteorCall(_METHODS.school.GetAll, null, accessToken).then(result => {
    Session.set('schools', result.data)
    $('#school-input').select2({
      width: '100%',
      placeholder: "Chọn trường"
    })
  }).catch(handleError)
}

function initTeacherSelect2() {
  MeteorCall(_METHODS.teacher.GetAll, {
    extra: 'user'
  }, accessToken).then(result => {
    let optionSelects = result.data.map((key) => {
      return `<option value="${key._id}">${key.user.name}</option>`;
    });
    $("#teacher-select").html(`<option value=""></option>`).append(optionSelects.join(" "));
    $("#teacher-select").select2({
      placeholder: "Chọn giáo viên",
      width: "100%"
    })
  }).catch(handleError)
}