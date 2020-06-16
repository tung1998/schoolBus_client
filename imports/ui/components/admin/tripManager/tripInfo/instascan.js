import '/public/assets/module/instascan.min.js'

import {
    handleError, MeteorCall,
    makeID
} from '../../../../../functions'

import { _METHODS, _URL_images, _TRIP_STUDENT } from '../../../../../variableConst'

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
            console.log(studenInfo);
            updateStudentInfoModalData(content);
        } else {
            Swal.fire({
                icon: "error",
                text: "Không tìm thấy học sinh",
                timer: 3000
            })
        }
    } else {
        console.log("qr code không đúng định dạng:", content)
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
            console.log(err)
        } else {
            $(".photo-preview").css({
                "width": "100% !important"
            })
            let dt = {
                imageId: makeID("attendance"),
                BASE64: [data]
            }
            console.log(dt)
            MeteorCall(_METHODS.image.Import, dt, accessToken).then(result => {
                console.log("success")
            }).catch(handleError)


            let imageDetail = {
                tripID: tripID,
                studentID: studentID,
                image: dt.imageId
            }
            MeteorCall(_METHODS.trip.Image, imageDetail, accessToken)
                .then(result => {
                    console.log(imageDetail)
                    console.log("added")
                })
                .catch(handleError)
        }
    });


}

function updateStudentInfoModalData(studentID) {
    $('#instascannerModal').modal('hide')
    let studenInfoData = checkStudentInfo(studentID)
    console.log(studenInfoData)

    studenInfoData.tripID = Session.get('tripID')

    switch (studenInfoData.status) {
        case 0:
            studenInfoData.buttonHtml = `<button type="button" class="btn btn-success status-btn" tripID="${studenInfoData.tripID}"  studentID="${studenInfoData.studentID}" status="${_TRIP_STUDENT.status.pickUp.number}" >Điểm danh</button>
                            <button type="button" class="btn btn-danger status-btn" tripID="${studenInfoData.tripID}" studentID="${studenInfoData.studentID}" status="${_TRIP_STUDENT.status.absent.number}">Vắng mặt</button>`
            break
        case 1:
            studenInfoData.buttonHtml = `<button type="button" class="btn btn-success status-btn" tripID="${studenInfoData.tripID}" studentID="${studenInfoData.studentID}" status="${_TRIP_STUDENT.status.getOff.number}">Xuống xe</button>`
            break
        case 2:
            studenInfoData.buttonHtml = `<span class="kt-badge kt-badge--success kt-badge--inline ">Đã xuống xe</span>`
            break
        case 3:
            studenInfoData.buttonHtml = `<span class="kt-badge kt-badge--danger kt-badge--inline">Vắng mặt</span>`
            break
        default:
            studenInfoData.buttonHtml = ``
    }

    if (studenInfoData.student.user.image) {
        studenInfoData.image = `${_URL_images}/${studenInfoData.student.user.image}/0`
    } else {
        studenInfoData.image = `/assets/media/users/user5.jpg`
    }
    Session.set('studenInfoData', studenInfoData)
    $("#studentInfoModal").modal("show")
}

function checkStudentInfo(studentID) {
    console.log(studentID)
    return Session.get('studentTripData').filter(student => student.studentID == studentID)[0]
}