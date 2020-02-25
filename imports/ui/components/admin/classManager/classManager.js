import "./classManager.html";

const Cookies = require("js-cookie");

import { MeteorCall, handleError } from "../../../../functions";

import { _METHODS } from "../../../../variableConst";

let accessToken;

Template.classManager.onCreated(() => {
  accessToken = Cookies.get("accessToken");
});

Template.classManager.onRendered(() => {
  reloadTable();
  renderSchoolName();
});

Template.classManager.events({
  "submit form": SubmitForm,
  "click .modify-button": ClickModifyButton,
  "click .add-more": ClickAddmoreButton,
  "click .delete-button": ClickDeleteButton,
  "click .school-option": ClickSelectSchoolOption,
  "click .teacher-option": ClickSelectTeacherOption
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
    })
    .catch(handleError);
}

function renderTeacherName() {
  let data = {
    _id: $(".school-result").attr("schoolID")
  };
  MeteorCall(_METHODS.teacher.GetBySchoolID, data, accessToken)
    .then(result => {
      console.log(result);
      let optionSelects = result.map(res => {
        return `<li>
                      <a
                        role="option"
                        class="dropdown-item teacher-option"
                        id=${res._id}
                        tabindex="0"
                        aria-setsize="6"
                        aria-posinset="1"
                        ><span class="text">${res.user.name}</span></a
                      >
                    </li>`;
      });
      $("#teacher-select").html(optionSelects.join(" "));
    })
    .catch(handleError);
}

function ClickSelectSchoolOption(e) {
  let id = $(e.currentTarget).attr("id");
  let school = $(e.currentTarget).text();
  $(".school-result").html(school);
  $(".button-school-selected").attr("title", school);
  $(".school-result").attr("schoolID", id);
  renderTeacherName();
}

function ClickSelectTeacherOption(e) {
  let id = $(e.currentTarget).attr("id");
  let teacher = $(e.currentTarget).text();
  $(".teacher-result").html(teacher);
  $(".button-teacher-selected").attr("title", teacher);
  $(".teacher-result").attr("teacherID", id);
}

function ClickModifyButton(event) {
  let classData = $(event.currentTarget).data("json");
	console.log(classData);
  $("#editClassModal").attr("classID", classData._id);
  $(".modal-title").html("Chỉnh Sửa");
  $(".confirm-button").html("Sửa");

  $("input[name='className']").val(classData.name);
  $(".school-result").attr("schoolID", classData.schoolID);
  $(".school-result").html(classData.schoolName);
  $(".teacher-result").attr("teacherID", classData.teacherID);
  $(".teacher-result").html(classData.teacherName);
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
    schoolID: $(".school-result").attr("schoolID"),
	teacherID: $(".teacher-result").attr("teacherID"),
	schoolName: $(".school-result").text(),
    teacherName: $(".teacher-result").text()
  };
  let modify = $("#editClassModal").attr("classID");
  // console.log(modify);
  console.log(data);
  if (modify == "") {
    
    MeteorCall(_METHODS.class.Create, data, accessToken)
      .then(result => {
        console.log(result);
        $("#editClassModal").modal("hide");
        addToTable(data, result);
      })
      .catch(handleError);
  } else {
    data._id = modify;
    MeteorCall(_METHODS.class.Update, data, accessToken)
      .then(result => {
        console.log(result);
        $("#editClassModal").modal("hide");
        modifyTable(data);
      })
      .catch(handleError);
  }
}

function ClickDeleteButton(event) {
  let data = $(event.currentTarget).data("json");
  MeteorCall(_METHODS.class.Delete, data, accessToken)
    .then(result => {
      // console.log(result);
      // renderTableRow();
      deleteRow(data);
    })
    .catch(handleError);
}

function addToTable(data, result) {
  data._id = result._id;
  $("#table-body").prepend(`
                              <tr id = ${data._id}>
                                <th scope="row"></th>
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
                            </tr>`);
}

function modifyTable(data) {
  $(`#${data._id}`).html(`     <th scope="row"></th>
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
                                  </td>`);
}

function deleteRow(data) {
  $(`#${data._id}`).remove();
}

async function reloadTable() {
	try {
		let classData = await MeteorCall(_METHODS.class.GetAll, {}, accessToken);
		let teacherData = await MeteorCall(_METHODS.teacher.GetAll, {extra: "user"}, accessToken);
		classData.data.map(c => {
			let teacher = teacherData.data.map(t => {
				if(t._id == c.teacherID){
					return t.user.name
				}
			})
			c.teacherName = teacher;
			c.schoolName = c.school.name;
			console.log(c);
			let htmlTable = htmlRow(c);
			$("#table-body").append(htmlTable);
		})
	}

	catch(err) {
		handleError(err)
	}
}

function htmlRow(data) {
  return ` <tr id = ${data._id}>
                <th scope="row"></th>
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
  $(".school-result").attr("schoolID", "");
  $(".school-result").html("Trường");
  $(".teacher-result").attr("schoolID", "");
  $(".teacher-result").html("Giáo Viên");

  $(".button-school-selected").attr("title", "chọn trường");
  $(".button-teacher-selected").attr("title", "chọn giáo viên");
}
