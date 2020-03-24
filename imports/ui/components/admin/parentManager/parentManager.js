import './parentManager.html'

import {
  Session
} from 'meteor/session'

const Cookies = require('js-cookie')

import {
  MeteorCall,
  handleError,
  handleSuccess,
  handleConfirm,
  addRequiredInputLabel,
  addPaging,
  getBase64,
  makeID,
  initDropzone,
  handlePaging

} from '../../../../functions'

import {
  _METHODS,
  _SESSION,
  LIMIT_DOCUMENT_PAGE,
  _URL_images,
} from '../../../../variableConst'

let accessToken;
let currentPage = 1
let dropzone

Template.parentManager.onCreated(() => {
  accessToken = Cookies.get('accessToken')
});

Template.parentManager.onRendered(() => {
  addPaging($('#parentTable'))
  reloadTable()
  addRequiredInputLabel()
  renderSchoolSelect()
  initSelect2()
  dropzone = initDropzone("#kt_dropzone_1")
  this.dropzone = dropzone
})

Template.parentManager.onDestroyed(() => {
  dropzone = null
});

Template.parentManager.events({
  'click #add-button': () => {
    $('.modal-title').html("Thêm phụ huynh mới");
    $('.modal-footer').find('.btn.btn-primary').html("Thêm mới")
    $('#student-info').html('')
    $('.avatabox').addClass('kt-hidden')
    clearForm()
  },
  'click #edit-button': clickEditButton,
  'click .submit-button': clickSubmitButton,
  'click .delete-button': clickDelButton,
  "click .kt-datatable__pager-link": (e) => {
    reloadTable(parseInt($(e.currentTarget).data('page')), getLimitDocPerPage());
    $(".kt-datatable__pager-link").removeClass("kt-datatable__pager-link--active");
    $(e.currentTarget).addClass("kt-datatable__pager-link--active")
    currentPage = parseInt($(e.currentTarget).data('page'));
  },
  "change #limit-doc": (e) => {
    reloadTable(1, getLimitDocPerPage());
  },
  "change #school-select": renderClassSelect,
  "change #class-select": renderStudentSelect,
  "click #edit-student": (e) => {
    $('.kt-portlet__body:eq(2)').show()
  },
  "click .dz-preview": dzPreviewClick,
})

function dzPreviewClick() {
  dropzone.hiddenFileInput.click()
}

function renderSchoolSelect() {
  MeteorCall(_METHODS.school.GetAll, {}, accessToken)
    .then(result => {
      let optionSelects = result.data.map((key) => {
        return `<option value="${key._id}">${key.name}</option>`;
      });
      $("#school-select").append(optionSelects.join(""));
    })
    .catch(handleError);
}

function renderClassSelect() {
  let schoolID = $("#school-select").val()
  MeteorCall(_METHODS.class.GetAll, {}, accessToken)
    .then(result => {
      let optionSelects = result.data.map((key) => {
        if (key.schoolID === schoolID) {
          return `<option value="${key._id}">${key.name}</option>`;
        }
      });

      $("#class-select").html('<option></option>').append(optionSelects.join(" "));
    })
    .catch(handleError);
}

function renderStudentSelect() {
  let classID = $('#class-select').val()
  MeteorCall(_METHODS.student.GetByClass, {
      classID
    }, accessToken)
    .then(result => {
      console.log(result)
      let optionSelects = result.map((key) => {
        return `<option value="${key._id}">${key.user.name}</option>`;
      });

      $("#student-select").html('<option></option>').append(optionSelects.join(" "));
    })
}

function getInputData() {
  let data = {
    name: $('#parent-name').val(),
    phone: $('#parent-phone').val(),
    email: $('#parent-email').val(),
    address: $('#parent-address').val(),
    studentID: $('#student-select').val(),
    username: $('#parent-phone').val(),
    password: '12345678'

  }
  if ($('#parent-id').val()) {
    data._id = $('#parent-id').val()
  }
  return data
}

function clearForm() {
  $('#parent-name').val("")
  $('#parent-phone').val("")
  $('#parent-email').val("")
  $('#parent-address').val("")
  $('#school-select').val("").trigger('change')
  $('#class-select').val("").trigger('change')
  $('#student-select').val("").trigger('change')

  // remove ảnh
  dropzone.removeAllFiles(true)
}

function checkForm() {
  let data = [
    $('#parent-name').val(),
    $('#parent-phone').val(),
    $('#parent-email').val(),
    $('#parent-address').val(),
    $('#student-select').val()
  ]
  let check = true
  data.map((value) => {
    if (!value) {
      check = fasle
    }
  })
  if (check == false) {
    Swal.fire({
      icon: "error",
      text: "Chưa đủ thông tin!",
      timer: 3000
    })
    return false
  }
  return true
}

