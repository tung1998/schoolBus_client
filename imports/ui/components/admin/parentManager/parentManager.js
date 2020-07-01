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
let dropzone;
let localSchool;
Template.parentManager.onCreated(() => {
  accessToken = Cookies.get('accessToken')
  Session.set('schools', [])
  Session.set('class', [])
  Session.set('students', [])
});

Template.parentManager.onRendered(() => {
  addPaging($('#parentTable'))
  initSelect2()
  this.checkIsSuperAdmin = Tracker.autorun(() => {
    if (Session.get(_SESSION.isSuperadmin)) {
      initSchoolSelect2()
    } else
      getClassData()
  })
  addRequiredInputLabel()
  reloadTable()
  dropzone = initDropzone("#kt_dropzone_1")
  this.dropzone = dropzone
})

Template.parentManager.onDestroyed(() => {
  dropzone = null
  if(this.checkIsSuperAdmin) this.checkIsSuperAdmin = null
  Session.delete('schools')
  Session.delete('class')
  Session.delete('students')
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
  "change #school-select": getClassData,
  "change #class-select": getStudentData,
  "click #addStudent": addStudentClick,
  "click .delete-tudent-btn ": deleteStudentClick,
  "click .dz-preview": dzPreviewClick,
})

Template.editParentModal.helpers({
  isSuperadmin() {
    return Session.get(_SESSION.isSuperadmin)
  },
  schools() {
    return Session.get('schools')
  },
  class() {
    return Session.get('class')
  },
  students() {
    return Session.get('students')
  },
});

Template.parentFilter.onRendered(() => {
  $('#school-filter').select2({
    width: "100%",
    placeholder: "Chọn"
  })
})

Template.parentFilter.helpers({
  isSuperadmin() {
    return Session.get(_SESSION.isSuperadmin)
  },
  schools() {
    return Session.get('schools')
  },
});

Template.parentFilter.events({
  'click #filter-button': parentFilter,
  'click #refresh-button': refreshFilter,
  'keypress .filter-input': (e) => {
    if (e.which === 13 || e.keyCode == 13) {
      parentFilter()
    }
  },
  'change #school-filter': (e) => {
    let options = [{
      text: "adminType",
      value: $('#school-filter').val()
    }]
    reloadTable(1, getLimitDocPerPage(), options)
  }
})


function dzPreviewClick() {
  dropzone.hiddenFileInput.click()
}

function initSchoolSelect2() {
  MeteorCall(_METHODS.school.GetAll, null, accessToken).then(result => {
    Session.set('schools', result.data)
    $('#school-select').select2({
      width: '100%',
      placeholder: 'Chọn trường'
    })
  }).catch(handleError)
}

function getClassData() {
  let schoolID = $("#school-select").val()
  MeteorCall(_METHODS.class.GetAll, {}, accessToken).then(result => {
    if (schoolID)
      result.data = result.data.filter(item => item.schoolID == schoolID)
    Session.set('class', result.data)
  }).catch(handleError);
}

function getStudentData() {
  let classID = $('#class-select').val()
  MeteorCall(_METHODS.student.GetByClass, {
    classID
  }, accessToken).then(result => {
    Session.set('students', result)
  })
}

