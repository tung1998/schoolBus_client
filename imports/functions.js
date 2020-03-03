import {
    Meteor
} from "meteor/meteor"

export {
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm,
    redirectLogin,
    showLoading,
    getBase64,
    makeID
}

function MeteorCall(method = "", data = null, accessToken = "") {
    return new Promise((resolve, reject) => {
        console.log(method)
        Meteor.call(method, data, accessToken, (err, result) => {
            if (result && result.error) reject(result)
            else if (err) reject(err);
            else resolve(result);
        });
    })
}



function handleError(error, title = "Có lỗi xảy ra") {
    console.log(error);
    return Swal.fire({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
        icon: 'error',
        title,
        width: '20rem'
    });
}

function handleSuccess(type, name) {
    let title = type + " " + name + " thành công";
    return Swal.fire({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
        icon: 'success',
        title,
        width: '20rem'
    });
}

function handleConfirm(title = "Bạn đã chắc chắn chưa?") {
    return Swal.fire({
        title,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
    })
}

function showLoading() {
    return Swal.fire({
        title: 'Now loading',
        allowEscapeKey: false,
        allowOutsideClick: false,
        
        onBeforeOpen: () => {
          swal.showLoading();
        }
      })
}


function redirectLogin() {
    Cookies.remove('accessToken');
    Cookies.remove('username');
    localStorage.removeItem('modules');
    FlowRouter.redirect('/login');
    Push.setUser();
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function makeID(text = "", length = 15) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        text += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return text
}