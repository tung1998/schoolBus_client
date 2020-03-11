import "./teacherManager.html";
import {
  Session
} from "meteor/session";
const Cookies = require("js-cookie");

import {
<<<<<<< HEAD
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
  LIMIT_DOCUMENT_PAGE
=======
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm,
    addRequiredInputLabel,
    addPaging,
    tablePaging,
    getBase64,
    makeID
} from "../../../../functions";

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE
>>>>>>> 4bf349f1eaefa2beaef4b9ad702809ce61bbb600
} from "../../../../variableConst";


let accessToken;
let currentPage = 1;

Template.teacherManager.onCreated(() => {
    console.log("created");
    accessToken = Cookies.get("accessToken");
});

Template.teacherManager.onRendered(() => {
<<<<<<< HEAD
  addRequiredInputLabel()
  addPaging(),
  getLimitDocPerPage()
  reloadTable(1);
  renderSchoolName();
  initSelect2()
  initDropzone(".add-more", ".modify-button")
=======
    addRequiredInputLabel()
    addPaging(),
        getLimitDocPerPage()
    reloadTable(1);
    renderSchoolName();
    initSelect2()
>>>>>>> 4bf349f1eaefa2beaef4b9ad702809ce61bbb600
});

Template.teacherManager.helpers({});

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
    }
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
<<<<<<< HEAD
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

  $("#school-select").val(teacherData.schoolID).trigger('change')
  //remove ảnh cũ
  $('div.dropzone-previews').find('div.dz-preview').find('div.dz-image').find('img').attr('src', `http://123.24.137.209:3000/images/${studentData.image}/0`)
  $('div.dropzone-previews').find('div.dz-image-preview').remove()
  $('div.dz-preview').show()
  $('.dropzone-msg-title').html("Kéo ảnh hoặc click để chọn ảnh.")
=======
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

    $("#school-select").val(teacherData.schoolID).trigger('change')
>>>>>>> 4bf349f1eaefa2beaef4b9ad702809ce61bbb600
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
                    reloadTable(currentPage, getLimitDocPerPage())
                }).catch(handleError)
        } else {

        }
    })
}

async function SubmitForm(event) {
<<<<<<< HEAD
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
          schoolID: $("#school-select").val(),
          schoolName: $('#select2-school-select-container').attr('title'),
        };

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
=======
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
                    schoolID: $("#school-select").val(),
                    schoolName: $('#select2-school-select-container').attr('title'),
                };

                if ($('#teacher-image').val()) {
                    let imageId = makeID("user")
                    let BASE64 = await getBase64($('#teacher-image')[0].files[0])
                    let importImage = await MeteorCall(_METHODS.image.Import, {
                        imageId,
                        BASE64: [BASE64]
                    }, accessToken)
                    if (importImage.error)
                        handleError(result, "Không tải được ảnh lên server!")
                    else data.image = imageId
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
>>>>>>> 4bf349f1eaefa2beaef4b9ad702809ce61bbb600
        }
    } catch (error) {
        handleError(error)
    }
<<<<<<< HEAD
  } catch (error) {
    handleError(error)
  }
=======
>>>>>>> 4bf349f1eaefa2beaef4b9ad702809ce61bbb600

}

function checkInput() {
<<<<<<< HEAD
  let name = $("input[name='name']").val();
  let phone = $('input[name="phoneNumber"]').val();
  let email = $('input[name="email"]').val();
  let schoolID = $("#school-select").val();

  if (!schoolID || !name || !phone || !email) {
    Swal.fire({
      icon: "error",
      text: "Làm ơn điền đầy đủ thông tin",
      timer: 3000
    })
    return false;
  } else {
    return true;
  }
=======
    let name = $("input[name='name']").val();
    let phone = $('input[name="phoneNumber"]').val();
    let email = $('input[name="email"]').val();
    let schoolID = $("#school-select").val();

    if (!schoolID || !name || !phone || !email) {
        Swal.fire({
            icon: "error",
            text: "Làm ơn điền đầy đủ thông tin",
            timer: 3000
        })
        return false;
    } else {
        return true;
    }
>>>>>>> 4bf349f1eaefa2beaef4b9ad702809ce61bbb600

}

function clearForm() {
    $(' input[name="name"]').val("");
    // $(' input[name="address"]').val("");
    $(' input[name="phoneNumber"]').val("");
    $(' input[name="email"]').val("");
    $(' input[name="avatar"]').val("");

<<<<<<< HEAD
  $('#school-select').val('').trigger('change')

  // remove ảnh
  $('div.dropzone-previews').find('div.dz-preview').find('div.dz-image').find('img').attr('src', '')
=======
    $('#school-select').val('').trigger('change')
>>>>>>> 4bf349f1eaefa2beaef4b9ad702809ce61bbb600
}

function initSelect2() {
    $('#school-select').select2({
        placeholder: "Chọn trường",
        width: "100%"
    })
}


function getLimitDocPerPage() {
<<<<<<< HEAD
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
=======
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
    let table = $('#table-body');
    let emptyWrapper = $('#empty-data');
    table.html('');
    MeteorCall(_METHODS.teacher.GetByPage, { page: page, limit: limitDocPerPage }, accessToken).then(result => {
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
>>>>>>> 4bf349f1eaefa2beaef4b9ad702809ce61bbb600

}

function renderTable(data, page = 1) {
<<<<<<< HEAD
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
=======
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
>>>>>>> 4bf349f1eaefa2beaef4b9ad702809ce61bbb600
        <tr id="${data._id}">
          ${data_row}
        </tr>
        `
}

function dataRow(result) {
<<<<<<< HEAD
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
                <td scope="row"></td>
=======
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
                <td scope="row">${result.index}</td>
>>>>>>> 4bf349f1eaefa2beaef4b9ad702809ce61bbb600
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