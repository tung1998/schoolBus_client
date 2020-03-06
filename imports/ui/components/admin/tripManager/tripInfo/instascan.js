import '/public/assets/module/instascan.min.js'

import {
    handleError, MeteorCall,
    makeID
} from '../../../../../functions'

import {
    checkStudentInfo
} from './tripInfo'
import { _METHODS } from '../../../../../variableConst'

export {
    renderStudentInfoModal
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
    console.log(Scanner)

    Instascan.Camera.getCameras().then(renderListCamera).catch(handleError);
    Scanner.addListener('scan', scanSuccess);
}

function scanSuccess(content) {
    if (/[0-9a-fA-F]{24}/.test(content)) {
        let studenInfo = checkStudentInfo(content);
        if (studenInfo) {
            console.log(studenInfo);
            renderStudentInfoModal(content);
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

function clickTakePhoto(e){
    $("#studentInfoModal").modal("hide")
    let tripID = $(e.currentTarget).attr("tripID");
    let studentID = $(e.currentTarget).attr("studentID")
    MeteorCamera.getPicture((err, data) => {
        if(err){
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

function renderStudentInfoModal(studentID) {
    $("#studentInfoModal").modal("show")
    $('#instascannerModal').modal('hide')
    let tripID = FlowRouter.getParam('tripID')
    let studenInfo = checkStudentInfo(studentID)

    console.log(studenInfo)
    let buttonHtml = ''
    switch (studenInfo.status) {
        case 0:
            buttonHtml = `<button type="button" class="btn btn-success status-btn" tripID="${tripID}"  studentID="${studenInfo.studentID}" status="1" >Điểm danh</button>
                            <button type="button" class="btn btn-danger status-btn" tripID="${tripID}" studentID="${studenInfo.studentID}" status="3">Vắng mặt</button>`
            break
        case 1:
            buttonHtml = `<button type="button" class="btn btn-success status-btn" tripID="${tripID}" studentID="${studenInfo.studentID}" status="2">Xuống xe</button>`
            break
        case 2:
            buttonHtml = `<span class="kt-badge kt-badge--success kt-badge--inline ">Đã xuống xe</span>`
            break
        case 3:
            buttonHtml = `<span class="kt-badge kt-badge--danger kt-badge--inline">Vắng mặt</span>`
            break
        default:
            buttonHtml = ``
    }

    $(".studentInfoModal-body").html(`
        <div class="row">
                <div class="fa-pull-left col-3">
                    <img style="width: 100px; height: 100px" src="http://192.168.100.69:3000/images/${studenInfo.student.user.image}/0" alt="image">
                </div>
                <div class="col-9">
                    <div class="row">
                        <div class="col-12">
                            <div class="fa-pull-left">
                                <label for="studentID" class="form-control-label"><b>Mã học sinh: </b></label>
                            </div>
                            <div class="fa-pull-right">
                                <span class="studentID">${studenInfo.student.IDStudent}</span>
                            </div>
                        </div>
                    </div>
                
                    <div class="row">
                        <div class="col-12">
                            <div class="fa-pull-left">
                                <label for="studentName" class="form-control-label"><b>Tên học sinh: </b></label>
                            </div>
                            <div class="fa-pull-right">
                                <span class="studentName">${studenInfo.student.user.name}</span>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <div class="fa-pull-left">
                                <label for="phone" class="form-control-label"><b>Số điện thoại: </b></label>
                            </div>
                            <div class="fa-pull-right">
                                <span class="phone">${studenInfo.student.user.phone}</span>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <div class="fa-pull-left">
                                <label for="className" class="form-control-label"><b>Lớp: </b></label>
                            </div>
                            <div class="fa-pull-right">
                                <span class="className">211131</span>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <div class="fa-pull-left">
                                <label for="teacherName" class="form-control-label"><b>Giáo viên: </b></label>
                            </div>
                            <div class="fa-pull-right">
                                <span class="teacherName">211131</span>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <div class="fa-pull-left">
                                <label for="teacherName" class="form-control-label"><b>Trường: </b></label>
                            </div>
                            <div class="fa-pull-right">
                                <span class="teacherName">211131</span>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <div class="fa-pull-left">
                                <label for="teacherName" class="form-control-label"><b>Địa chỉ trường: </b></label>
                            </div>
                            <div class="fa-pull-right">
                                <span class="teacherName">211131</span>
                            </div>
                        </div>
                    </div>

                </div>
        </div>
        <div></div>
        <div class="row">
            <div class="col-12">
                <div class="fa-pull-right">
                    ${buttonHtml}
                    <button type="button" class="btn btn-success" tripID="${tripID}" studentID="${studenInfo.studentID}" id="takePhoto">Chụp ảnh</button>
                </div>
            </div>
        </div>
        
    `)

}