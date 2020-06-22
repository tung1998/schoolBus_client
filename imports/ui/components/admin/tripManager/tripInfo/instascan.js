import '/public/assets/module/instascan.min.js'

import {
    handleError,
    MeteorCall,
    makeID,
    handleSuccess,
    getJsonDefault
} from '../../../../../functions'

import {
    _METHODS,
    _URL_images,
    _TRIP_STUDENT,
    _TRIP,
    _TRIP_CARSTOP
} from '../../../../../variableConst'
import {
    get
} from 'js-cookie'

export {
    updateStudentInfoModalData
}

let Scanner
let Cameras
let accessToken


Template.instascannerModal.onCreated(() => {
    accessToken = Cookies.get('accessToken')
})

Template.instascannerModal.onRendered(() => {
    initScanner()

})

Template.instascannerModal.events({
    "change .camera-list": changeCamera,
})

Template.instascannerModal.onDestroyed(() => {
    Scanner = null
    Cameras = null
})

Template.studentInfoModal.events({
    "click #takePhoto": clickTakePhoto
})

function initScanner() {
    Scanner = new Instascan.Scanner({
        video: document.getElementById('scanner'),
        backgroundScan: false,
        mirror: false,
        captureImage: true,
    });

    Instascan.Camera.getCameras().then(renderListCamera).catch(error => {
        $('#openScannerModal').addClass('kt-hidden')
        $('#takePhoto').addClass('kt-hidden')
        handleError(error, 'Không tìm thấy camera')
    });
    Scanner.addListener('scan', scanSuccess);
}

function scanSuccess(content) {
    if (/[0-9a-fA-F]{24}/.test(content)) {
        let studenInfo = checkStudentInfo(content);
        if (studenInfo) {
            updateStudentInfoModalData(content);
        } else {
            Swal.fire({
                icon: "error",
                text: "Không tìm thấy học sinh",
                timer: 3000
            })
        }
    } else {
        handleError(null, "qr code không đúng định dạng:" + content)
    }
}

function renderListCamera(cameras) {
    if (cameras.length) {
        // danh sách camera
        Cameras = cameras
        cameras.map(cam => {
            $(".camera-list").append(`
                <option value="${cam.id}">${cam.name}</option>
            `)
        })
        $("#instascannerModal").on('show.bs.modal', function () {
            Scanner.start(cameras[0]);
        })

        $("#instascannerModal").on('hide.bs.modal', function () {
            Scanner.stop();
        })
    } else {
        $('#openScannerModal').addClass('kt-hidden')
        $('#takePhoto').addClass('kt-hidden')
        handleError(cameras, 'Không tìm thấy camera')
    }
}

function changeCamera(event) {
    let camera = $(".camera-list").val();
    Cameras.map(cam => {
        if (cam.id == camera) {
            Scanner.start(cam);
        }
    })
}

function clickTakePhoto(e) {
    $("#studentInfoModal").modal("hide")
    let tripID = $(e.currentTarget).attr("tripID");
    let studentID = $(e.currentTarget).attr("studentID")
    MeteorCamera.getPicture((err, data) => {
        if (err) {
            handleError(err)
        } else {
            $(".photo-preview").css({
                "width": "100% !important"
            })
            let dt = {
                imageId: makeID("attendance"),
                BASE64: [data]
            }
            MeteorCall(_METHODS.image.Import, dt, accessToken).then(result => {
                let imageDetail = {
                    tripID: tripID,
                    studentID: studentID,
                    image: dt.imageId
                }
                return MeteorCall(_METHODS.trip.Image, imageDetail, accessToken)
            }).then(result => {
                handleSuccess('Đã xác nhận ảnh!')
            }).catch(handleError)
        }
    });


}

function updateStudentInfoModalData(studentID) {
    $('#instascannerModal').modal('hide')
    let studentInfoData = checkStudentInfo(studentID)
    let tripData = Session.get('tripData')
    let currentCarStop = tripData.carStops.filter(item => item.status === _TRIP_CARSTOP.status.arrived.number)[0]
    studentInfoData.tripID = Session.get('tripID')
    let check1 = tripData.type == _TRIP.type.toSchool.number
    let check2 = currentCarStop && studentInfoData.student.carStopID == currentCarStop.carStopID
    let check3 = tripData.carStops.every(item => item.status == _TRIP_CARSTOP.status.leaved.number)
    let check4 = tripData.status == _TRIP.status.moving.number

    let addNoteStudent = `<button type="button" class="btn btn-primary studentnote-btn btn-sm" tripID="${studentInfoData.tripID}" studentID="${studentInfoData.studentID}">Ghi chú</button>`
    let waitingTrip = `<span class="kt-badge kt-badge--primary kt-badge--inline ">Chuyến đi chưa bắt đầu</span>`
    let captureStudent = `<button type="button" class="btn btn-success btn-sm" tripID="${studentInfoData.tripID}"
    studentID="${studentInfoData.studentID}" id="takePhoto">Chụp ảnh</button>`
    switch (studentInfoData.status) {
        case 0:
            studentInfoData.buttonHtml = `${check4?`${(check1&&check2)||(!check1)?`<button type="button" class="btn btn-success status-btn btn-sm" tripID="${studentInfoData.tripID}"  studentID="${studentInfoData.studentID}" status="${_TRIP_STUDENT.status.pickUp.number}">Điểm danh</button>
            <button type="button" class="btn btn-danger status-btn btn-sm" tripID="${studentInfoData.tripID}" studentID="${studentInfoData.studentID}" status="${_TRIP_STUDENT.status.absent.number}">Vắng mặt</button>`:`<span class="kt-badge kt-badge--primary kt-badge--inline ">chưa tới điểm dừng</span>`}`:`${waitingTrip}`}
            ${addNoteStudent}${captureStudent}`
            break
        case 1:
            studentInfoData.buttonHtml = `${check4?`${(check1&&check3)||(!check1&&check2)?`<button type="button" class="btn btn-success status-btn" tripID="${studentInfoData.tripID}" studentID="${studentInfoData.studentID}" status="${_TRIP_STUDENT.status.getOff.number}">Xuống xe</button>`:`<span class="kt-badge kt-badge--primary kt-badge--inline ">chưa tới điểm dừng</span>`}`:`${waitingTrip}`}
                                        ${addNoteStudent}`
            break
        case 2:
            studentInfoData.buttonHtml = `<span class="kt-badge kt-badge--success kt-badge--inline ">Đã xuống xe</span>
            ${addNoteStudent}`
            break
        case 3:
            studentInfoData.buttonHtml = `<span class="kt-badge kt-badge--warning kt-badge--inline">xin nghỉ</span>
            ${addNoteStudent}`
            break
        case 4:
            studentInfoData.buttonHtml = `<span class="kt-badge kt-badge--danger kt-badge--inline">Vắng mặt</span>
            ${addNoteStudent}`
            break
        default:
            studentInfoData.buttonHtml = `${captureStudent}`
    }

    if (studentInfoData.student.user.image) {
        studentInfoData.image = `${_URL_images}/${studentInfoData.student.user.image}/0`
    } else {
        studentInfoData.image = `/assets/media/users/user5.jpg`
    }

    studentInfoData.status = getJsonDefault(_TRIP_STUDENT.status, 'number', studentInfoData.status)
    Session.set('studentInfoData', studentInfoData)
    $("#studentInfoModal").modal("show")
}

function checkStudentInfo(studentID) {
    return Session.get('studentTripData').filter(student => student.studentID == studentID)[0]
}