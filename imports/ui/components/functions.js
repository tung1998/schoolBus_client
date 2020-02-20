
import XLSX from 'xlsx'
const Cookies = require('js-cookie');

import {
    height_tab_2,
    str_hour_minute,
    LIMIT_DOCUMENT_PAGE,
    UNIT_PRICE,
    HOST,
    _TRIP,
    USER_TYPE,
    SESSION,
    str_format_time,
    TIME_DEFAULT,
    ICONHTML,
    USER_TYPE2,
    MAINTENANCESTYPE_NOT_USE,
    MAINTENANCESTYPE,
} from './variableConst';

let panPath = []; // An array of points the current panning action will use
let panQueue = []; // An array of subsequent panTo actions to take
let STEPS = 10; // The number of steps that each panTo action will undergo

/**
 *
 * @param latLng {Array}
 * @param zoom {Number}
 */

function jumpToMarker(map, latLng, zoom) {
    // const map = GoogleMaps.maps.mymap.instance;
    // map.setCenter(new google.maps.LatLng(Number(latLng[0]), Number(latLng[1])));
    // panTo(Number(latLng[0]), Number(latLng[1]));
    // animateMapZoomTo(map, zoom);
    map.setView(latLng, zoom)
}

// the smooth zoom function
function animateMapZoomTo(map, targetZoom) {
    var currentZoom = arguments[2] || map.getZoom();
    if (currentZoom != targetZoom) {
        google.maps.event.addListenerOnce(map, 'zoom_changed', function (event) {
            animateMapZoomTo(map, targetZoom, currentZoom + (targetZoom > currentZoom ? 1 : -1));
        });
        setTimeout(function () {
            map.setZoom(currentZoom)
        }, 80);
    }
}

function panTo(newLat, newLng) {
    const map = GoogleMaps.maps.mymap.instance;
    if (panPath.length > 0) {
        // We are already panning...queue this up for next move
        panQueue.push([newLat, newLng]);
    } else {
        // Lets compute the points we'll use
        panPath.push("LAZY SYNCRONIZED LOCK"); // make length non-zero - 'release' this before calling setTimeout
        let curLat = map.getCenter().lat();
        let curLng = map.getCenter().lng();
        let dLat = (newLat - curLat) / STEPS;
        let dLng = (newLng - curLng) / STEPS;

        for (let i = 0; i < STEPS; i++) {
            panPath.push([curLat + dLat * i, curLng + dLng * i]);
        }
        panPath.push([newLat, newLng]);
        panPath.shift(); // LAZY SYNCRONIZED LOCK
        setTimeout(doPan, STEPS);
    }
}

function doPan() {
    const map = GoogleMaps.maps.mymap.instance;
    let next = panPath.shift();
    if (next != null) {
        // Continue our current pan action
        map.panTo(new google.maps.LatLng(next[0], next[1]));
        setTimeout(doPan, STEPS);
    } else {
        // We are finished with this pan - check if there are any queue'd up locations to pan to
        let queued = panQueue.shift();
        if (queued != null) {
            panTo(queued[0], queued[1]);
        }
    }
}

/**
 * Tinh khoang cach giua hai dia diem
 * @param loc1 {Array}
 * @param loc2 {Array}
 *
 * */

function getDistanceFromLatLonInKm(loc1, loc2, toFixed = 3) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(loc2[0] - loc1[0]); // deg2rad below
    const dLon = deg2rad(loc2[1] - loc1[1]);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(loc1[0])) * Math.cos(deg2rad(loc2[0])) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return Number(d.toFixed(toFixed));
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

/**
 *
 * @param location {Array}
 * @returns {{lat: number, lng: number}}
 */
function locationToJson(location) {
    return {
        lat: Number(location[0]),
        lng: Number(location[1])
    }
}

/**
 *
 * @param location {Object}
 * @returns {*[]}
 */
function locationToArray(location) {
    return [Number(location.lat), Number(location.lng)];
}

function handleDistance(distance) {
    if (distance >= 1000) return (distance / 1000).toFixed(2) + ' km';
    else return Math.round(distance) + ' m';
}

function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

function isJson(what) {
    return Object.prototype.toString.call(what) === '[object Object]';
}

function isNumber(what) {
    return Object.prototype.toString.call(what) === '[object Number]';
}


const arrStatusCar = [{
        text: 'Sẵn sàng chạy',
        className: 'success'
    },
    {
        text: 'Đang chạy',
        className: 'warning'
    },
    {
        text: 'Đang Sửa chữa',
        className: 'danger'
    },
];
const arrType = [{
        text: 'Điểm đón/trả',
        className: 'primary'
    },
    {
        text: 'Điểm bắt buộc đi qua',
        className: 'info'
    },
    {
        text: 'Điểm trung chuyến',
        className: 'danger'
    },
];
const arrStatusDriver = [{
        text: 'Sẵn sàng',
        className: 'primary'
    },
    {
        text: 'status 2',
        className: 'info'
    },
    {
        text: 'status 3',
        className: 'danger'
    },
];
const arrFuel = [{
        text: 'Dầu',
        className: 'primary'
    },
    {
        text: 'Xăng',
        className: 'info'
    },
];
const arrMaintenanceType = [{
        text: 'Sửa chữa',
        className: 'primary'
    },
    {
        text: 'Bảo trì',
        className: 'info'
    },
];
const arrSeatType = [{
        text: 'Khách lẻ',
        className: 'info'
    },
    {
        text: 'Bao trọn',
        className: 'primary'
    },
];
const arrFeedbackType = [{
        text: 'Góp ý',
        className: 'info'
    },
    {
        text: 'Báo cáo',
        className: 'danger'
    },
    {
        text: 'Hỗ trợ',
        className: 'warning'
    },
];
const arrFeedbackStatus = [{
        text: 'Chưa phản hồi',
        className: 'danger'
    },
    {
        text: 'Đã phản hồi',
        className: 'success'
    },
];
const arrOperatorStatus = [{
        text: 'Sẵn sàng',
        className: 'info'
    },
    {
        text: 'Đang làm việc',
        className: 'success'
    },
];
const arrOperatorType = [{
        text: 'Tổng đài viên',
        className: 'info'
    },
    {
        text: 'Điều phối viên',
        className: 'success'
    },
];

