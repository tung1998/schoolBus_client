import "./userManger.html";

import {
  MeteorCall,
  handleError,
  handleSuccess,
  handleConfirm,
  handlePromp,
  addRequiredInputLabel,
  addPaging,
  makeID,
  initDropzone,
  handlePaging,
  getJsonDefault,
} from "../../../../functions";
import {
  _METHODS,
  LIMIT_DOCUMENT_PAGE,
  _SESSION,
  _URL_images,
  _USER,
} from "../../../../variableConst";
const Cookies = require("js-cookie");

let accessToken;
let currentPage = 1;
let dropzone;

Template.userManager.onCreated(() => {
  accessToken = Cookies.get("accessToken");
  Session.set(_SESSION.isSuperadmin, Session.get(_SESSION.isSuperadmin));
  Session.set("schools", []);
  Session.set('listUser', [])
});

Template.userManager.onRendered(() => {
  if (Session.get(_SESSION.isSuperadmin)) initSchoolSelect2();

  addRequiredInputLabel();
  addPaging($("#userTable"));
  reloadTable();

  dropzone = initDropzone("#user-dropzone");
});

Template.userManager.helpers({
  listUser() {
    return Session.get('listUser')
  }
});

Template.userManager.onDestroyed(() => {
  dropzone = null;
  Session.delete('listUser')
});

Template.userManager.events({
  "click #password-confirm-button": submitChangePassword,
  "click #user-confirm-button": submitEditUser,
  "click #block-confirm-button": submitBlockUser,
  "click .block-user": clickBlockUser,
  "click .unblock-user": clickUnBlockUser,
  "click .edit-user": clickEditUser,
  "click .send-noti": clickSendNoti,
  "click .delete-user": clickDeleteUser,
  "click .change-password": (e) => {
    let userID = e.currentTarget.getAttribute("userID")
    $("#password").val('');
    $("#confirm-password").val('')
    $("#user-changepass-id").val(userID);
  },
  "click #user-checkbox-all": (e) => {
    let checkAll = $("#user-checkbox-all").prop("checked");
    if (checkAll) {
      $(".user-checkbox").prop("checked", true);
    } else {
      $(".user-checkbox").prop("checked", false);
    }
  },
  "click .user-checkbox": (e) => {
    if ($(".user-checkbox:checked").length == $(".user-checkbox").length) {
      $("#user-checkbox-all").prop("checked", true);
    } else {
      $("#user-checkbox-all").prop("checked", false);
    }
  },
  "click .kt-datatable__pager-link": (e) => {
    reloadTable(
      parseInt($(e.currentTarget).data("page")),
      getLimitDocPerPage()
    );
    $(".kt-datatable__pager-link").removeClass(
      "kt-datatable__pager-link--active"
    );
    $(e.currentTarget).addClass("kt-datatable__pager-link--active");
    currentPage = parseInt($(e.currentTarget).data("page"));
    $("#user-checkbox-all").prop("checked", false);
  },
  "change #limit-doc": (e) => {
    reloadTable(1, getLimitDocPerPage());
  },
  "click .dz-preview": dzPreviewClick,
  "click #reset-password": resetPassword,
});

Template.userFilter.onRendered(() => {
  $("#school-filter").select2({
    placeholder: "Chọn",
    width: "100%",
  });
});

Template.userFilter.helpers({
  isSuperadmin() {
    return Session.get(_SESSION.isSuperadmin);
  },
  schools() {
    return Session.get("schools");
  },
});

Template.userFilter.events({
  "click #filter-button": userFilter,
  "click #refresh-button": refreshFilter,
  "keypress .filter-input": (e) => {
    if (e.which === 13 || e.keyCode == 13) {
      userFilter();
    }
  },
  "change #school-filter": (e) => {
    let options = [{
      text: "schoolID",
      value: $("#school-filter").val(),
    },];
    reloadTable(1, getLimitDocPerPage(), options);
  },
});

Template.userRow.helpers({
  index() {
    return (currentPage - 1) * 10 + this.index + 1
  },
  userType() {
    return getJsonDefault(_USER.type, "number", this.userInfo.userType)
  }
});

function dzPreviewClick() {
  dropzone.hiddenFileInput.click();
}

function checkNewPass(string1, string2) {
  if (string1 == string2) {
    return true;
  } else return false;
}

function submitChangePassword(event) {
  let newPass = $("#password").val();
  let confirmation = $("#confirm-password").val();

  if (checkNewPass(newPass, confirmation)) {
    MeteorCall(_METHODS.user.UpdateUserPassword, {
      userID: $("#user-changepass-id").val(),
      password: newPass,
    }, accessToken)
      .then((result) => {
        $('#editPasswordModal').modal('hide')
        $("#password").val('');
        $("#confirm-password").val('')
        handleSuccess("Đã đổi mật khẩu");
      })
      .catch(handleError);
  } else {
    handleError(null, "Xác nhận mật khẩu sai!");
  }
}

function clickEditUser(e) {
  let userID = e.currentTarget.getAttribute("userID")
  let listUser = Session.get('listUser')
  userData = listUser.filter(item => item._id == userID)[0]
  $("#editUserModal").modal("show");
  $("#user-id").val(userID);

  $("#phone").val(userData.phone);
  $("#name").val(userData.name);
  $("#email").val(userData.email);
  if (userData.image) {
    imgUrl = `${_URL_images}/${userData.image}/0`;
    $("#avata").attr("src", imgUrl);
    $(".avatabox").removeClass("kt-hidden");
  } else {
    $(".avatabox").addClass("kt-hidden");
  }
  dropzone.removeAllFiles(true);
}

function clickSendNoti(e) {
  let userID = e.currentTarget.getAttribute("userID")
  // if(!userID)

  $("#sendNotiModal").modal("show").attr("userID", userID);
}