function getInputData() {
  let data = {
    name: $('#parent-name').val(),
    phone: $('#parent-phone').val(),
    email: $('#parent-email').val(),
    address: $('#parent-address').val(),
    studentIDs: [],
    username: $('#parent-phone').val(),
    password: '12345678'
  }
  $('#student-info').find('li').each((index, item) => {
    data.studentIDs.push(item.getAttribute('studentID'))
  })
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
    $('#student-info').children().length
  ]
  let check = true
  data.map((value) => {
    if (!value) {
      check = false
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

  studentHtml = data.students.map(item => `<li studentID="${item._id}">${item.user.name} - ${item.class.name} - ${item.school.name}
                                          <button type="button" class="delete-tudent-btn btn btn-outline-hover-danger btn-sm btn-icon btn-circle">
                                            <i class="flaticon2-delete"></i>
                                          </button>
                                        </li>`)
  $('#student-info').html(studentHtml.join(''))

}

async function clickSubmitButton(event) {
  event.preventDefault();
  if (checkForm())
    try {
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
        handleSuccess(`Thêm phụ huynh: ${data.name}`)

      } else {
        await MeteorCall(_METHODS.Parent.Update, data, accessToken)
        handleSuccess(`Cập nhật phụ huynh: ${data.name}`)
      }
      $('#editparentModal').modal("hide")
      reloadTable(1, getLimitDocPerPage())
      clearForm()
    } catch (error) {
      handleError(error)
    }
  else handleError(null, "Vui lòng điền đầy đủ thông tin")
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
    id: 'class-select',
    name: 'Chọn lớp'
  }, {
    id: 'student-select',
    name: 'Chọn học sinh'
  }]
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

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE, options = null) {
  let table = $('#table-body');
  MeteorCall(_METHODS.Parent.GetByPage, {
    page: page,
    limit: limitDocPerPage,
    options
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
  let students = result.students
  let studentHtml
  if (Session.get(_SESSION.isSuperadmin)) {
    studentHtml = students.map(item => `<li>${item.user?item.user.name||'':''} - ${item.class?item.class.name||'':''} - ${item.school?item.school.name||'':''}</li>`)
  } else {
    studentHtml = students.filter(item => item.schoolID = Session.get(_SESSION.schoolID))
      .map(item => `<li studentID="${item._id}">${item.user?item.user.name||'':''} - ${item.class?item.class.name||'':''} - ${item.school?item.school.name||'':''} </li>`)
  }
  let data = {
    _id: result._id,
    image: result.user.image,
    name: result.user.name,
    username: result.user.username,
    phone: result.user.phone,
    email: result.user.email,
    address: result.address || '',
    studentIDs: result.studentIDs,
    students: result.students,
  }
  return ` <tr id="${data._id}">
              <th scope="row">${result.index + 1}</th>
              <td>${data.name}</td>
              <td>${data.phone}</td>
              <td>${data.email}</td>
              <td>${data.address}</td>
              <td>
                <ul>${studentHtml.join('')}</ul>
              </td>
              <td>
                  <button type="button" class="btn btn-sm btn-outline-brand dz-remove" data-toggle="modal" id="edit-button" data-target="#editParentModal" data-json=\'${JSON.stringify(data)}\'>Sửa</button>
                  <button type="button" class="btn btn-sm btn-outline-danger delete-button" data-json=\'${JSON.stringify(data)}\'>Xóa</button>
              </td>
            </tr>
          `
}

function addStudentClick(e) {
  let schoolName = $('#school-select option:selected').text()
  let className = $('#class-select option:selected').text()
  let studentID = $('#student-select').val()
  let studentName = $('#student-select option:selected').text().split(" - ")[0];
  if (schoolName == ""){
    localSchool = Session.get('students')[0].user.school.name;
    schoolName = localSchool;
  }
  if (!schoolName || !className || !studentID) {
    handleError(null, 'Vui lòng chọn học sinh')
    return false
  }

  $('#student-info').append(`<li studentID="${studentID}">${studentName} - ${className} - ${schoolName}
                                <button type="button" class="delete-tudent-btn btn btn-outline-hover-danger btn-sm btn-icon btn-circle">
                                  <i class="flaticon2-delete"></i>
                                </button>
                              </li>`)
}

function deleteStudentClick(e) {
  $(e.currentTarget).parent().remove()
}


function parentFilter() {
  let options = [{
    text: "schoolID",
    value: $('#school-filter').val()
  }, {
    text: "user/name",
    value: $('#name-filter').val()
  }, {
    text: "user/phone",
    value: $('#phone-filter').val()
  }, {
    text: "user/email",
    value: $('#email-filter').val()
  }]
  reloadTable(1, getLimitDocPerPage(), options)
}

function refreshFilter() {
  $('#school-filter').val('').trigger('change')
  $('#name-filter').val('')
  $('#phone-filter').val('')
  $('#email-filter').val('')

  reloadTable(1, getLimitDocPerPage(), null)
}