function statusCar(id) {
    id = id == null ? 0 : id;
    return arrStatusCar[id];
}

function type(id) {
    return arrType[id];
}

function statusDriver(id) {
    return arrStatusDriver[id];
}

function fuel(id) {
    return arrFuel[id];
}

function seatType(id) {
    return arrSeatType[id];
}

function maintenanceType(id) {
    id = id == null ? 0 : id;
    return arrMaintenanceType[id];
}

function formatMoney(price, unit_symbol = UNIT_PRICE.vnd_symbol) {
    let billions = '',
        millions = '',
        thousands = 0,
        unit = `000`
    let num = price;
    // console.log(price, typeof price);

    if (num === 0 || num == null) return '0'
    price = Math.abs(num);
    if (price >= 1e9) {
        billions = Math.floor(price / 1e9)
        price -= Number(billions) * 1e9
    }
    if (price >= 1e6) {
        millions = Math.floor(price / 1e6)
        price -= Number(millions) * 1e6
    }
    if (price >= 1e3) {
        thousands = Math.floor(price / 1e3) || 0
        price -= Number(thousands) * 1e3
    }
    if (thousands > 9 && thousands < 99 && millions) {
        thousands = `0${thousands}`
    } else if (thousands < 9 && millions) {
        thousands = `00${thousands}`
    }

    if (millions > 9 && millions < 99 && billions) {
        millions = `0${millions}`
    } else if (millions < 9 && billions) {
        millions = `00${millions}`
    }

    price = ''
    if (billions)
        price += `${billions}.`
    if (millions)
        price += `${millions}.`
    if (thousands)
        price += `${thousands}.`
    if (!millions && !thousands)
        unit = 0
    price += `${unit} ${unit_symbol}`
    // console.log(num);
    if (num >= 0)
        return price
    else return (`-${price}`);
}

function formatReduceThousand(price) {
    return Math.floor(price / 1000)
}

function formatMoneyNoUnitReduceThousand(price) {
    let billions = '',
        millions = '',
        thousands = 0;
    let num = price;
    // console.log(price, typeof price);

    if (num === 0 || num == null) return '0'
    price = Math.abs(num);
    if (price >= 1e9) {
        billions = Math.floor(price / 1e9)
        price -= Number(billions) * 1e9
    }
    if (price >= 1e6) {
        millions = Math.floor(price / 1e6)
        price -= Number(millions) * 1e6
    }
    if (price >= 1e3) {
        thousands = Math.floor(price / 1e3) || 0
        price -= Number(thousands) * 1e3
    }
    if (thousands > 9 && thousands < 99 && millions) {
        thousands = `0${thousands}`
    } else if (thousands < 9 && millions) {
        thousands = `00${thousands}`
    }

    if (millions > 9 && millions < 99 && billions) {
        millions = `0${millions}`
    } else if (millions < 9 && billions) {
        millions = `00${millions}`
    }

    price = ''
    if (billions)
        price += `${billions}.`
    if (millions)
        price += `${millions}.`
    if (thousands)
        price += `${thousands}`
    if (!millions && !thousands)
        unit = 0
    if (num >= 0)
        return price
    else return (`-${price}`);
}

function formatMoneyNotUnit(price) {
    let regexp = new RegExp(`( ${UNIT_PRICE.vnd})|( ${UNIT_PRICE.vnd_symbol})`, 'g');
    return formatMoney(price).replace(regexp, '');
}

function formatMoneyUnique(price) {
    let regexp = new RegExp(`( ${UNIT_PRICE.vnd})|( ${UNIT_PRICE.vnd_symbol})`, 'g');
    if (price == 0) return `0 k`;
    return formatMoney(price).replace(regexp, '').replace(/.000$/, 'k');
}

function getPrice(money = '') {
    let regexp = new RegExp(`( ${UNIT_PRICE.vnd})|( ${UNIT_PRICE.vnd_symbol})`, 'g');
    return Number(money.replace(regexp, '').split('.').join('')) || 0
}

function valueOfObjectToNumber(object) {
    Object.keys(object).forEach(key => {
        object[key] = Number(object[key])
    });
    return object;
}

function valueOfArrayToNumber(array) {
    return array.map(key => Number(key));
}

function feedbackType(id) {
    return arrFeedbackType[id];
}

function feedbackStatus(id) {
    return arrFeedbackStatus[id];
}

function operatorStatus(id) {
    return arrOperatorStatus[id];
}

function departmentStatus(status) {
    let json = {
        className: '',
        text: '',
    }
    switch (status) {
        case 0:
            json = {
                className: 'success',
                text: 'Sẵn sàng',
            }
            break;
        default:
            json = {
                className: 'primary',
                text: 'Đang làm việc',
            }
            break;
    }
    return json;
}

function operatorType(isManager) {
    let id = isManager ? 1 : 0
    return arrOperatorType[id];
}

function getHour(timestamp = Date.now()) {
    let day = new Date(timestamp)
    let h = `${day.getHours()}`
    if (h.length === 1)
        h = `0${h}`
    let m = `${day.getMinutes()}`
    if (m.length === 1)
        m = `0${m}`
    return `${h}:${m}`
}

function getHourDate(timestamp = Date.now()) {
    let day = new Date(timestamp)
    let h = `${day.getHours()}`
    if (h.length === 1)
        h = `0${h}`
    let m = `${day.getMinutes()}`
    if (m.length === 1)
        m = `0${h}`
    return `${h}h${m}`
}

function getQueryVariable(variable = '') {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}