async function submitEditUser() {
  try {
    if (checkInput()) {
      let data = {
        _id: $("#user-id").val(),
        name: $("#name").val(),
        phone: $("#phone").val(),
        email: $("#email").val(),
      };

      let imagePreview = $("#user-dropzone").find("div.dz-image-preview");
      if (imagePreview.length) {
        if (imagePreview.hasClass("dz-success")) {
          let imageId = makeID("user");
          let BASE64 = imagePreview
            .find("div.dz-image")
            .find("img")
            .attr("src");
          let importImage = await MeteorCall(
            _METHODS.image.Import, {
            imageId,
            BASE64: [BASE64],
          },
            accessToken
          );
          if (importImage.error)
            handleError(result, "Không tải được ảnh lên server!");
          else data.image = imageId;
        }
      }

      MeteorCall(_METHODS.user.Update, data, accessToken).then((result) => {
        handleSuccess("Sửa").then(() => {
          $("#editUserModal").modal("hide");
          reloadTable(1, getLimitDocPerPage());
          clearForm();
        });
      });
    }
  } catch (error) { }
}

function clickBlockUser(e) {
  let userID = e.currentTarget.getAttribute("userID")
  $("#blockUserModal").modal("show");

  $("#user-id").val(userID);
  $("#reason-block").val("");
}

function submitBlockUser() {
  if ($("#reason-block").val()) {
    let data = {
      _id: $("#user-id").val(),
      blockedReason: $("#reason-block").val(),
    };

    MeteorCall(_METHODS.user.BlockUser, data, accessToken)
      .then((result) => {
        handleSuccess("Đã Khóa").then(() => {
          $("#blockUserModal").modal("hide");
          reloadTable(1, getLimitDocPerPage());
        });
      })
      .catch(handleError);
  }
}

function clickUnBlockUser(e) {
  let userID = e.currentTarget.getAttribute("userID")
  handleConfirm("Bạn muốn mở khóa tài khoản này").then((result) => {
    if (result.value) {
      MeteorCall(_METHODS.user.UnblockUser, { _id: userID }, accessToken)
        .then((result) => {
          Swal.fire({
            icon: "success",
            text: "Đã xóa thành công",
            timer: 3000,
          });
          reloadTable(currentPage, getLimitDocPerPage());
        })
        .catch(handleError);
    }
  });
}

function clickDeleteUser(e) {
  handleConfirm().then((result) => {
    if (result.value) {
      let userID = e.currentTarget.getAttribute("userID")
      MeteorCall(_METHODS.user.Delete, { _id: userID }, accessToken).then(() => {
        Swal.fire({
          icon: "success",
          text: "Đã xóa thành công",
          timer: 3000,
        });
        reloadTable(currentPage, getLimitDocPerPage());
      });
    }
  });
}

function getLimitDocPerPage() {
  return parseInt($("#limit-doc").val());
}

function reloadTable(
  page = 1,
  limitDocPerPage = LIMIT_DOCUMENT_PAGE,
  options = null
) {
  let table = $("#table-body");
  MeteorCall(
    _METHODS.user.GetByPage, {
    page: page,
    limit: limitDocPerPage,
    options,
  },
    accessToken
  ).then((result) => {
    handlePaging(table, result.count, page, limitDocPerPage);
    Session.set('listUser', result.data)
  });
}

function initSchoolSelect2() {
  MeteorCall(_METHODS.school.GetAll, null, accessToken)
    .then((result) => {
      Session.set("schools", result.data);
      $("#school-input").select2({
        width: "100%",
        placeholder: "Chọn trường",
      });
    })
    .catch(handleError);
}

function checkInput() {
  let name = $("#name").val();
  let phone = $("#phone").val();
  let email = $("#email").val();

  if (!name || !phone || !email) {
    Swal.fire({
      icon: "error",
      text: "Chưa đủ thông tin!",
      timer: 3000,
    });
    return false;
  }
  return true;
}

function clearForm() {
  $("#phone").val("");
  $("#name").val("");
  $("#email").val("");

  // remove ảnh
  dropzone.removeAllFiles(true);
}

function userFilter() {
  let options = [{
    text: "schoolID",
    value: $("#school-filter").val(),
  },
  {
    text: "user/name",
    value: $("#name-filter").val(),
  },
  {
    text: "user/phone",
    value: $("#phone-filter").val(),
  },
  {
    text: "user/email",
    value: $("#email-filter").val(),
  },
  ];
  reloadTable(1, getLimitDocPerPage(), options);
}

function refreshFilter() {
  $("#school-filter").val("").trigger("change");
  $("#name-filter").val("");
  $("#phone-filter").val("");
  $("#email-filter").val("");

  reloadTable(1, getLimitDocPerPage(), null);
}

function getCheckboxData() {
  let dataCheckbox = [];
  let userItem = {
    password: "12345678",
  };
  $(".user-checkbox:checked").each(function () {
    userItem._id = $(this).val();
    dataCheckbox.push(JSON.stringify(userItem));
  });
  return dataCheckbox;
}

function resetPassword() {
  let data = getCheckboxData().map((key) => {
    return JSON.parse(key);
  });
  let numberChange = data.length
  if (numberChange) {
    handlePromp("Tạo lại mật khẩu", "text").then(result => {
      if (result.value) {
        handleConfirm("Reset mật khẩu người dùng được chọn?").then((item) => {
          if (item.value) {
            MeteorCall(_METHODS.user.ResetPassword, data, accessToken)
              .then((res) => {
                handleSuccess(`Đã đổi mật khẩu ${numberChange}`)
              })
              .catch(handleError);
          }
        });
      }
    })
  } else {
    handleError("", "Chưa chọn người dùng!!!");
  }
}