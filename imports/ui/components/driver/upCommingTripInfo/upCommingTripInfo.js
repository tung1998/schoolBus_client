import './upCommingTripInfo.html';

import {
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm
} from '../../../../functions'

import {
    _METHODS
} from '../../../../variableConst'

let accessToken;
let map;
let studentsDataAtALocation;
let clickAttendance;

/////////////////////////////////
////Sửa ID tài xế
let CurrentDriverID = "5e6f422418c3b7685d6d1146";
///////////////////////////////////

Template.upCommingTripInfo.onCreated(() => {
    accessToken = Cookies.get('accessToken')
})

Template.upCommingTripInfo.onRendered(() => {
    $(document).ready(() => {
        $(".kt-footer").hide();
        $("#map").show();
        setMapHeight();
        $(".student-info").hide();
        $(".student-list").hide();
        $("#studentListShowButton").html("Xem danh sách học sinh");

    })
    renderMap();
})

Template.upCommingTripInfo.events({
    'click .leaflet-marker-icon': ClickStudentLocation,
    'click #studentListShowButton': ClickStudentListShowButton,
    'click #startTripButton': ClickStartTripButton,
    'click #endTripButton': ClickEndTripButton,
    'submit form': SubmitFormTroubleReport,
    'click #attendanceConfirm': ClickAttendanceConfirm,
    'click #absentConfirm': ClickAbsentConfirm
})

function ClickEndTripButton(event) {
    let status = $(event.currentTarget).attr("status");
    let tripID = $(event.currentTarget).attr("tripID");

    if (status != 0 && status != 2) {
        handleConfirm("Bạn có chắc muốn kết thúc chuyến đi").then(result => {
            if (result.value) {
                let data = {
                    _id: tripID,
                    status: 2
                }
                MeteorCall(_METHODS.trip.Update, data, accessToken)
                    .then(() => {
                        handleSuccess(name = "Kết thúc");
                        reloadData(CurrentDriverID, map);
                    })
                    .catch(handleError)
            } else {

            }
        })
    }
}

function ClickStartTripButton(event) {
    let status = $(event.currentTarget).attr("status");

    if (status == 0) {
        handleConfirm("Bạn có chắc muốn bắt đầu chuyến đi").then(result => {
            if (result.value) {
                let data = {
                    _id: $(event.currentTarget).attr("tripID"),
                    status: 1
                }
                MeteorCall(_METHODS.trip.Update, data, accessToken)
                    .then(() => {
                        handleSuccess(name = "Khởi hành");
                        reloadData(CurrentDriverID, map);
                    })
                    .catch(handleError)
            } else {

            }
        })
    } else if (status == 1) {
        handleConfirm("Bạn muốn báo cáo sự cố").then(result => {
            if (result.value) {
                let data = {
                    _id: $(event.currentTarget).attr("tripID"),
                    status: 3
                }
                $("#troubleReport").modal("show");
            } else {

            }
        })
    }
}

function SubmitFormTroubleReport(event) {
    event.preventDefault();
    let note = $("#note").val();
    if (note) {
        handleConfirm("Bạn có chắc chắn đây là 1 sự cố").then(result => {
            if (result.value) {
                let data = {
                        _id: $("#startTripButton").attr("tripID"),
                        status: 3
                    }
                    ////////////////////////////////
                    ///Thêm API thêm sự cố//////////
                    ///////////////////////////////
                MeteorCall(_METHODS.trip.Update, data, accessToken)
                    .then(() => {

                        $("#note").val("")
                        $("#troubleReport").modal("hide");

                        handleSuccess(name = "Thêm sự cố");

                        $("#startTripButton").removeClass("btn-success")
                        $("#startTripButton").addClass("btn-danger")

                        reloadData(CurrentDriverID, map);

                    })
                    .catch(handleError)
            }
        })

    } else {
        Swal.fire({
            icon: "error",
            text: "Làm ơn cho biết sự cố.",
            timer: 2000
        })
    }
}

function ClickAttendanceConfirm(event) {
    event.preventDefault();


    let data = $(event.currentTarget).data("json")
    let status = data.status;
    if (status == 0) {
        data.status = 1;

    } else if (status == 1) {
        data.status = 2;
    }
    MeteorCall(_METHODS.trip.Attendace, data, accessToken)
        .then(() => {
            clickAttendance = true;
            reloadData(CurrentDriverID, map)
        })
        .catch(handleError);
}

function ClickAbsentConfirm(event) {
    event.preventDefault();


    let data = $(event.currentTarget).data("json")

    data.status = 3
    MeteorCall(_METHODS.trip.Attendace, data, accessToken)
        .then(() => {
            clickAttendance = true;
            reloadData(CurrentDriverID, map)
        })
        .catch(handleError);
}