function addAnimate(target, classAnimation, timeOut = 500) {
    return new Promise(resolve => {
        target.toggleClass(`${classAnimation} animated`);
        setTimeout(() => {
            target.toggleClass(`${classAnimation} animated`);
            resolve();
        }, timeOut);
    });
}

let delay = (function () {
    let timer = 0;
    return (callback, ms) => {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    }
})();

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function capitalizeWord(text) {
    if(!text) return '';
    let temp = text.trim().replace(/  +/g, ' ');

    return temp.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
}

function addScrollToDiv(element, height = height_tab_2, targetScroll) {
    setTimeout(() => {
        let options = {
            height: height + 'px',
            position: 'right',
            size: "5px",
            color: '#9ea5ab',
            // scrollTo: "150px"
        };
        // console.log(options);
        $(element).slimscroll(options);

    }, 50);
}

function destroySlimscroll(objectId) {
    $(objectId).attr('style', '').parent().replaceWith($(objectId));
}

function randomString(len = 5) {
    let text = ``
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    for (let i = 0; i < len; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length))

    return text
}

// function countBackTime(time, element) {
//     let second = time / 1000;
//     element.html(second);
//     if (second > 0) {
//         setTimeout(() => {
//             countBackTime(time - 1000, element);
//         }, 1000);
//     }
// }

function countBackTime(time, element, htmlFunc, elementDisabled, disabled = false) {
    let second = time / 1000;
    if (elementDisabled) elementDisabled.prop('disabled', disabled);
    element.html(htmlFunc ? htmlFunc(second) : second);
    if (second > 0) {
        setTimeout(() => {
            countBackTime(time - 1000, element, htmlFunc, elementDisabled, disabled);
        }, 1000);
    } else {
        element.empty();
        if (elementDisabled) elementDisabled.prop('disabled', false);
    }
}
/**
 *
 * @param {string} tag is ID or Class of element
 * @param {Number} time is second
 */
function countTimeFormated(tag, time) {
    let target = $(tag);
    target.html(hhmmss(time));
    let countTime = time;
    let timeInterval = setInterval(() => {
        countTime--;
        if (countTime < 0) {
            clearInterval(timeInterval);
            timeInterval = null;
            target.html('');
            return;
        } else target.html(hhmmss(countTime));
    }, 1000);
    return timeInterval;
}

function pad(num) {
    return ("0" + num).slice(-2);
}

function hhmmss(secs) {
    var minutes = Math.floor(secs / 60);
    secs = secs % 60;
    var hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    if (hours) hours = `${pad(hours)}:`;
    else hours = '';

    return `${hours}${pad(minutes)}:${pad(secs)}`;
}

function formatPhoneNumber(phone, kyTu = '.') {
    if (phone === undefined)
        return null;
    switch (phone.length) {
        case 10:
            return phone.replace(/(\d{4})(\d{3})(\d{3})/, `$1${kyTu}$2${kyTu}$3`);
        case 11:
            return phone.replace(/(\d{5})(\d{3})(\d{3})/, `$1${kyTu}$2${kyTu}$3`);
        default:
            return phone;
    }
}

function formatSeats(seats) {
    let json = {}
    if (seats === undefined)
        return {
            text: '',
            className: ''
        }
    json.text = seats;
    switch (Number(seats)) {
        case 0:
            json.className = 'dark';
            break;
        case 1:
            json.className = 'primary';
            break;
        case 2:
            json.className = 'success';
            break;
        case 3:
            json.className = 'info';
            break;
        case 4:
            json.className = 'warning';
            break;
        case 5:
            json.className = 'danger';
            break;
        case 6:
            json.className = 'danger';
            break;
        case 7:
            json.className = 'danger';
            break;
    }
    return json;
}

function copytext(text = '', element = 'input-copy') {
    let copyText = document.getElementById(element);
    copyText.value = text;
    copyText.select();
    document.execCommand("copy");
    alertify.success('Đã copy!');
    copyText.value = '';
}

function calculatorTimeStartEnd(date, NumberDay = 1) {
    return {
        endTime: new Date(date.setHours(23, 59, 59, 0)),
        startTime: new Date(date.setDate(date.getDate() - NumberDay) + 1000)
    }
}

/**
 * input: string date, eg: 26/02/2019
 * return .getTime()
 */
export function calculatorTimeWithShortDate(strDateStart, strDateEnd) {
    let startDate = strDateStart.split('/');
    let endDate = strDateEnd.split('/');
    return {
        startTime: new Date(`${startDate[1]}/${startDate[0]}/${startDate[2]}`).getTime(),
        endTime: new Date(`${endDate[1]}/${endDate[0]}/${endDate[2]}`).setHours(23, 59, 59, 0),
    }
}

function handleTripSeats(seats) {
    let result = {
        text: seats
    };
    if (seats > 7) {
        result.className = 'info'
    } else if (seats > 0) {
        result.className = 'success'
    } else {
        result.className = ''
    }
    return result
}

function randomIntFromInterval(min, max) // min and max included
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function jsonEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

function getDateTime(value) {
    if (value === undefined) return '';
    let date = value.split(/\/|\:| /);
    return new Date(date[2], date[1] - 1, date[0]);
}

function styleCarModels(seats) {
    let result = {
        text: `${seats} chỗ`
    };
    if (seats > 7) {
        result.className = 'primary'
    } else if (seats > 5) {
        result.className = 'success'
    } else if (seats > 0) {
        result.className = 'warning'
    } else {
        result.className = ''
    }
    return result
}

function getStringTimeShort(numberTime) {
    return moment(new Date(Number(numberTime))).format(str_hour_minute + ' ' + 'DD/MM');
}

function getStringHourMinute(numberTime) {
    return moment(new Date(Number(numberTime))).format(str_hour_minute);
}

function momentFormatTime(numberTime, format = str_hour_minute) {
    return moment(new Date(Number(numberTime))).format(format);
}

