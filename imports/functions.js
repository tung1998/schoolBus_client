import {
    Meteor
} from "meteor/meteor"

export {
    MeteorCall,
    handleError,
    handleSuccess,
    handleDelete,
    redirectLogin,
}

function MeteorCall(method = "", data = null, accessToken = "") {
    return new Promise((resolve, reject) => {
        Meteor.call(method, data, accessToken, (err, result) => {
            if (result && result.error) reject(result)
            else if (err) reject(err);
            else resolve(result);
        });
    })
}



function handleError(error) {
    console.log(error);
    return Swal.fire({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer),
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
        icon: 'error',
        title: 'Có lỗi xảy ra',
        width: '20rem'
    });
}

function handleSuccess(type, name) {
    let title = type + name + "thành công";
    return Swal.fire({
        icon: 'success',
        title: title,
        showConfirmButton: false,
        width: "25rem",
        timer: 3000
    });
}

function handleDelete() {
    return Swal.fire({
        title: 'Bạn đã chắc chắn chưa?',
        text: "Bạn sẽ không thể khôi phục sau khi xóa!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý',
        cancelButtonText : 'Hủy'
      })
}


function redirectLogin() {
    Cookies.remove('accessToken');
    Cookies.remove('username');
    localStorage.removeItem('modules');
    FlowRouter.redirect('/login');
    Push.setUser();
}