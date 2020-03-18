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
  tablePaging,
  getBase64,
  makeID,
  initDropzone

} from '../../../../functions'

import {
  _METHODS,
  LIMIT_DOCUMENT_PAGE
} from '../../../../variableConst'

let accessToken;
let currentPage = 1

Template.parentManager.onCreated(() => {
  accessToken = Cookies.get('accessToken')
});

Template.parentManager.onRendered(() => {
  addPaging()
  reloadTable(1, getLimitDocPerPage())
  addRequiredInputLabel()
  initDropzone('#add-button', '#edit-button')
  renderSchoolSelect()
  initSelect2()
})

Template.parentManager.events({
  'click #add-button': () => {
    $('.modal-title').html("Thêm phụ huynh mới");
    $('.modal-footer').find('.btn.btn-primary').html("Thêm mới")
    $('#student-info').html('')
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
  }
})


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
  $('div.dropzone-previews').find('div.dz-preview').find('div.dz-image').find('img').attr('src', '')
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

  //ảnh
  $('div.dropzone-previews').find('div.dz-preview').find('div.dz-image').find('img').attr('src', `http://123.24.137.209:3000/images/${data.image}/0`)
  $('div.dropzone-previews').find('div.dz-image-preview').remove()
  $('div.dz-preview').show()
  $('.dropzone-msg-title').html("Kéo ảnh hoặc click để chọn ảnh.")

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
      let imagePreview = $('div.dropzone-previews').find('div.dz-image-preview')
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
  let emptyWrapper = $('#empty-data');
  table.html('');
  MeteorCall(_METHODS.Parent.GetByPage, {
      page: page,
      limit: limitDocPerPage
  }, accessToken).then(result => {
    console.log(result);
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
  let parent = {
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
  return `
              <th scope="row"></th>
              <td>${parent.name}</td>
              <td>${parent.username}</td>
              <td>${parent.phone}</td>
              <td>${parent.email}</td>
              <td>${parent.address}</td>
              <td>${parent.studentName}</td>
              <td>
                  <button type="button" class="btn btn-outline-brand dz-remove" data-toggle="modal" id="edit-button" data-target="#editParentModal" data-json=\'${JSON.stringify(parent)}\'>Sửa</button>
                  <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(parent)}\'>Xóa</button>
              </td>
          `
}