export function formatTimeNotUseMoment(numberTime) {
    return formatTime(numberTime) + " " + formatDate(numberTime);
}

/**
 * time: IOSstring
 * Ham chuyen 'time' ve dang nam-thang-ngay
 *
 * */
function formatDate(time, yesterday = false) {
    time = Number(time);
    if (yesterday) {
        time -= 60 * 60 * 24 * 1000
    }
    const date = new Date(time);
    const y = date.getFullYear();
    const m = formatNumber(date.getMonth() + 1);
    const d = formatNumber(date.getDate());
    return `${d}/${m}/${y}`;
}

/**
 * time: IOSstring
 * Ham chuyen 'time' ve dang gio-phut-giay
 *
 * */
function formatTime(time, yesterday = false) {
    if (yesterday) {
        time -= 60 * 60 * 24 * 1000
    }
    const date = new Date(time);
    const hh = formatNumber(date.getHours());
    const mm = formatNumber(date.getMinutes());
    // const ss = formatNumber(date.getSeconds());
    return `${hh}:${mm}`;
}

/**
 * number: int
 * Ham dinh dang hien thi 'number'
 *  vd: 6 ==> 06...
 *
 * */
function formatNumber(number) {
    return number >= 10 ? number : `0${number}`;
}

function typeObject(id, value) {
    let data = $(`#${id} option[value="${value}"]`);
    return {
        text: data.text(),
        className: data.attr('data-color')
    };
}

function PrintElem(elem, css) {
    let mywindow = window.open('');
    mywindow.document.write(`
    <html>
      <head>
        ${css}
      </head>
      <body >
       ${document.getElementById(elem).innerHTML}
      </body>
    </html>`);
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    setTimeout(() => {
        mywindow.print();
        mywindow.close();
    }, 500);

    return true;
}

function tablePaging(tag = '.tablePaging', count, page = 1, limit = LIMIT_DOCUMENT_PAGE) {
    let totalPage = Math.ceil(count / limit);
    let start = page == 1 ? 'disabled' : ''
    let previous = page == 1 ? 'd-none' : ''
    let end = page == totalPage ? 'disabled' : ''
    let next = page == totalPage ? 'd-none' : ''
    let html = `
    <li class="page-item ${start}">
        <a class="page-link" data-page="1" href="#" aria-label="Về  đầu" title="Về đầu">
            <span aria-hidden="true">Về đầu</span>
        </a>
    </li>
    <li class="page-item ${previous}">
        <a class="page-link" data-page="${page - 1}" href="#" aria-label="Trang trước" title="Trang trước">
            <span aria-hidden="true">«</span>
            <span class="sr-only">Trang trước</span>
        </a>
    </li>
    `
    let pages = [page - 2, page - 1, page, page + 1, page + 2]
    pages.forEach(item => {
        if (item > 0 && item <= totalPage) {
            let current = item == page ? 'active' : ''
            html += `<li class="page-item ${current}"><a class="page-link" data-page="${item}" href="#">${item}</a></li>`
        }
    })
    html += `
    <li class="page-item ${next}">
        <a class="page-link" data-page="${page + 1}" href="#" aria-label="Trang sau" title="Trang sau">
            <span aria-hidden="true">»</span>
            <span class="sr-only">Trang sau</span>
        </a>
    </li>
    <li class="page-item ${end}">
        <a class="page-link" data-page="${totalPage}" href="#" aria-label="Về  cuối" title="Về  cuối">
            <span aria-hidden="true">Về cuối</span>
        </a>
    </li>
    `
    $(tag).html(html)
}

function getPageCurrent(wrapper) {
    let parent = wrapper ? wrapper + ' ' : '';
    let item_active = `${parent}.page-item.active`;
    return parseInt($(item_active).find('.page-link').data('page'));
}

export const num2Word = function () {
    var t = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"],
        r = function (r, n) {
            var o = "",
                a = Math.floor(r / 10),
                e = r % 10
            return a > 1 ? (o = " " + t[a] + " mươi", 1 == e && (o += " mốt")) : 1 == a ? (o = " mười", 1 == e && (o += " một")) : n && e > 0 && (o = " lẻ"), 5 == e && a >= 1 ? o += " lăm" : 4 == e && a >= 1 ? o += " tư" : (e > 1 || 1 == e && 0 == a) && (o += " " + t[e]), o
        },
        n = function (n, o) {
            var a = "",
                e = Math.floor(n / 100),
                n = n % 100;
            return o || e > 0 ? (a = " " + t[e] + " trăm", a += r(n, !0)) : a = r(n, !1), a
        },
        o = function (t, r) {
            var o = "",
                a = Math.floor(t / 1e6),
                t = t % 1e6;
            a > 0 && (o = n(a, r) + " triệu", r = !0);
            var e = Math.floor(t / 1e3),
                t = t % 1e3;
            return e > 0 && (o += n(e, r) + " nghìn", r = !0), t > 0 && (o += n(t, r)), o
        };
    return {
        convert: (r) => {
            if (r < 0) return '';
            let word = num2Word.doc(r)
            return word != '' ? capitalizeFirstLetter(word) + ' ' + num2Word.unitMoney : word;
        },
        unitMoney: 'đồng',
        doc: function (r) {
            if (0 == r) return t[0];
            // else if (0 > r) return "Âm";
            var n = "",
                a = "";
            do ty = r % 1e9, r = Math.floor(r / 1e9), n = r > 0 ? o(ty, !0) + a + n : o(ty, !1) + a + n, a = " tỷ";
            while (r > 0);
            return n.trim()
        }
    }
}();

export function redirectLogin() {
    Cookies.remove('accessToken');
    Cookies.remove('username');
    localStorage.removeItem('modules');
    FlowRouter.redirect('/login');
    Push.setUser();
}

