import {
    Meteor
} from "meteor/meteor"

import {
    LIMIT_DOCUMENT_PAGE,
    _METHODS
} from './variableConst'

export {
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm,
    handlePromp,
    redirectLogin,
    addRequiredInputLabel,
    getBase64,
    makeID,
    addPaging,
    tablePaging,
    handlePaging,
    initDropzone,
    removeDuplicated,
    getJsonDefault,
    getLimitDocPerPage,
    convertTime,
    popupDefault,
    removeAllLayer,
    removeLayerByID,
    MeteorCallNoEfect,
    contentInfoMarker
}

function MeteorCall(method = "", data = null, accessToken = "") {
    Session.set('isLoading', true)
    return new Promise((resolve, reject) => {
        console.log(method)
        Meteor.call(method, data, accessToken, (err, result) => {
            Session.set('isLoading', false)
            if (result && result.error) reject(result)
            else if (err) reject(err);
            else resolve(result);
        });
    })
}

function MeteorCallNoEfect(method = "", data = null, accessToken = "") {
    // Session.set('isLoading', true)
    return new Promise((resolve, reject) => {
        console.log(method)
        Meteor.call(method, data, accessToken, (err, result) => {
            // Session.set('isLoading', false)
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


function handleSuccess(title = "Thành công") {
    return Swal.fire({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2000,
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

function handlePromp(title = "Nhập ghi chú ở đây!") {
    return Swal.fire({
        title: title,
        input: 'textarea',
        inputPlaceholder: title,
        showCancelButton: true
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

function addPaging(table) {
    table.after(`
        <div class="kt-datatable__pager">
            <div></div>
            <ul class="kt-datatable__pager-nav tablePaging pull-right">
            </ul>
        </div>
    `)
    table.before(`
        <div class="kt-datatable__pager">
            <div class="kt-datatable__pager-info paging-detail">
                <div class="kt-datatable__pager-detail">Hiển thị 
                <select id="limit-doc" data-width="70px" data-selected="10" tabindex="-98">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select> bản ghi</div>
            </div>
            <div class="entries pull-right">
                <p id="info-record" class="text-muted font-14 pull-right">
                    <code id="document-page">0</code>/<code id="count">0</code> bản ghi
                </p>
            </div>
        </div>
    `)
    $('#limit-doc').select2({
        width: "100%",
        height: "30px",
        minimumResultsForSearch: Infinity,
    })
}

function tablePaging(tablePagingEl, count, page = 1, limit = LIMIT_DOCUMENT_PAGE) {
    let totalPage = Math.ceil(count / limit);
    let start = page == 1 ? 'kt-datatable__pager-link--disabled disabledPaging' : ''
    let previous = page == 1 ? 'kt-datatable__pager-link--disabled disabledPaging' : ''
    let end = page == totalPage ? 'kt-datatable__pager-link--disabled disabledPaging' : ''
    let next = page == totalPage ? 'kt-datatable__pager-link--disabled disabledPaging' : ''
    let html = `
    <li>
        <a title="Trang đầu" class="kt-datatable__pager-link kt-datatable__pager-link--first ${start}" data-page="1">
            <i class="flaticon2-fast-back"></i>
        </a>
    </li>
    <li>
        <a title="Trang trước" class="kt-datatable__pager-link kt-datatable__pager-link--prev ${previous}" data-page=${page - 1}>
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
        <a title="Trang sau" class="kt-datatable__pager-link kt-datatable__pager-link--next ${next}" data-page=${page + 1}>
            <i class="flaticon2-next"></i>
        </a>
    </li>
    <li>
        <a title="Trang cuối" class="kt-datatable__pager-link kt-datatable__pager-link--last ${end}" data-page=${totalPage}>
            <i class="flaticon2-fast-next"></i>
        </a>
    </li>
    `
    tablePagingEl.html(html);
    $(".disabledPaging").prop("disabled", true);
}

function handlePaging(table, count, page, limitDocPerPage) {
    let emptyWrapper = $('#empty-data')
    let documentPage = $("#document-page")
    let tablePagingEl = $(".tablePaging")
    let paggingDetail = $(".kt-datatable__pager-detail")
    let countEl = $("#count")
    countEl.html(count)

    tablePagingEl.addClass('d-none');
    paggingDetail.addClass('d-none');
    table.parent().addClass('d-none');
    emptyWrapper.addClass('d-none');

    if (count === 0) {
        emptyWrapper.removeClass('d-none');
    } else if (count > limitDocPerPage) {
        let startDocIndex = (page - 1) * limitDocPerPage + 1
        let endDocIndex = page * limitDocPerPage
        paggingDetail.removeClass('d-none');
        tablePaging(tablePagingEl, count, page, limitDocPerPage)
        tablePagingEl.removeClass('d-none');
        table.parent().removeClass('d-none');
        documentPage.html(`${startDocIndex}-${endDocIndex < count ? endDocIndex : count}`)
    } else {
        documentPage.html(`1-${count}`)
        table.parent().removeClass('d-none');
    }
}

function initDropzone(dropZoneID) {
    // Dropzone.autoDiscover = false;
    let currentFile = null
    return new Dropzone(dropZoneID, {
        url: "#", // Set the url for your upload script location
        paramName: "file", // The name that will be used to transfer the file
        maxFiles: 1,
        maxFilesize: 5, // MB
        acceptedFiles: "image/*",
        dictUploadCanceled: "",
        init: function () {
            this.on("addedfile", function (file) {
                if (currentFile) {
                    this.removeFile(currentFile);
                }
                currentFile = file;
            });
        }
    })
}

function removeDuplicated(arr, key = 'id') {
    const map = new Map();
    arr.map(el => {
        if (el && !map.has(el[key])) {
            map.set(el[key], el);
        }
    });
    return [...map.values()];
}

function getJsonDefault(json, field, value) {
    let key = Object.keys(json).find(item => json[item][field] === value)
    return Object.assign({}, json[key]);
}

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function convertTime(time, type = false, format = null) {
    if (type == true) {
        if (format) {
            return moment(time).format(format)
        }
        return moment(time).format('L')
    }
    return moment(time, "DD/MM/YYYY").valueOf()
}

function popupDefault(name, address) {
    return `<div class="font-14">
                <dl class="row mr-0 mb-0">
                    <dt class="col-sm-3">Tên điểm dừng: </dt>
                    <dt class="col-sm-9">${name}</dt>
                    <dt class="col-sm-3">Địa chỉ: </dt>
                    <dt class="col-sm-9">${address}</dt>
                </dl>
            </div>`
}


function removeLayerByID(groupLayer, id) {
    groupLayer.eachLayer(function (layer) {
        if (layer._leaflet_id === id) {
            groupLayer.removeLayer(layer)
        }
    });
}

function removeAllLayer(groupLayer) {
    groupLayer.eachLayer((layer) => {
        groupLayer.removeLayer(layer)
    });
}

async function getAddress(lat, lng) {
    try {
        let result = await MeteorCallNoEfect(_METHODS.wemap.getAddress, { lat, lng }, Cookies.get('accessToken'));
        let props = result.features[0].properties;
        let addressElement = [
            props.name||'',
            props.housenumber||'',
            props.street||'',
            props.city||'',
            props.district||'',
            props.state||''
        ]

        let address = addressElement.filter(item=>item).join(', ')
        return address
    } catch (err) {
        handleError(err)
    }
}

function contentInfoMarker(lat, lng, json, mark) {
    const adr = getAddress(lat, lng);
    const fullDate = moment(Number(json.updatedTime)).format('HH:mm:ss DD/MM/YYYY');
    adr.then((result) => {
        let popup = `
        <div class="font-14">
            <dl class="row mr-0 mb-0">
                <dt class="col-sm-6">Biển số: </dt>
                <dt class="col-sm-6">${json.car.numberPlate}</dt>
                <dt class="col-sm-6">Vị trí: </dt>
                <dt class="col-sm-6">${result}</dt>
                <dt class="col-sm-6">Thời điểm cập nhật: </dt>
                <dt class="col-sm-6">${fullDate}</dt>
                <dt class="col-sm-6">Vận tốc: </dt>
                <dt class="col-sm-6">N/A</dt>
            </dl>
        </div>
    `
        mark.bindPopup(popup, {
            minWidth: 301
        });
    })
}