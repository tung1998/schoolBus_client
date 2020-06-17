import "./userManger.html";

import {
  MeteorCall,
  handleError,
  handleSuccess,
  handleConfirm,
  addRequiredInputLabel,
  addPaging,
  makeID,
  initDropzone,
  handlePaging,
} from "../../../../functions";
import {
  _METHODS,
  LIMIT_DOCUMENT_PAGE,
  _SESSION,
  _URL_images,
} from "../../../../variableConst";
const Cookies = require("js-cookie");

let accessToken;
let currentPage = 1;
let dropzone;

Template.userManager.onCreated(() => {
  accessToken = Cookies.get("accessToken");
  Session.set(_SESSION.isSuperadmin, true);
  Session.set("schools", []);
});

Template.userManager.onRendered(() => {
  if (Session.get(_SESSION.isSuperadmin)) initSchoolSelect2();

  addRequiredInputLabel();
  addPaging($("#userTable"));
  reloadTable();

  dropzone = initDropzone("#user-dropzone");
  this.dropzone = dropzone;
});

Template.userManager.onDestroyed(() => {
  dropzone = null;
});

Template.userManager.events({
  "click #password-confirm-button": submitChangePassword,
  "click #user-confirm-button": submitEditUser,
  "click #block-confirm-button": submitBlockUser,
  "click .block-user": clickBlockUser,
  "click .unblock-user": clickUnBlockUser,
  "click .edit-user": clickEditUser,
  "click .delete-user": clickDeleteUser,
  "click .change-password": (e) => {
    let data = $(e.currentTarget).data("json");
    $("#user-changepass-id").val(data._id);
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
    }, ];
    reloadTable(1, getLimitDocPerPage(), options);
  },
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
        },accessToken)
      .then((result) => {
        console.log(result);
        handleSuccess("Đổi mật khẩu");
      })
      .catch(handleError);
  } else {
    handleError(null, "Xác nhận mật khẩu sai!");
  }
}

function clickEditUser(e) {
  let userData = $(e.currentTarget).data("json");

  $("#editUserModal").modal("show");
  $("#user-id").val(userData._id);

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
  } catch (error) {}
}

function clickBlockUser(e) {
  data = $(e.currentTarget).data("json");
  $("#blockUserModal").modal("show");

  $("#user-id").val(data._id);
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
  let data = $(e.currentTarget).data("json");
  handleConfirm("Bạn muốn mở khóa tài khoản này").then((result) => {
    if (result.value) {
      MeteorCall(_METHODS.user.UnblockUser, data, accessToken)
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
      let data = $(e.currentTarget).data("json");
      MeteorCall(_METHODS.user.Delete, data, accessToken).then(() => {
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
    createTable(table, result, limitDocPerPage);
  });
}

function createTable(table, result, limitDocPerPage) {
  let htmlRow = result.data.map((key, index) => {
    key.index = index + (result.page - 1) * limitDocPerPage;
    return createRow(key);
  });
  table.html(htmlRow.join(""));
}

function createRow(result) {
  let data = {
    _id: result._id,
    name: result.name,
    phone: result.phone,
    email: result.email,
    image: result.image,
    username: result.username,
    userType: result.userType,
    isBlocked: result.isBlocked,
    blockedBy: result.blockedBy ? result.blockedBy : "",
    blockedReason: result.blockedReason ? result.blockedReason : "",
  };
  let userType = getUserType(data.userType);

  let blockedText;
  if (data.isBlocked == true) {
    blockedText = `<span class="kt-badge kt-badge--warning kt-badge--inline  kt-badge--pill kt-badge--rounded">Khóa</span>`;
    blockedButton = `<a class="dropdown-item unblock-user" href="#" data-json=\'${JSON.stringify(
        { _id: data._id }
      )}\'><i
        class="la la-unlock-alt"></i> Mở</a>`;
  } else {
    blockedText = `<span class="kt-badge kt-badge--success kt-badge--inline kt-badge--pill kt-badge--rounded">Mở</span>`;
    blockedButton = `<a class="dropdown-item block-user" href="#" data-json=\'${JSON.stringify(
        { _id: data._id }
      )}\'><i
        class="la la-unlock"></i> Khóa</a>`;
  }
  return `
        <tr id="${data._id}" class="table-row">
            <td class="text-center">${result.index + 1}</td>
            <td>${data.name}</td>
            <td>${data.username}</td>
            <td>${data.phone}</td>
            <td>${data.email}</td>
            <td class="text-center">${blockedText}</td>
            <td>${data.blockedReason}</td>
            <td>${userType}</td>

             <td class="text-center">
                <div class="from-group">
                    <label class="kt-checkbox kt-checkbox--brand">
                    <input type="checkbox" class="user-checkbox" value="${
                      data._id
                    }">
                    <span></span>
                    </label>
                </div>
            </td>
            <td class="text-center">
                <div class="dropdown dropdown-inline">
                    <button type="button"
                    class="btn btn-hover-danger btn-elevate-hover btn-icon btn-sm btn-icon-md"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="flaticon-more-1"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-right">
                    <a class="dropdown-item change-password" href="#" data-json=\'${JSON.stringify(
                      { _id: data._id }
                    )}\' data-toggle="modal"
                    data-target="#editPasswordModal"><i class="la la-key"></i> Đổi mật khẩu</a>
                    <a class="dropdown-item edit-user" href="#" data-json=\'${JSON.stringify(
                      data
                    )}\'><i
                        class="la la-pencil-square"></i> Sửa thông tin</a>
                    ${blockedButton}
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item delete-user" href="#" data-json=\'${JSON.stringify(
                      { _id: data._id }
                    )}\'><i class="la la-trash"></i> Xóa</a>
                    </div>
                </div>
            </td>
        </tr>
        `;
}

function getUserType(userType) {
  switch (userType) {
    case 0:
      return "Quản trị viên";
      break;
    case 1:
      return "Học sinh";
      break;
    case 2:
      return "Bảo mẫu";
      break;
    case 3:
      return "Phụ huynh";
      break;
    case 4:
      return "Lái xe";
      break;
    case 5:
      return "Giáo viên";
      break;
  }
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
  console.log(options);
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
  if (data.length) {
    handleConfirm("Reset mật khẩu người dùng được chọn?").then((result) => {
      if (result.value) {
        MeteorCall(_METHODS.user.ResetPassword, data, accessToken)
          .then((result) => {
            handleSuccess(`Đã đổi mật khẩu ${numberChange}`)
          })
          .catch(handleError);
      }
    });
  } else {
    handleError("", "Chưa chọn người dùng!!!");
  }
}