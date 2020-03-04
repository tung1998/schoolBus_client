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
})

Template.instascannerModal.events({

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
    alert(content)
    if (/[0-9a-fA-F]{24}/.test(content)) {
        checkStudentInfo(content)
    } else {
        console.log("qr code không đúng định dạng:", content)
    }
}

function renderListCamera(cameras) {
    if (cameras.length) {

        // danh sách camera
        Cameras = cameras
        Scanner.start(cameras[0]);
    } else {
        handleError(cameras, 'Không tìm thấy camera')
    }
}