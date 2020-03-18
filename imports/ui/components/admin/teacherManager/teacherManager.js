import "./teacherManager.html";
import {
  Session
} from "meteor/session";
const Cookies = require("js-cookie");

import {
  MeteorCall,
  handleError,
  handleSuccess,
  handleConfirm,
  addRequiredInputLabel,
  addPaging,
  tablePaging,
  getBase64,
  makeID,
  initDropzone
} from "../../../../functions";

import {
  _METHODS,
  LIMIT_DOCUMENT_PAGE,
  _SESSION,
  _URL_images,
} from "../../../../variableConst";


let accessToken;
let currentPage = 1;
let dropzone

Template.teacherManager.onCreated(() => {
  accessToken = Cookies.get("accessToken");
  Session.set(_SESSION.isSuperadmin, true)
  Session.set('schools', [])
});

Template.teacherManager.onRendered(() => {
  addRequiredInputLabel()
  addPaging()
  getLimitDocPerPage()
  reloadTable(1);
  dropzone = initDropzone("#kt_dropzone_1")
  this.dropzone = dropzone

  MeteorCall(_METHODS.user.IsSuperadmin, null, accessToken).then(result => {
    Session.set(_SESSION.isSuperadmin, result)
    if (result)
      initSchoolSelect2()
  }).catch(handleError)
});


Template.teacherManager.onDestroyed(() => {
  dropzone = null
});

Template.teacherManager.events({
  "click .modify-button": ClickModifyButton,
  "click .add-more": ClickAddmoreButton,
  "click .delete-button": ClickDeleteButton,
  "submit form": SubmitForm,
  "click .kt-datatable__pager-link": (e) => {
    reloadTable(parseInt($(e.currentTarget).data('page')), getLimitDocPerPage());
    $(".kt-datatable__pager-link").removeClass("kt-datatable__pager-link--active");
    $(e.currentTarget).addClass("kt-datatable__pager-link--active")
    currentPage = parseInt($(e.currentTarget).data('page'));
  },
  "change #limit-doc": (e) => {
    reloadTable(1, getLimitDocPerPage());
  },
  "click .dz-preview": dzPreviewClick,
});

Template.editTeacherModal.helpers({
  isSuperadmin() {
    return Session.get(_SESSION.isSuperadmin)
  },
  schools() {
    return Session.get('schools')
  },
});

function dzPreviewClick() {
  dropzone.hiddenFileInput.click()
}

function ClickAddmoreButton(e) {
  $("#editTeacherModal").attr("teacherID", "");
  $(".modal-title").html("Thêm Mới");
  $(".confirm-button").html("Thêm");
  $('.avatabox').addClass('kt-hidden')
  clearForm();
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
  $(' #school-select').val(teacherData.school).trigger('change');
  $(' input[name="class"]').val(teacherData.class);

  if (Session.get(_SESSION.isSuperadmin)) {
    $('#school-input').val(teacherData.schoolID).trigger('change')
  }
  //remove ảnh cũ
  if (teacherData.image) {
    imgUrl = `${_URL_images}/${teacherData.image}/0`
    $('#avata').attr('src', imgUrl)
    $('.avatabox').removeClass('kt-hidden')
  } else {
    $('.avatabox').addClass('kt-hidden')
  }
  dropzone.removeAllFiles(true)
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
          reloadTable(currentPage, getLimitDocPerPage())
        }).catch(handleError)
    } else {

    }
  })
}

async function SubmitForm(event) {
  try {
    event.preventDefault();
    if (checkInput()) {
      const target = event.target;
      if (checkInput()) {
        let data = {
          name: target.name.value,
          username: target.phoneNumber.value,
          // address: target.address.value,
          phone: target.phoneNumber.value,
          email: target.email.value,
          password: "12345678",

        };
        if (Session.get(_SESSION.isSuperadmin)) {
          data.schoolID = $('#school-input').val()
          data.schoolName = $('#select2-school-input-container').attr('title')
        }
        let imagePreview = $('#kt_dropzone_1').find('div.dz-image-preview')
        if (imagePreview.length) {
          if (imagePreview.hasClass('dz-success')) {
            let imageId = makeID("user")
            let BASE64 = imagePreview.find('div.dz-image').find('img').attr('src')
            let importImage = await MeteorCall(_METHODS.image.Import, {
              imageId,
              BASE64: [BASE64]
            }, accessToken)
            if (importImage.error)
              handleError(result, "Không tải được ảnh lên server!")
            else data.image = imageId
          }
        }
        let modify = $("#editTeacherModal").attr("teacherID");
        if (modify == "") {
          await MeteorCall(_METHODS.teacher.Create, data, accessToken)
            .then(result => {
              // console.log(result);
              handleSuccess("Thêm", "Giáo viên").then(() => {
                $("#editTeacherModal").modal("hide");
              })
              reloadTable(1, getLimitDocPerPage())
            })
            .catch(handleError);
        } else {
          data._id = modify;
          await MeteorCall(_METHODS.teacher.Update, data, accessToken)
            .then(result => {
              // console.log(result);
              handleSuccess("Cập nhật", "Giáo viên").then(() => {
                $("#editTeacherModal").modal("hide");
              })
              reloadTable(currentPage, getLimitDocPerPage())
            })
            .catch(handleError);
        }
      }
    }
  } catch (error) {
    handleError(error)
  }
}

function checkInput() {
  let name = $("input[name='name']").val();
  let phone = $('input[name="phoneNumber"]').val();
  let email = $('input[name="email"]').val();

  if (!schoolID || !name || !phone || !email) {
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

function clearForm() {
  $(' input[name="name"]').val("");
  // $(' input[name="address"]').val("");
  $(' input[name="phoneNumber"]').val("");
  $(' input[name="email"]').val("");
  $(' input[name="avatar"]').val("");

  if (Session.get(_SESSION.isSuperadmin)) {
    $('#school-input').val('').trigger('change')
  }
  // remove ảnh
  dropzone.removeAllFiles(true)
}

function getLimitDocPerPage() {
  return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
  let table = $('#table-body');
  let emptyWrapper = $('#empty-data');
  table.html('');
  MeteorCall(_METHODS.teacher.GetByPage, {
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
    name: result.user.name,
    username: result.user.username,
    phone: result.user.phone,
    email: result.user.email,
    schoolID: result.schoolID,
    schoolName: result.school.name
  };
  return `
                <td scope="row">${result.index + 1}</td>
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
                </td>`;
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