function clickEditButton(event) {
  //fill data
  let data = $(event.currentTarget).data("json");
  $('#parent-id').val(data._id)

  $('#parent-name').val(data.name)
  $('#parent-phone').val(data.phone)
  $('#parent-email').val(data.email)
  $('#parent-address').val(data.address)

  //remove ảnh cũ
  if (data.image) {
    imgUrl = `${_URL_images}/${data.image}/0`
    $('#avata').attr('src', imgUrl)
    $('.avatabox').removeClass('kt-hidden')
  } else {
    $('.avatabox').addClass('kt-hidden')
  }
  dropzone.removeAllFiles(true)

  //edit modal
  $('.modal-title').html(`Cập nhật thông tin phụ huynh: ${data.name}`);
  $('.modal-footer').find('.btn.btn-primary').html("Cập nhật")
  $('.kt-portlet__body:eq(2)').hide()
  $('#parent-student').find('span').html(`<a href="#" id="edit-student">Sửa &nbsp;<i class="fas fa-pen"></i></a>`)
  $('#student-info').html(
    `<h6>Họ và tên: ${data.studentName}</h6><h6>Lớp: ${data.className}</h6><h6>Trường: ${data.schoolName}</h6>`
  )

}

async function clickSubmitButton(event) {
  event.preventDefault();
  try {
    if (checkForm()) {
      let data = getInputData()
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
      if (!data._id) {
        await MeteorCall(_METHODS.Parent.Create, data, accessToken)
        console.log("đã thêm mới");
        handleSuccess("Thêm", `phụ huynh: ${data.name}`).then(() => {
          $('#editparentModal').modal("hide")
        })

      } else {
        await MeteorCall(_METHODS.Parent.Update, data, accessToken)
        handleSuccess("Cập nhật", `phụ huynh: ${data.name}`).then(() => {
          $('#editparentModal').modal("hide")
        })
        console.log("đã update");
      }
      reloadTable(1, getLimitDocPerPage())
      clearForm()
    }
  } catch (eror) {
    handleError(error)
  }
}

function clickDelButton(event) {
  handleConfirm().then(result => {
    if (result.value) {
      let data = $(event.currentTarget).data("json");
      MeteorCall(_METHODS.Parent.Delete, data, accessToken).then(result => {
        Swal.fire({
          icon: "success",
          text: "Đã xóa thành công",
          timer: 3000
        })
        reloadTable(currentPage, getLimitDocPerPage())
      }).catch(handleError)
    }
  })
}

function initSelect2() {
  let initSelect2 = [{
      id: 'school-select',
      name: 'Chọn trường'
    },
    {
      id: 'class-select',
      name: 'Chọn lớp'
    },
    {
      id: 'student-select',
      name: 'Chọn học sinh'
    }
  ]
  initSelect2.map((key) => {
    $(`#${key.id}`).select2({
      placeholder: key.name,
      width: '100%',
      formatNoMatches: function () {
        return "No Results Found <a href='#' class='btn btn-danger'>Use it anyway</a>";
      }
    })
  })
}

function getLimitDocPerPage() {
  return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
  let table = $('#table-body');
  MeteorCall(_METHODS.Parent.GetByPage, {
    page: page,
    limit: limitDocPerPage
  }, accessToken).then(result => {
    handlePaging(table, result.count, page, limitDocPerPage)
    createTable(table, result, limitDocPerPage)
  })

}

function createTable(table, result, limitDocPerPage) {
  let htmlRow = result.data.map((key, index) => {
    key.index = index + (result.page - 1) * limitDocPerPage;
    return createRow(key);
  })
  table.html(htmlRow.join(''))
}

function createRow(result) {
  let data = {
    _id: result._id,
    image: result.user.image,
    name: result.user.name,
    username: result.user.username,
    phone: result.user.phone,
    email: result.user.email,
    address: result.student.address,
    studentID: result.studentID,
    studentName: result.student.user.name,
    className: result.student.class.name,
    schoolName: result.student.class.school.name,
  }
  return ` <tr id="${data._id}">
              <th scope="row">${result.index + 1}</th>
              <td>${data.name}</td>
              <td>${data.username}</td>
              <td>${data.phone}</td>
              <td>${data.email}</td>
              <td>${data.address}</td>
              <td>${data.studentName}</td>
              <td>
                  <button type="button" class="btn btn-outline-brand dz-remove" data-toggle="modal" id="edit-button" data-target="#editParentModal" data-json=\'${JSON.stringify(data)}\'>Sửa</button>
                  <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(data)}\'>Xóa</button>
              </td>
            </tr>
          `
}