import {
    Meteor
} from "meteor/meteor"

export {
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm,
    redirectLogin,
    addRequiredInputLabel,
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
        timer: 3000,
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


function redirectLogin() {
    Cookies.remove('accessToken');
    Cookies.remove('username');
    localStorage.removeItem('modules');
    FlowRouter.redirect('/login');
    Push.setUser();
}

function addRequiredInputLabel(){
    $(".required-input-label").append(`&nbsp;<span style="color: red;">*</span>`)
  }