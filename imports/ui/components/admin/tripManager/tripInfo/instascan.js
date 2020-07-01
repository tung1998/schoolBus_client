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
    Meteor.startup(function () {
        if (!Meteor.isCordova) {
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
    });

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
    let cameraSelect = $('.camera-list')
    if (cameras.length) {
        let cameraList = cameras.map(cam => {
            return `<option value="${cam.id}">${cam.name}</option>`
        })
        cameraSelect.html('').append(cameraList.join(''))
            .select2({
                width: "100%",
                minimumResultsForSearch: Infinity,
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
    if (Meteor.isCordova) {
        const Camera = navigator.camera;

        const options = {
            quality: 30,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            // allowEdit: true,
            correctOrientation: true
        }
        Camera.getPicture(
            (imageData) => {
                let dt = {
                    imageId: makeID("attendance"),
                    BASE64: ["data:image/jpeg;base64," + imageData]
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
                }).catch(error => {
                    console.log(error);

                })
                // $("#table-body").html(imageUri)
            },
            (error) => {
                console.debug("Unable to obtain picture: " + error, "app");
            },
            options)
    } else {

        MeteorCamera.getPicture((err, data) => {
            if (err) {
                return

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
                }).catch(error => {
                    console.log(error);

                })
            }
        });
    }
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

    let addNoteStudent = `<button type="button" class="btn btn-primary studentnote-btn btn-sm custom-btn mr-1" tripID="${studentInfoData.tripID}" studentID="${studentInfoData.studentID}" studentName="${studentInfoData.student.user.name}">Ghi chú</button>`
    let waitingTrip = `<span class="badge badge-primary justify-content-center d-flex">Chuyến đi chưa bắt đầu</span>`
    let captureStudent = `<button type="button" class="btn btn-success btn-sm custom-btn" studentName="${studentInfoData.student.user.name}" stripID="${studentInfoData.tripID}"
    studentID="${studentInfoData.studentID}" id="takePhoto">Chụp ảnh</button>`
    switch (studentInfoData.status) {
        case 0:
            studentInfoData.buttonHtml = `${check4?`${(check1&&check2)||(!check1)?`<div class="col-md-6 col-sm-12"><button type="button" class="btn btn-success status-btn btn-sm custom-btn" tripID="${studentInfoData.tripID}"  studentID="${studentInfoData.studentID}" status="${_TRIP_STUDENT.status.pickUp.number}" studentName="${studentInfoData.student.user.name}">Điểm danh</button>
            <button type="button" class="btn btn-danger status-btn btn-sm custom-btn" tripID="${studentInfoData.tripID}" studentID="${studentInfoData.studentID}" status="${_TRIP_STUDENT.status.absent.number}" studentName="${studentInfoData.student.user.name}">Vắng mặt</button></div>`:`<div class="col-md-6 col-sm-12 mb-2"><span class="badge badge-primary justify-content-center d-flex">chưa tới điểm dừng</span></div>`}`:`<div class="col-md-6 col-sm-12 mb-2">${waitingTrip}</div>`}
            <div class="col-md-6 col-sm-12">${addNoteStudent}${captureStudent}</div>`
            break
        case 1:
            studentInfoData.buttonHtml = `${check4?`${(check1&&check3)||(!check1&&check2)?`<div class="col-md-6 col-sm-12"><button type="button" class="btn btn-success status-btn" tripID="${studentInfoData.tripID}" studentID="${studentInfoData.studentID}" status="${_TRIP_STUDENT.status.getOff.number}">Xuống xe</button></div>`:`<div class="col-md-6 col-sm-12 mb-2"><span class="badge badge-primary justify-content-center d-flex">chưa tới điểm dừng</span></div>`}`:`<div class="col-md-6 col-sm-12">${waitingTrip}</div>`}
            <div class="col-md-6 col-sm-12">${addNoteStudent}${captureStudent}</div>`
            break
        case 2:
            studentInfoData.buttonHtml = `<div class="col-md-6 col-sm-12"><span class="badge badge-success justify-content-center d-flex">Đã xuống xe</span></div>
            <div class="col-md-6 col-sm-12">${addNoteStudent}${captureStudent}<div>`
            break
        case 3:
            studentInfoData.buttonHtml = `<div class="col-md-6 col-sm-12"><span class="badge badge-warning justify-content-center">xin nghỉ</span></div>
            <div class="col-md-6 col-sm-12">${addNoteStudent}${captureStudent}</div>`
            break
        case 4:
            studentInfoData.buttonHtml = `<div class="col-md-6 col-sm-12"><span class="badge badge-danger justify-content-center">Vắng mặt</span></div>
            <div class="col-md-6 col-sm-12">${addNoteStudent}${captureStudent}</div>`
            break
        default:
            studentInfoData.buttonHtml = ` <div class="col-md-6 col-sm-12">${captureStudent}</div>`
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

export {
    scanSuccess
}