export function styleBootstrap() {
    let str_font = '';
    for (let i = 1; i < 40; i++) {
        str_font += `.font-${i}{font-size: ${i}px!important;}`
    }
    return `
    <style type="text/css">
        *{font-family: arial, Roboto, Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif !important;}
        .h1,.h2,.h3,.h4,.h5,.h6,h1,h2,h3,h4,h5,h6{font-family:inherit;font-weight:400;color:inherit;}.h1,h1{font-size:2.5rem;}.h2,h2{font-size:2rem;}.h3,h3{font-size:1.75rem;}.h4,h4{font-size:1.5rem;}.h5,h5{font-size:1.25rem;}.h6,h6{font-size:1rem;}
        .text-uppercase {text-transform: uppercase!important;}
        .text-capitalize {text-transform: capitalize!important;}
        .font-weight-bold {font-weight: 700!important;}
        ${str_font}
        .text-center {text-align: center!important;}
        .text-right {text-align: right!important;}
        .text-nowrap {white-space: nowrap!important; overflow: hidden;}
        .text-justify {text-align: justify!important;}
        .m-0 {margin: 0!important;}
        .mb-0{margin-bottom: 0 !important;}
        .mt-0{margin-top: 0 !important;}
        .m-t-3{margin-top: 3px !important;}
        .m-t-5{margin-top: 5px !important;}
        .m-t-10{margin-top: 10px !important;}
        .m-t-15{margin-top: 15px !important;}
        .m-t-20{margin-top: 20px !important;}
        .m-t-30{margin-top: 30px !important;}
        .m-t-100{margin-top: 100px !important;}
        .pb-0{padding-bottom: 0 !important;}
        .p-b-3{padding-bottom: 3px !important;}
        .p-b-5{padding-bottom: 5px !important;}
        .p-b-10{padding-bottom: 10px !important;}
        .p-b-15{padding-bottom: 15px !important;}
        .p-b-20{padding-bottom: 20px !important;}
        .p-b-30{padding-bottom: 30px !important;}
        .p-b-40{padding-bottom: 40px !important;}
        .p-b-50{padding-bottom: 50px !important;}
        .p-b-100{padding-bottom: 100px !important;}
        .pt-0{padding-top: 0 !important;}
        .p-t-3{padding-top: 3px !important;}
        .p-t-5{padding-top: 5px !important;}
        .p-t-10{padding-top: 10px !important;}
        .p-t-15{padding-top: 15px !important;}
        .p-t-20{padding-top: 20px !important;}
        .p-t-30{padding-top: 30px !important;}
        .p-t-60{padding-top: 60px !important;}
        .p-t-100{padding-top: 100px !important;}
        .p-l-3{padding-left: 3px !important;}
        .p-l-5{padding-left: 5px !important;}
        .p-l-10{padding-left: 10px !important;}
        .p-l-15{padding-left: 15px !important;}
        .p-l-20{padding-left: 20px !important;}
        .p-l-100{padding-left: 100px !important;}
        .row{display: flex;flex-wrap: wrap;margin-right: -15px;margin-left: -15px;}
        .col-12{flex: 0 0 100%;max-width: 100%;}
        .col-10{flex: 0 0 83.33333%;max-width: 83.33333%;}
        .col-2{flex: 0 0 16.66667%;max-width: 16.66667%;}
        .col-8{flex: 0 0 66.66667%;max-width: 66.66667%;}
        .col-5{flex: 0 0 41.66667%;max-width: 41.66667%;}
        .col-4{flex: 0 0 33.33333%;max-width: 33.33333%;}
        .col-7{flex: 0 0 58.33333%;max-width: 58.33333%;}
        .col-6{flex: 0 0 50%;max-width: 50%;}
        .col-3{flex: 0 0 25%;max-width: 25%;}
        .col-12, .col-10, .col-2, .col-8, .col-4, .col-7, .col-6, .col-3, .col-5
        {position: relative;width: 100%;min-height: 1px;padding-right: 15px;padding-left: 15px;}
        .text-underline{text-decoration: underline;}
        .font-italic {font-style: italic!important;}
    </style>`
}

export function cssSettingPagePrint({
    paperSize,
    layout,
    margin = '10px 20px'
}) {
    let _layout = layout == 'ngang' ? ' landscape' : '';
    let page = `${paperSize} ${_layout}`;
    // console.log(page);
    return `<style type="text/css">
            @page{size: ${page}; margin: ${margin};}
            @media print{
                .pageBreak {
                    page-break-after : always;
                    page-break-inside : avoid;
                }
            }
            </style>`
}

export function includeHost(hosts = [HOST.localhost]) {
    return hosts.some(host => host === window.location.host)
}

// Tính tổng với item có key: price
export function sumHasKeyPrice(sum, item) {
    if (item.price) return sum + item.price;
    return sum;
}

export function iconReload(parentID = '', action = 'show') {
    let $parent = $(`#${parentID}`);
    let $icon_load = $parent.find('.icon-reload');
    if (action == 'show') {
        $icon_load.removeClass('d-none').addClass('rotate360');
        $parent.prop('disabled', true);
    } else if (action = 'hide') {
        $icon_load.addClass('d-none').removeClass('rotate360');
        $parent.prop('disabled', false);
    }
}

export function doit({
    type,
    idTable,
    fileName,
}, fn, dl) {
    var elt = document.getElementById(idTable);
    var wb = XLSX.utils.table_to_book(elt, {
        sheet: "Sheet JS",
    });
    // for(var R = range.s.r; R <= range.e.r; ++R) {
    //     for(var C = range.s.c; C <= range.e.c; ++C) {
    //         var cell_address = {c:C, r:R};
    //         console.log(cell_address)
    //         /* if an A1-style address is needed, encode the address */
    //         // var cell_ref = XLSX.utils.encode_cell(cell_address);
    //     }
    // }
    return dl ?
        XLSX.write(wb, {
            bookType: type,
            bookSST: true,
            type: 'base64'
        }) :
        XLSX.writeFile(wb, fn || ((fileName || 'test') + '.' + (type || 'xlsx')));
}