function createStatusButton(status) {
    if (status == 0) {
        $("#startTripButton").html("Bắt đầu chuyến đi")
        $(".buttonBottom").hide();
    } else if (status == 1) {
        $("#startTripButton").html("Báo cáo sự cố")
        $(".buttonBottom").show();
    } else if (status == 2) {
        $(".buttonBottom").hide();
        $("#startTripButton").removeClass("btn-success")
        $("#startTripButton").addClass("btn-danger")
        $("#startTripButton").html("Đã kết thúc")
    } else if (status == 3) {
        $(".buttonBottom").show();
        $("#startTripButton").html("Gặp sự cố")
    }
}

function ClickStudentListShowButton(event) {
    $("#displayStudentInfoInUpCommingTrip").html("");
    if ($("#map").is(":hidden")) {
        $("#map").show();
        $(".student-info").hide();
        $(".student-list").hide();
        $("#studentListShowButton").html("Xem danh sách học sinh");
    } else {
        $("#map").hide();
        $(".student-list").show();
        $("#studentListShowButton").html("Xem bản đồ");
        studentsDataAtALocation = undefined;
    }
}

function setMapHeight() {
    let windowHeight = $(window).height();
    let headerHeight = $(".kt-header-mobile").height();
    let buttonHeader = $(".buttonHeader").height();
    $("#map").css({
        "height": windowHeight - headerHeight
    })
    $(".student-info").css({
        "height": windowHeight - headerHeight - buttonHeader,
        "overflow": "scroll"
    })
}

function renderMap() {
    map = L.map('map').setView([21.030674, 105.800443], 16);
    map.locate({ setView: true, maxZoom: 16 });
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 16,
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoibGluaGxuIiwiYSI6ImNrMTZpZ2R5ZDAzcXMzbmt3cGZ5ejlxaXEifQ.egi3vPgOfYIKA1psvosktg'
    }).addTo(map);

    reloadData(CurrentDriverID, map);


}

function reloadData(driverID, map) {
    $("#table-body").html("");
    MeteorCall(_METHODS.trip.GetAll, null, accessToken).then(result => {
        let data = result.data.map(trip => {
            if (trip.driverID == driverID) {

                createStatusButton(trip.status)
                $("#startTripButton").attr("tripID", trip._id);
                $("#startTripButton").attr("status", trip.status);
                $("#endTripButton").attr("status", trip.status)
                $("#endTripButton").attr("tripID", trip._id)

                console.log(trip)
                let carStopList = trip.route.studentList.carStopIDs;

                let students = trip.students;
                let studentData = [];
                let index = 0;
                carStopList.map((carStop, indexCarStop) => {
                    let studentsForEachStop = [];
                    students.map((student, indexStudent) => {
                        if (student.student.carStop._id == carStop) {
                            index = index + 1;
                            let location = student.student.carStop.location;
                            let data = {
                                location: {
                                    lat: location[0],
                                    lng: location[1]
                                },
                                info: {
                                    tripID: trip._id,
                                    status: student.status,
                                    studentID: student.student._id,
                                    carStop: student.student.carStop._id,
                                    name: student.student.user.name,
                                    age: "20",
                                    email: student.student.user.email,
                                    phoneNumber: student.student.user.phone,
                                    parentsPhoneNumber: "08716262625",
                                    pickupAddress: student.student.carStop.address
                                }
                            }
                            studentsForEachStop.push(data);
                            $("#table-body").append(createRow(data.info, index));
                        }
                    })
                    studentData.push(studentsForEachStop)
                })

                if (studentsDataAtALocation) {
                    studentData.map(s => {
                        if (s[0].info.carStop == studentsDataAtALocation[0].carStop) {
                            studentsDataAtALocation = [];
                            s.map(stu => {
                                studentsDataAtALocation.push(stu.info);
                            })
                            console.log(studentsDataAtALocation)
                            reloadStudentInfo();
                        }
                    })

                }

                renderStudentLocation(studentData, map)
            }
        })
    })
}

function reloadStudentInfo() {
    if (clickAttendance) {
        console.log(clickAttendance)
        $("#displayStudentInfoInUpCommingTrip").html("")
        console.log(studentsDataAtALocation)
        studentsDataAtALocation.map(result => {
            renderEachStudentInfo(result)
        })
    }
    clickAttendance = false;
}

function createRow(data, index) {
    const data_row = dataRow(data, index);
    // _id is tripID
    return `
        <tr id="${data.studentID}" class="table-row">
          ${data_row}
        </tr>
        `
}

