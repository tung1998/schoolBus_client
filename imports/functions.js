import {
    Meteor
} from "meteor/meteor"

export {
    MeteorCall,
    handleError,
    redirectLogin
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
        timer: 5000,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer),
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
        icon: 'error',
        title: 'Có lỗi xảy ra'
    });
}


function redirectLogin() {
    Cookies.remove('accessToken');
    Cookies.remove('username');
    localStorage.removeItem('modules');
    FlowRouter.redirect('/login');
    Push.setUser();
}