function getStatusDefault(status, JSON_DEFAULT) {
    let key = Object.keys(JSON_DEFAULT.status).find(item => JSON_DEFAULT.status[item].number === status)
    return Object.assign({}, JSON_DEFAULT.status[key]);
}

function getTypeDefault(type, JSON_DEFAULT) {
    let key = Object.keys(JSON_DEFAULT.type).find(item => JSON_DEFAULT.type[item].number === type)
    return Object.assign({}, JSON_DEFAULT.type[key]);
}

function getJsonDefault(type, JSON_DEFAULT) {
    let key = Object.keys(JSON_DEFAULT).find(item => JSON_DEFAULT[item].number === type)
    return Object.assign({}, JSON_DEFAULT[key]);
}

function getMaintenance(type, JSON_DEFAULT) {
    let key = Object.keys(JSON_DEFAULT).find(item => JSON_DEFAULT[item].type === type)
    return Object.assign({}, JSON_DEFAULT[key]);
}

function getBillTrip(tripID, JSON_DEFAULT) {
    let key = Object.keys(JSON_DEFAULT).find(item => JSON_DEFAULT[item].tripID === tripID)
    return Object.assign({}, JSON_DEFAULT[key]);
}


function iconHTML(name, {
    by = 'mdi',
    fontSize = '',
    textColor = '',
    spin = '',
    isHide = '',
    classAppend = '',
    attr = '',
}) {
    return `<i class="${by} ${by}-${name} font-${fontSize} text-${textColor} ${isHide == 'hide' ? 'd-none' : ''} ${by}-${spin} ${classAppend}" ${attr}></i>`
}

/**
 * trả về url home default theo user khi user login hoặc vào "/" (phiethoc.247car.vn)
 * url sẽ được sử dụng vào hàm Flowrouter.go(url)
 */

function getHomeByUser(userType) {
    let url = '#';
    if (userType == USER_TYPE.driver) {
        url = '/driver/list-trip';
    } else if (userType == USER_TYPE.customer) {
        url = '/customer/home';
    } else {
        url = '/profile';
    }
    return url;
}

/**
 * Ẩn hiện menu trên mobile
 * @param {boolean} show
 */
function menuShow(show = true) {
    // var bodyContent = $('.body-content');
    var contentWrapper = $("#wrapper");
    var divBackdrop = $(".div-backdrop");
    // var sidebar = $("#sidebar-main");
    // var preloaderStatus = $('#status');
    // var preloaderContainer = $('#preloader');
    // var mobileToggle = $('.button-menu-mobile');
    // var fullScreenToggle = $("#btn-fullscreen");
    // var sideMenuItems = $("#sidebar-menu a");
    // var sideSubMenus = $('.has_sub');
    if (show) {
        contentWrapper.addClass('enlarged');
        divBackdrop.removeClass('d-none').addClass('show');
    } else {
        contentWrapper.removeClass('enlarged');
        divBackdrop.addClass('d-none').removeClass('show');
    }
}

function getNumberInString(str) {
    if (typeof str == 'string') {
        let numb = str.match(/\d/g);
        numb = numb.join("");
        return Math.abs(numb);
    } else {
        return Math.abs(str);
    }
};