function dataRow(result, index) {
    return `
            <th scope="row">${index}</th>
			<td>${result.name}</td>
            <td>${result.phoneNumber}</td>
    `;
}

function renderStudentLocation(dt, map) {
    dt.map((item, indexMarker) => {
        let marker = L.marker([item[0].location.lat, item[0].location.lng]).addTo(map);
        $(".leaflet-marker-icon").attr("src", "/img/black-marker.png");
        marker._icon.classList.add(`map-marker${indexMarker}`);
        let students = [];
        item.map((result, indexStudent) => {
            students.push(result.info)

        })
        $(`.map-marker${indexMarker}`).data("students", students)
    })
}

function ClickStudentLocation(event) {
    event.preventDefault();

    console.log($(event.currentTarget).data("students"));
    let studentsData = $(event.currentTarget).data("students");
    $(".leaflet-marker-icon").attr("src", "/img/black-marker.png");
    $(event.currentTarget).attr("src", "/img/red-marker.png")

    studentsDataAtALocation = studentsData;
    console.log(studentsDataAtALocation);
    studentsData.map(result => {
        renderEachStudentInfo(result)
    })

}

function renderEachStudentInfo(result) {
    let data = {
        tripID: result.tripID,
        studentID: result.studentID,
        carStop: result.carStop,
        status: result.status,
        name: result.name,
        age: result.age,
        phoneNumber: result.phoneNumber,
        parentsPhoneNumber: result.parentsPhoneNumber,
        pickupAddress: result.pickupAddress,
        email: result.email
    }
    let button = ``;
    if (data.status == 0) {
        button = `<span id="status" style="color: red; padding-bottom: 0.6rem;"><b>Chưa lên xe</b></span>
                <div class="kt-widget__action">
                    <button type="button" data-json=\'${JSON.stringify(data)}\' class="btn btn-brand btn-sm btn-upper"
                        id="attendanceConfirm">Điểm Danh</button>
                    <button type="button" data-json=\'${JSON.stringify(data)}\' class="btn btn-danger btn-sm btn-upper"
                        id="absentConfirm">Vắng mặt</button>
                </div>`
    } else if (data.status == 1) {
        button = `<span id="status" style="color: #5d78ff; padding-bottom: 0.6rem;"><b>Đã lên xe</b></span>
                <div class="kt-widget__action">
                    <button type="button" data-json=\'${JSON.stringify(data)}\' class="btn btn-brand btn-sm btn-upper"
                        id="attendanceConfirm">Xuống Xe</button>
                </div>`
    } else if (data.status == 2) {
        button = `<span id="status" style="color: green; padding-bottom: 0.6rem;"><b>Đã xuống xe</b></span>`
    } else if (data.status == 3) {
        button = `<span id="status" style="color: red; padding-bottom: 0.6rem;"><b>Vắng mặt</b></span>`
    }
    $("#displayStudentInfoInUpCommingTrip").append(`
                <div class="kt-portlet__body">
                    <div class="kt-widget kt-widget--user-profile-3">
                        <div class="kt-widget__top">
                            <div class="kt-widget__media kt-hidden-">
                                <img src="./assets/media/users/100_1.jpg" alt="image">
                            </div>
                            <div
                                class="kt-widget__pic kt-widget__pic--danger kt-font-danger kt-font-boldest kt-font-light kt-hidden">
                                JM
                            </div>
                            <div class="kt-widget__content">
                                <div class="kt-widget__head">
                                    <a href="#" class="kt-widget__username" id="studentName">
                                        ${data.name}
                                        <!-- <i class="flaticon2-correct kt-font-success"></i>   -->

                                    </a>
                                    ${button}
                                </div>

                                <div class="kt-widget__subhead">
                                    <div><i class="flaticon2-new-email"></i>&nbsp;Email:&nbsp;<a
                                            id="email">${data.email}</a></div>
                                    <div><i class="flaticon2-calendar-3"></i>&nbsp;Sđt:&nbsp;<a
                                            id="phoneNumber">${data.phoneNumber}</a></div>
                                    <div><i class="flaticon2-placeholder"></i>&nbsp;Địa chỉ đón:&nbsp;<a
                                            id="pickupAddress">${data.pickupAddress}</a></div>
                                    <div><i class="flaticon2-calendar-3"></i>&nbsp;Sđt phụ huynh:&nbsp;<a
                                            id="parentsPhoneNumber">${data.parentsPhoneNumber}</a></div>
                                </div>

                                <div class="kt-widget__info">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    `);
    $('.student-info').show();
    $("#map").hide();
    $(".student-list").hide();
    $("#studentListShowButton").html("Xem bản đồ")
}