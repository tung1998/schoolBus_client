import {
    Meteor
} from "meteor/meteor"

import {
    LIMIT_DOCUMENT_PAGE
} from './variableConst'

export {
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm,
    redirectLogin,
    addRequiredInputLabel,
    passChangeHandleError,
    getBase64,
    makeID,
    tablePaging
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

function passChangeHandleError(error, title = "") {
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
        width: '30rem'
    });
}

function handleSuccess(type, name = "") {
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


function redirectLogin() {
    Cookies.remove('accessToken');
    Cookies.remove('username');
    localStorage.removeItem('modules');
    FlowRouter.redirect('/login');
    Push.setUser();
}

function addRequiredInputLabel() {
    $(".required-input-label").append(`&nbsp;<span style="color: red;">*</span>`)
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

function tablePaging(tag = '.tablePaging', count, page = 1, limit = LIMIT_DOCUMENT_PAGE) {
    let totalPage = Math.ceil(count / limit);
    let start = page == 1 ? 'kt-datatable__pager-link--disabled disabledPaging' : ''
    let previous = page == 1 ? 'kt-datatable__pager-link--disabled disabledPaging' : ''
    let end = page == totalPage ? 'kt-datatable__pager-link--disabled disabledPaging' : ''
    let next = page == totalPage ? 'kt-datatable__pager-link--disabled disabledPaging' : ''
    let html = `
    <li>
        <a title="Về đầu" class="kt-datatable__pager-link kt-datatable__pager-link--first ${start}" data-page="1">
            <i class="flaticon2-fast-back"></i>
        </a>
    </li>
    <li>
        <a title="Về trước" class="kt-datatable__pager-link kt-datatable__pager-link--prev ${previous}">
            <i class="flaticon2-back"></i>
        </a>
    </li>
    `
    let pages = [page - 2, page - 1, page, page + 1, page + 2]
    pages.forEach(item => {
        if (item > 0 && item <= totalPage) {
            let current = item == page ? 'kt-datatable__pager-link--active' : ''
            html += `<li>
                        <a class="kt-datatable__pager-link kt-datatable__pager-link-number ${current}" data-page=${item} title=${item}>${item}</a>
                    </li>`
        }
    })
    html += `
    <li>
        <a title="Tiếp theo" class="kt-datatable__pager-link kt-datatable__pager-link--next ${next}" data-page=${page}>
            <i class="flaticon2-next"></i>
        </a>
    </li>
    <li>
        <a title="Về cuối" class="kt-datatable__pager-link kt-datatable__pager-link--last ${end}" data-page=${totalPage}>
            <i class="flaticon2-fast-next"></i>
        </a>
    </li>
    `
    $(tag).html(html);
    $(".disabledPaging").attr("disabled", "disabled");
}