function Export2Doc(element, filename = '', {
    css = ''
}) {
    var preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title>
    ${css}
    </head><body>`;
    var postHtml = "</body></html>";
    var html = preHtml + document.getElementById(element).innerHTML.replace(/\./g, '') + postHtml;

    var blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });

    // Specify link url
    var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);

    // Specify file name
    filename = filename ? filename + '.docx' : 'document.docx';

    // Create download link element
    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        // Create a link to the file
        downloadLink.href = url;

        // Setting the file name
        downloadLink.download = filename;

        //triggering the function
        downloadLink.click();
    }

    document.body.removeChild(downloadLink);
}

/**
 * Hàm init date picker mặc định
 * lùi về quá khứ "day" ngày, default: 0 = ngày hiện tại
 * return el: sau khi gọi hàm, nếu muốn sử dụng event change khi thay đổi ngảy của date picker thì gọi hàm .bind('change', callback);
 * */

function initDatePickerDefault(tag, formatDate, options, value) {
    let ops = {
        format: formatDate,
        lang: 'vi',
        switchOnClick: true
    }
    if (options) ops = {
        ...ops,
        ...options
    }; // copy object trong ES6
    // $(tag).bootstrapMaterialDatePicker('destroy');
    let el = $(tag).bootstrapMaterialDatePicker(ops);
    if (value) {
        el.val(value);
    }
    return el;
}

function getFirstLastDayOfWeek(curr = new Date, format) {
    var firstday = moment(curr).startOf('isoWeek').format(format);
    var lastday = moment(curr).endOf('isoWeek').format(format);
    return {
        firstday,
        lastday
    }
}

function weekOfMonth(date = moment("01/05/2019", "DD/MM/YYYY")) {
    let weekInYearIndex = date.week();
    // console.log(date);
    if (date.year() !== date.weekYear()) {
        weekInYearIndex = date.clone().subtract(1, 'week').week() + 1;
    }
    const weekIndex = weekInYearIndex - moment(date).startOf('month').week() + 1;
    // console.log(weekIndex);
    return weekIndex;
}

function isSuperAdmin() {
    return (Cookies.get("username") === "superadmin")
}

function preLoader(status = 'show') {
    if (status == 'show')
        $('#preloader').removeClass('d-none');
    else {
        $('#preloader').addClass('d-none');
    }
}

function cardTripDefault({
    title,
    start,
    end,
    pickup,
    takeoff,
    price,
    car,
    trip,
    classCard,
}, {
    dnone = [],
    appendHeader = '',
    appendBody = '',
}) {
    // console.log(pickup, takeoff);
    let pCarStopID = pickup.carStopID ? pickup.carStopID : (pickup.carStop && pickup.carStop.carStopID ? pickup.carStop.carStopID : '');
    let tCarStopID = takeoff.carStopID ? takeoff.carStopID : (takeoff.carStop && takeoff.carStop.carStopID ? takeoff.carStop.carStopID : '');
    let timeTakeoff;
    if (takeoff && takeoff.time) timeTakeoff = takeoff.time;
    else timeTakeoff = Number(trip.startTime) + TIME_DEFAULT.trip_end_default * 60 * 1000;
    return `<div class="card mb-2 p-2 card-trip ${classCard || ''}" tripID="${trip._id}" pickupID="${pCarStopID}" takeoffID="${tCarStopID}">
                ${appendHeader}
                <div class="card-body p-0">
                    <div class='wrapper-info-trip'>
                        <div class="font-weight-bold">${title}</div>
                        <!-- điểm đón -->
                        <div class="row pl-2 pr-2 wrapper-pickup">
                            <div class="align-items-center d-flex pl-1 pr-1">
                                <div class="m-auto">
                                    <img src="/img/icons/marker/customer_trip_pickup.png" alt="" style="height: 15px; width: 15px;">
                                </div>
                            </div>
                            <div class="col pl-0">
                                <div class="row">
                                    <div class="col-12 text-muted">
                                        <div class="row">
                                            <div class="pl-3 text-FIMO carStopTime my-auto" time=${pickup.time}>
                                                ${momentFormatTime(pickup.time, str_format_time.hour_minute)}
                                            </div>
                                            <div class="col text-muted">
                                                <div class="row">
                                                    <div class="col pl-1 pr-0 carStopAddress my-auto">${pickup.address || ''}</div>
                                                    <div class="col pr-2 pl-1 text-right text-FIMO ${dnone.includes("hideCar") ? 'd-none' : ''} my-auto m-w-100">${car}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- điểm đón -->

                        <!-- điểm trả -->
                        <div class="row pl-2 pr-2 wrapper-takeoff">
                            <div class="align-items-center d-flex pl-1 pr-1">
                                <div class="m-auto">
                                    <img src="/img/icons/marker/customer_trip_takeoff.png" alt=""
                                        style="height: 15px; width: 15px;">
                                </div>
                            </div>
                            <div class="col pl-0">
                                <div class="row">
                                <div class="pl-3 text-FIMO carStopTime my-auto" time=${timeTakeoff}>
                                    ${momentFormatTime(timeTakeoff, str_format_time.hour_minute)}
                                </div>
                                <div class="col text-muted">
                                    <div class="row">
                                        <div class="col pl-1 pr-0 carStopAddress my-auto">${takeoff.address || ''}</div>
                                        <div class="col pr-2 pl-1 text-right text-FIMO ${dnone.includes("hidePriceTicket") ? 'd-none' : ''} my-auto m-w-100">${price}</div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    ${appendBody}
                </div>
            </div>`
}

/**
 * Tính width của text
 * @param {string} txt
 * @param {string} fontname
 * @param {string} fontsize
 */
function getWidthOfText(txt, fontname, fontsize) {
    if (getWidthOfText.c === undefined) {
        getWidthOfText.c = document.createElement('canvas');
        getWidthOfText.ctx = getWidthOfText.c.getContext('2d');
    }
    getWidthOfText.ctx.font = fontsize + ' ' + fontname;
    return getWidthOfText.ctx.measureText(txt).width;
}

function isInPlaceRoute() {
    let pickup = FlowRouter.getQueryParam('pickup');
    let takeoff = FlowRouter.getQueryParam('takeoff');
    let routeID = FlowRouter.getQueryParam('routeID');

    return pickup || takeoff || routeID;
}

/**
 * Xóa phần tử trùng lặp của mảng Object theo key
 * https://dev.to/saigowthamr/how-to-remove-duplicate-objects-from-an-array-javascript-48ok
 */

function removeDuplicated(arr, key = 'id') {
    const map = new Map();
    arr.map(el => {
        if (el && !map.has(el[key])) {
            map.set(el[key], el);
        }
    });
    return [...map.values()];
}

/**
 * replace keysearch nếu có chưa các từ đặc biệt
 * @param {string} key
 */
function handleKeySearch(key) {
    let _key = key.toLowerCase().trim();
    _key = _key.replace('tp', 'thanh pho')
    _key = _key.replace('nga 3', 'nga ba')
    _key = _key.replace('nga 4', 'nga tu')
    return _key;
}

function badgeSeatNumber(seatNumber, active = false, price) {
    let p = '';
    if (price) p = `price="${price}"`;

    return `<span class="badge badge-boxed badge-success border-radius-5 pt-1 pb-1 mr-2 mb-2 font-14 badge-seatNumber ${active ? 'active' : ''}" seatNumber="${seatNumber}" ${p}>#${seatNumber}</span>`
}

function mergeArray(array1, array2) {
    var result_array = [];
    var arr = array1.concat(array2);
    var len = arr.length;
    var assoc = {};

    while (len--) {
        var item = arr[len];

        if (!assoc[item]) {
            result_array.unshift(item);
            assoc[item] = true;
        }
    }

    return result_array;
}

function getDataJson(tag, attr = 'json') {
    let data = $(tag).attr(attr);
    return data ? JSON.parse(data) : null;
}

function checkHourMinute(text) {
    return /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(text)
}

function popoverHide(tag = '.popover') {
    $(tag).popover('hide');
}

/**
 *
 * @param {string} tag 'button', input, span, div, p, i
 * @param {*} id
 * @param {*} text
 * @param {*} title
 * @param {*} classAppend string, class muốn thêm vào, các class cách nhau bởi dấu cách
 * @param {*} classPop string, class muốn bỏ ra khỏi class mặc định theo loại đã config từ trước, là mảng các class
 * @param {*} type
 * @param {*} attr mảng các attr, mỗi phần tử là string format dạng: nameAttr="VALUE"
 */

