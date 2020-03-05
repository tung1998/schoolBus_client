import '/public/assets/module/instascan.min.js'

import {
    handleError
} from '../../../../../functions'

import {
    checkStudentInfo
} from './tripInfo'

export {
}

let Scanner
let Cameras



Template.instascannerModal.onCreated(() => {

})

Template.instascannerModal.onRendered(() => {
    initScanner()
    $("#camera-list").select2()
})

Template.instascannerModal.events({
    "change #camera-list": changeCamera,
})

Template.instascannerModal.onDestroyed(() => {
    Scanner = null
    Cameras = null
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
            renderStudentInfoModal(studenInfo);
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
            $("#camera-list").append(`
                <option value="${cam._id}">${cam.name}</option>
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
    let camera = $("#camera-list").val();
    Cameras.map(cam => {
        if (cam.id == camera) {
            Scanner.start(cam);
        }
    })
}

function renderStudentInfoModal(studenInfo) {
    $("#studentInfoModal").modal("show")
    $('#instascannerModal').modal('hide')
    let tripID = FlowRouter.getParam('tripID')
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
        <form>
            <div class="form-group">
                <label for="studentID" class="form-control-label">Mã học sinh: </label>
                <span class="studentID">${studenInfo.student.IDStudent}</span>
            </div>
            <div class="form-group">
                <label for="studentName" class="form-control-label">Tên học sinh: </label>
                <span class="studentName">${studenInfo.student.user.name}</span>
            </div>
            <div class="form-group">
                <label for="phone" class="form-control-label">Số điện thoại: </label>
                <span class="phone">${studenInfo.student.user.phone}</span>
            </div>
            <div class="form-group">
                <label for="className" class="form-control-label">Lớp: </label>
                <span class="className">211131</span>
            </div>
            <div class="form-group">
                <label for="teacherName" class="form-control-label">Giáo viên: </label>
                <span class="teacherName">211131</span>
            </div>
           ${buttonHtml}
        </form>   
    `)

}