function createHTMLDefault(tag, {
    id,
    text,
    title,
    classAppend,
    classPop,
    type,
    attr
}) {
    let style = [];
    let eleClass = [];
    let tagHasClose = (eTag, eStyle, eText) => {

        return `<${eTag} ${eStyle.join(' ')}>${eText}</${eTag}>`
    }
    // 0: the html co the dong
    // 1: the html khong co the dong: input
    let checkTag = 0;

    if (tag === 'button') {
        checkTag = 0;
        eleClass.push('btn');
        eleClass.push('btn-raised');
        if (!type) style.push(`type="Button"`);
        else style.push(`type="${type}"`);
    }

    if (classAppend) {
        eleClass.push(classAppend);
        eleClass = `class="${eleClass.filter(i => !(classPop && classPop.includes(i))).join(' ')}"`;
    }

    style.push(eleClass);

    id && style.push(`id="${id}"`);
    title && style.push(`title="${title}"`);
    (attr && attr.length > 0) && style.push(attr.join(' '));

    return checkTag == 0 ? tagHasClose(tag, style, text) : '';
}

/**
 *
 * @param {string} tag định danh của thẻ html, ID hoặc Class
 * @param {Object} JSON options để thao tác với icon như: show/hide icon, diabled button,...
 */

function iconInElementUI(tag = 'button', {
    htmlIcon = ICONHTML.loadWhite,
    action = 'show',
    disabled = true,
}) {
    // console.log(element, disabled);
    let _disabled;
    if (action == 'show') {
        _disabled = true;
        $(tag).find('.icon').html(htmlIcon);
    } else {
        _disabled = false;
        $(tag).find('.icon').empty();
    }
    if (disabled) $(tag).prop('disabled', _disabled);
}


function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

function iconByUserType(userType) {
    let iconFound = USER_TYPE2.find(item => item.number == userType);

    if (iconFound) return iconHTML(iconFound.classIcon, {});
    return iconHTML('access-point-network', {});
}

function renderCarMaintenanceOptionSelect() {
    let carMaintenancesFilter = MAINTENANCESTYPE.filter(item => !MAINTENANCESTYPE_NOT_USE.includes(item.type))
    // console.log(carMaintenancesFilter);
    return carMaintenancesFilter;
}

function catchErrorDefault(e) {
    console.log(e);
    if (alertify) {
        alertify.error('Có lỗi xảy ra!');
    } else {
        setTimeout(() => {
            alertify.error('Có lỗi xảy ra!');
        }, 1000);
    }
}

function getUserName() {
    return Cookies.get('username');
}

function isNotInitedDay(cur_day) {
    let days = localStorage.getItem('init_days');
    if (!days) return true;
    return !days.includes(cur_day);
}

function updateInitDay(cur_day) {
    let days = localStorage.getItem('init_days');
    let lsDays = [];
    let timeLimit = moment().startOf('year').valueOf() - 30 * 86400 * 1000;
    if (!days) return localStorage.setItem('init_days', cur_day);
    days.split(',').forEach(i => {
        let time_temp = moment(i, str_format_time.day_month_year).valueOf();

        if (time_temp > timeLimit) {
            lsDays.push(i);
        }
    });
    if (moment(cur_day, str_format_time.day_month_year).valueOf() > timeLimit) lsDays.push(cur_day);
    return localStorage.setItem('init_days', lsDays);
}

function getPriceByPromotion(priceTicket, discount, promotionType, promotionMax) {
    let total = priceTicket;
    if (isPromotionTypePhanTram(promotionType)) {
        let money_temp = priceTicket * discount / 100;
        discount = money_temp > promotionMax ? promotionMax : money_temp;
    }
    return total -= discount;
}

export {
    statusDriver,
    statusCar,
    type,
    fuel,
    seatType,
    formatMoney,
    getPrice,
    maintenanceType,
    feedbackStatus,
    feedbackType,
    operatorStatus,
    jumpToMarker,
    getDistanceFromLatLonInKm,
    locationToJson,
    locationToArray,
    handleDistance,
    getHour,
    operatorType,
    valueOfArrayToNumber,
    valueOfObjectToNumber,
    isJson,
    isArray,
    isNumber,
    delay,
    addAnimate,
    capitalizeFirstLetter,
    addScrollToDiv,
    destroySlimscroll,
    randomString,
    countBackTime,
    formatPhoneNumber,
    formatMoneyNotUnit,
    formatSeats,
    copytext,
    calculatorTimeStartEnd,
    handleTripSeats,
    randomIntFromInterval,
    jsonEqual,
    getDateTime,
    styleCarModels,
    formatMoneyUnique,
    getStringTimeShort,
    getStringHourMinute,
    momentFormatTime,
    typeObject,
    PrintElem,
    tablePaging,
    getPageCurrent,
    departmentStatus,
    getStatusDefault,
    getTypeDefault,
    getJsonDefault,
    formatNumber,
    iconHTML,
    getHomeByUser,
    menuShow,
    getNumberInString,
    Export2Doc,
    initDatePickerDefault,
    getFirstLastDayOfWeek,
    weekOfMonth,
    isSuperAdmin,
    preLoader,
    cardTripDefault,
    getWidthOfText,
    isInPlaceRoute,
    removeDuplicated,
    handleKeySearch,
    badgeSeatNumber,
    mergeArray,
    countTimeFormated,
    getDataJson,
    checkHourMinute,
    popoverHide,
    createHTMLDefault,
    getBillTrip,
    iconInElementUI,
    flatten,
    iconByUserType,
    formatReduceThousand,
    formatMoneyNoUnitReduceThousand,
    renderCarMaintenanceOptionSelect,
    catchErrorDefault,
    getUserName,
    getMaintenance,
    formatDate,
    isNotInitedDay,
    updateInitDay,
    getPriceByPromotion,
    capitalizeWord,
}