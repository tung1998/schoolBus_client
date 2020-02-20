import {
    formatTimeNotUseMoment,
    momentFormatTime,
    iconHTML,
} from "./functions";
const LOCATION_INIT = [20.698875, 106.184558];
const PLACE_BETWEEN = [20.4405461, 106.0411791];
export const LOCATION = {
    init: [20.698875, 106.184558],
    place_between: [20.4405461, 106.0411791],
    hn: [21.0093054, 105.7836216],
    tb: [20.4469619, 106.3299585],
}

// TYPE
const TYPE = {
    init: 0,
    pickup: 1,
    takeoff: 2,
    pickup_carstop: 3,
    takeoff_carstop: 4,
    require_carstop: 5,
    car_stop: 6,
    current_location: 7,
    address_pickup: 8,
    address_takeoff: 9,
    clickMap: 10,
    clickPolygonHN: 11,
}

// ZOOM TO PLACE for TYPE
const ZOOM = [
    9, // 0 INIT
    16, // 1 TO_PICKUP
    16, // 2 TO_TAKEOFF
    9, // 3 TO_PICKUP_CarStop
    9, // 4 TO_TAKEOFF_CarStop
    14, // 5 TO_REQUIRE_CarStop
    14, // 6 TO_carstop
    15, // 7 TO_current_location
]
// path icon marker
const ICON_BASE = '/img/icons/';
const ICON_MARKER = `${ICON_BASE}marker/`;
const ICONS = [
    `${ICON_MARKER}init.png`, // 0
    `${ICON_MARKER}pickup.png`, // 1
    `${ICON_MARKER}takeoff.png`, // 2
    `${ICON_MARKER}pickup_carstop.png`, // 3
    `${ICON_MARKER}takeoff_carstop.png`, // 4
    `${ICON_MARKER}require_carstop.png`, // 5
    `${ICON_MARKER}car_stop.png`, // 6
    `${ICON_MARKER}currentLocation.png`, // 7
    `${ICON_MARKER}customer_trip_pickup.png`, // 8
    `${ICON_MARKER}customer_trip_takeoff.png`, // 9
];
const ICON_SIZE = {
    Default: 24,
    Big: 32,
}
const ICON_DEFAULT = {
    customer_trip_pickup: {
        url: ICONS[TYPE.address_pickup],
        size: ICON_SIZE.Default,
    },
    customer_trip_takeoff: {
        url: ICONS[TYPE.address_takeoff],
        size: ICON_SIZE.Default,
    }
}

export {
    ICON_DEFAULT
}

const STRING = {
    active: '_active',
}

const COLORS = [
    '#fff', // 0 INIT
    '#0000ff', // 1 TO_PICKUP
    '#ff0003', // 2 TO_TAKEOFF
    '#1cff00', // 3 TO_PICKUP_CarStop
    '#ffe500', // 4 TO_TAKEOFF_CarStop
    '#fff', // 5 TO_REQUIRE_CarStop
    '#1cff00', // 6 TO_carstop
    '#0088FF', // 7 TO_current_location
]

// SESSION
const SESSION = {
    type_icon: 'type_icon',
    is_chose: 'is_chose',
    current_location: 'current_location',
    place_finish: 'place_finish',
    data_search: 'data_search',
    addressPickups_driver: 'addressPickups_driver',
    tripIDs_in_hour: 'tripIDs_in_hour',
    carStopType: 'carStopType',
    trip_date: 'trip_date',
    sub_driverIDs: 'sub_driverIDs',
    sub_carIDs: 'sub_carIDs',
    sub_userIDs: 'sub_userIDs',
    sub_tripByDate: 'sub_TripByDate',
    avg_tripSeat: 'avg_tripSeat',
    sub_tripID: 'sub_tripID',
    resize: 'resize',
    reload: 'reload',

    car_plate: 'car_plate',

    name: 'name',
    phone: 'phone',
    userID: 'userID',
    userType: 'userType',
    customerID: 'customerID',
    address: 'address',
    email: 'email',

    count: 'count',
    loading: 'loading',
    pageTripHistory: 'pageTripHistory',

    jsonPickup: 'jsonPickup',
    jsonTakeoff: 'jsonTakeoff',

    requireCarStop: 'requireCarStop',
    normalCarStop: 'normalCarStop',
    areas: 'areas',
    carModels: 'carModels',
    customCarModels: 'customCarModels',
    ticketByArea: 'ticketByArea',
    action: 'action',
    stopReload: 'stopReload',

    infoTripOld: 'infoTripOld',
    infoTripNew: 'infoTripNew',

    notEmpty: 'notEmpty',
    tripBilled: 'tripBilled',

    // filter
    ftTripWaiting: 'ftTripWaiting',
    ftTripRunning: 'ftTripRunning',
    ftTripEnd: 'ftTripEnd',

    tripID: "tripID",

    //chat
    currentRoom: "currentRoom",
    customerName: "customerName",
    countLoadDefault: "countLoadDefault",
    lastestActiveMessage: "lastestActiveMessage"
}

const opacity_min = 0.25;
const opacity_max = 1;
const OPACITY = {
    min: 0,
    route: 0.6,
    max: 1,
}
export {
    ICONS,
    ZOOM,
    TYPE,
    LOCATION_INIT,
    SESSION,
    COLORS,
    OPACITY,
    PLACE_BETWEEN,
    STRING,
}

const TEXT_PLEASE_COMPLETE_INPUT = 'Xin vui lòng điền đầy đủ thông tin';

const NOT_FOUND_ADDRESS = 'Không tìm thấy';
const DAU_CACH = '&nbsp;';

export {
    TEXT_PLEASE_COMPLETE_INPUT,
    NOT_FOUND_ADDRESS,
    DAU_CACH,
}

// const tab on map
const height_tab_2 = 100;
export {
    height_tab_2
}

// Vùng đón fix cứng
const regionHN = [{
        lat: 21.041596,
        lng: 105.761521
    }, // cau dien diem di
    {
        lat: 21.003712,
        lng: 105.772953
    }, // dai lo thang long
    {
        lat: 20.9917289,
        lng: 105.8038495
    }, // nga 4 nguyen trai, nguyen xien
    {
        lat: 21.0033861,
        lng: 105.8196294
    }, // dau nga tu so
    {
        lat: 21.046346,
        lng: 105.80503
    }, // dau duong Bưởi, hoang quoc viet
    {
        lat: 21.036810,
        lng: 105.779528
    }, // chan cau mai dich, pham van dong
    {
        lat: 21.041590,
        lng: 105.761952
    }, // cau dien diem ve
];

const regionPC = [{
        lat: 21.017380,
        lng: 105.841505
    }, // Đầu rạp xiếc
    {
        lat: 21.022017,
        lng: 105.848645
    }, // trần hưng đạo - quang trung
    {
        lat: 21.019624,
        lng: 105.861620
    }, // Bệnh viện trung ương quân đội 108
    {
        lat: 21.024420,
        lng: 105.860565
    }, // Dốc bác cổ,
    {
        lat: 21.028623,
        lng: 105.843935
    }, // Thợ nhuộm
    {
        lat: 21.027513,
        lng: 105.841524
    }, // Lê duẩn - 2 ba trưng
    {
        lat: 21.017415,
        lng: 105.841407
    }, // Đầu rạp xiếc
];

export {
    regionHN,
    regionPC
}

// String Format
const str_date = 'DD/MM/YYYY';
const str_date_short_year = 'DD/MM/YY';
const str_hour_minute = 'HH:mm';
const str_full_minute = str_hour_minute + " " + str_date;
const str_full_seconds = str_hour_minute + ":ss " + str_date;

export const str_format_time = {
    hour_minute: 'HH:mm',
    hour_minute_seconds: 'HH:mm:ss',
    day_month: 'DD/MM',
    day_month_year: 'DD/MM/YYYY',
    day_month_shortYear: 'DD/MM/YY',
    day_month_shortYear_en: 'MM/DD/YY',
    month_year: 'MM/YYYY',
    full_minute: 'HH:mm DD/MM/YYYY',
    full_minute_seconds: 'HH:mm:ss DD/MM/YYYY',
    day_month_hour_minute: 'DD/MM - HH:mm',
    hour_minute_day_month: 'HH:mm - DD/MM',
    day_month_year_hour_minute: 'DD/MM/YYYY - HH:mm',
    full_format_vn: 'dd, HH:mm, DD/MM/YY'
}

export {
    str_date,
    str_hour_minute,
    str_full_minute,
    str_full_seconds,
    str_date_short_year,
}

const LIMIT_DOCUMENT_PAGE = 10;
const LIMIT_DOCUMENT_DEFAULT = 100;
const PAGE_INDEX_DEFAULT = 1;

export {
    LIMIT_DOCUMENT_PAGE,
    LIMIT_DOCUMENT_DEFAULT,
    PAGE_INDEX_DEFAULT,
}

const ROOT_URL = {
    admin: '/admin',
    operator: '/operator',
    manager: '/manager',
    receptionist: '/receptionist',
    accountancy: '/accountancy',
}

export {
    ROOT_URL
}

export let MAX_SEATS_CAR_7 = 11;
export let CAR_DEFAULT = {
    seats: 11,
    seatDetail: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
}

export const KyTuDacBiet = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;

/**
 * 29/08/2019 không dùng biến này để so sánh nữa
 * Thay vào đó dùng các hàm isTripWaiting ... ở phía dưới biến này
 */

const _TRIP = {
    status: {
        dang_doi: {
            number: 0,
            className: 'success',
            classIcon: 'account-plus',
            text: 'Đang đợi',
        },
        dang_thuc_hien: {
            number: 1,
            className: 'info',
            classIcon: 'account',
            text: 'Đang thực hiện',
        },
        ket_thuc: {
            number: 2,
            className: 'danger',
            classIcon: 'account-check',
            text: 'Kết thúc',
        },
        nha_xe_huy: {
            number: 3,
            className: 'warning',
            classIcon: 'account-remove',
            text: 'Nhà xe hủy chuyến',
        },
        han_che: {
            number: 4,
            className: 'dark',
            classIcon: 'account-off',
            text: 'Chuyến đi hạn chế ',
        },
    },
    type: {
        dat_le: {
            number: 0,
            className: 'success',
            text: 'Đặt lẻ',
        },
        bao_tron: {
            number: 1,
            className: 'primary',
            text: 'Bao trọn',
        }
    }
}

// is status trip
const isTripStatusWaiting = (status) => _TRIP.status.dang_doi.number == status;
const isTripStatusRunning = (status) => _TRIP.status.dang_thuc_hien.number == status;
const isTripStatusEnd = (status) => _TRIP.status.ket_thuc.number == status;
const isTripStatusCancel = (status) => _TRIP.status.nha_xe_huy.number == status;
const isTripStatusLimit = (status) => _TRIP.status.han_che.number == status;

const isTripStatusNotWork = (status) => [
    _TRIP.status.nha_xe_huy.number,
    _TRIP.status.han_che.number
].includes(status);

const isTripStatusWork = (status) => [
    _TRIP.status.dang_doi.number,
    _TRIP.status.dang_thuc_hien.number,
    _TRIP.status.ket_thuc.number
].includes(status);

// is type customer trip
const isTripTypeSingle = (type) => _TRIP.type.dat_le.number == type;
const isTripTypePayall = (type) => _TRIP.type.bao_tron.number == type;

export {
    _TRIP,
    isTripStatusWaiting,
    isTripStatusRunning,
    isTripStatusEnd,
    isTripStatusCancel,
    isTripStatusLimit,
    isTripStatusNotWork,
    isTripStatusWork,
    isTripTypeSingle,
    isTripTypePayall,
}


export {
    isCusTripStatusWaiting,
    isCusTripStatusRunning,
    isCusTripStatusDeny,
    isCusTripStatusCancel,
    isCusTripStatusEnd,
    isCusTripStatusDraft,
    isCusTripStatusNotWork,
    isCusTripStatusWork,
    isCusTripTypeCall,
    isCusTripTypeBookApp,
}

export const CLASS_NAME_COLORS = ['success', 'danger', 'primary', 'info', 'warning'];

export const TripTypeLog = {
    create: {
        number: 0,
        className: 'primary',
        text: 'Thêm mới',
    },
    update: {
        number: 1,
        className: 'warning',
        text: 'Cập nhật',
    },
    delete: {
        number: 2,
        className: 'danger',
        text: 'Hủy',
    },
}

export const TypeLog = {
    create: {
        number: 0,
        className: 'primary',
        text: 'Thêm mới',
    },
    update: {
        number: 1,
        updateTrip: {
            number: 0,
            className: 'warning',
            text: 'Cập nhật',
        },
        pickedUp: {
            number: 1,
            className: 'info',
            text: 'Đã đón',
        },
        refuse: {
            number: 2,
            className: 'danger',
            text: 'Nhà xe từ chối',
        },
        cancelTrip: {
            number: 3,
            className: 'danger',
            text: 'Khách hủy',
        },
        endTrip: {
            number: 4,
            className: 'danger',
            text: 'Kết thúc',
        },
        changeTrip: {
            number: 5,
            className: 'warning',
            text: 'Chuyển chuyến đi',
        },
    },
    delete: {
        number: 2,
        className: 'dark',
        text: 'Hủy',
    },
}



export const UNIT_PRICE = {
    vnd: 'VND',
    vnd_symbol: '₫',
}
export let dot_html = `.....................................................................................................................................................................................................................................................................................................................................................................`;

function textNoTificationDefault(data) {
    let time = momentFormatTime(data.startTime, str_full_minute);
    let seats = '';
    if (data && data.seats >= 0)
        seats = data.seats;
    return `Chuyến đi ${data.route.shortName} ${time} - ${seats} khách`
}

export const HOST = {
    localhost: 'localhost:3000',
}

export const EXTRA = {
    route: 'route',
    car: 'car',
    trip: 'trip',
    driver: 'driver',
    customer: 'customer',
    user: 'user',
}


export const PHONE = {
    status: {
        coming: {
            number: 0,
            className: 'success',
            text: 'Đang đợi',
        },
        received: {
            number: 1,
            className: 'success',
            text: 'Đang đợi',
        },
        end: {
            number: 2,
            className: 'success',
            text: 'Đang đợi',
        },
        missed: {
            number: 3,
            className: 'success',
            text: 'Đang đợi',
        },
        missed_resolved: {
            number: 4,
            className: 'success',
            text: 'Đang đợi',
        },
    },
}


export const MAINTENANCESTYPE = [{
        type: 0,
        title: "Rửa xe",
        className: 'primary',
    },
    {
        type: 1,
        title: "Gửi xe",
        className: 'success',
    },
    {
        type: 2,
        title: "PC thêm tiền ăn đầu HN",
        className: 'warning',
    },
    {
        type: 3,
        title: "PC chạy ngoài giờ",
        className: 'warning',
    },
    {
        type: 4,
        title: "PC chạy tăng cường",
        className: 'warning',
    },
    {
        type: 5,
        title: "Trung chuyển",
        className: 'danger',
    },
    {
        type: 6,
        title: "Sửa chữa",
        className: 'danger',
    },
    {
        type: 20, // phải là phần tử cuối cùng
        title: "Chi phí khác",
        className: 'info',
    }
]


export const MAINTENANCESTYPE_NOT_USE = [2, 3, 4];

export const USER_TYPE = {
    customer: 1,
    driver: 2,
    operator: 3,
    receptionist: 4,
    accountancy: 5,
}

export const USER_TYPE2 = [{
        number: 0,
        classIcon: 'monitor',
        text_en: 'admin',
        text_vn: 'Quản trị viên'
    },
    {
        number: 1,
        classIcon: 'cellphone',
        text_en: 'customer',
        text_vn: 'Khách hàng'
    },
    {
        number: 2,
        text_en: 'driver',
        text_vn: 'Lái xe'
    },
    {
        number: 3,
        classIcon: 'phone-classic',
        text_en: 'operator',
        text_vn: 'Điều phối viên'
    },
    {
        number: 4,
        text_en: 'receptionist',
        text_vn: 'Lễ tân'
    },
    {
        number: 5,
        text_en: 'accountancy',
        text_vn: 'Kế toán'
    },
]

export const TYPE_DEPARTMENT = [{
        type: USER_TYPE.receptionist,
        name: 'Lễ tân',
    },
    {
        type: USER_TYPE.accountancy,
        name: 'Kế toán',
    },
    // {
    //     type: 3,
    //     name: 'Điều phối',
    // },
]

export const ROUTE = {
    default: infoURL('#', 'Hệ thống quản lý xe'),
    home: infoURL('/', 'Trang chủ'),
    login: infoURL('/login', 'Đăng nhập hệ thống'),
    customerRegister: infoURL('/register', 'Tạo tài khoản khách hàng mới'),
    forgotPassword: infoURL('/forgot-pasword', 'Quên mật khẩu'),
    pageProfile: infoURL('/profile', 'Trang cá nhân'),

    adminDefault: infoURL('#', 'Hệ Thống Quản Lý Xe - Hạng Thương Gia'),

    operatorDefault: infoURL('#', 'Tổng đài - Hạng Thương Gia'),

    customerDefault: infoURL('#', 'Khách hàng - Hạng Thương Gia'),

    driverDefault: infoURL('#', 'Tài xế - Hạng Thương Gia'),

    operatorDefault: infoURL('#', 'Tổng đài - Hạng Thương Gia'),

    managerDefault: infoURL('#', 'Người quản lý - Hạng Thương Gia'),

    receptionistDefault: infoURL('#', 'Bộ phận - Hạng Thương Gia'),

    accountancyDefault: infoURL('#', 'Kế toán - Hạng Thương Gia'),

}

function infoURL(url, title) {
    return {
        url,
        title
    };
}

export const TIME_DEFAULT = {
    trip_end: 1.5,
    trip_end_default: 150, // 150 minute
    timeAnimate: 200, // 200 seconds
    hold_seat: 5 * 60, // second,
    hold_seat_app: 5 * 60, // second,
    check_task: 30 * 1000, // 15 second,
}

export let STATISTIC_BASE = {
    tripNumber: 0,
    allInclusiveTripNumber: 0,
    singleTripNumber: 0,
    seatNumber: 0,
    totalPrice: 0,
    deniedTripNumber: 0,
    canceledTripNumber: 0,
    continuousDeniedTripNumber: 0,
    continuousCanceledTripNumber: 0,
}

// 24/05/2019 chuyen sang dung leaflet cho map Khach Hang
const ICON_PATH_DEFAULT = {
    leaflet: '/img/icons/marker/',
}

const MARKER_LEAFLET = {
    pickupPlace: {
        zoom: 15,
        iconUrl: ICON_PATH_DEFAULT.leaflet + 'customer_trip_pickup.png',
        size: 32,
    },
    takeoffPlace: {
        zoom: 15,
        iconUrl: ICON_PATH_DEFAULT.leaflet + 'customer_trip_takeoff.png',
        size: 32,
    },
    nearPickupPlace: {
        zoom: 15,
        iconUrl: ICON_PATH_DEFAULT.leaflet + 'customer_trip_pickup.png',
        size: 32,
    },
    nearTakeoffPlace: {
        zoom: 15,
        iconUrl: ICON_PATH_DEFAULT.leaflet + 'customer_trip_takeoff.png',
        size: 32,
    },
}

const LEAFLET_INIT = {
    tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    layerTonerLabel: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}',
    initLocation: LOCATION.init,
    maxZoom: 18,
    minZoom: 8,
    currentLocationZoom: 18,
    initZoom: 12,
}

export {
    ICON_PATH_DEFAULT,
    MARKER_LEAFLET,
    LEAFLET_INIT
}

export const CARID_WAITING = {
    for: "5d31491f143068432f114683",
    dcar: "5d314928143068432f114688",
};

export const ADDRESS_SPECIAL_OSM = {
    NoiBaiAirPort: {
        id: "N22152044",
        text: 'Sân bay Nội Bài'
    },
}

export const PROMOTION_CONDITION = {
    AllCustomer: {
        number: 0,
        text: 'Tất cả khách hàng'
    },
    OldCustomer: {
        number: 1,
        text: 'Khách hàng cũ'
    },
    NewCustomer: {
        number: 2,
        text: 'Khách hàng mới'
    },
    CancelCustomer: {
        number: 3,
        text: 'Khách hàng hủy chuyến'
    },
}

export const ICONHTML = {
    loadFIMO: iconHTML('spinner', {
        by: 'fa',
        fontSize: 32,
        spin: 'spin',
        textColor: 'FIMO',
    }),
    loadWhite: iconHTML('spinner', {
        by: 'fa',
        spin: 'spin',
        textColor: 'white',
    })
}

export const QUILL_OPTIONS = {
    modules: {
        'toolbar': [
            [{
                'size': []
            }],
            ['bold', 'italic', 'underline', 'strike'],
            [{
                'color': []
            }, {
                'background': []
            }],
            [{
                'script': 'super'
            }, {
                'script': 'sub'
            }],
            [{
                'header': '1'
            }, {
                'header': '2'
            }, 'blockquote', 'code-block'],
            [{
                'list': 'ordered'
            }, {
                'list': 'bullet'
            }, {
                'indent': '-1'
            }, {
                'indent': '+1'
            }],
            ['direction', {
                'align': []
            }],
            ['link', 'image', 'video', 'formula'],
            ['clean']
        ]
    },
    placeholder: 'Nội dung khuyến mãi',
    theme: 'snow'
}

const PROMOTION_MAXTRIP_LIMIT_TIME = {
    AllCustomer: {
        number: 0,
        text: 'Không giới hạn thời gian'
    },
    OldCustomer: {
        number: 1,
        text: 'Ngày'
    },
    NewCustomer: {
        number: 2,
        text: 'Tuần'
    },
    CancelCustomer: {
        number: 3,
        text: 'Tháng'
    },
}
const PROMOTION_RANGE = {
    trip: {
        min: 0,
        max: 1000000,
    },
    seat: {
        min: 0,
        max: 1000000,
    },
}

// user has permission
let ADMIN_HAS_FULL_PERMISSION = ['superadmin', 'adminfimo1', 'adminfimo2'];
// normal Admin: Trưởng ca
// vip Admin: superadmin, adminfimo
let ROUTE_NOT_FOR_NORMAL_ADMIN = ['admin/statistic/bill/list', 'admin/statistic/noLenh', 'admin/statistic/timesheets', 'admin/statistic/tonghop'];

let BILL_STATUS = {
    notBill: {
        number: 0,
        className: 'success',
        classIcon: 'account-plus',
        text: 'Không có bill',
    },
    createdBill: {
        number: 1,
        className: 'info',
        classIcon: 'account',
        text: 'Đã tạo bill',
    },
    submittedBill: {
        number: 2,
        className: 'danger',
        classIcon: 'account-check',
        text: 'Bill đợi xác nhận',
    },
    confirmedBill: {
        number: 3,
        className: 'warning',
        classIcon: 'account-remove',
        text: 'Bill đã xác nhận',
    }
}

export {
    PROMOTION_MAXTRIP_LIMIT_TIME,
    PROMOTION_RANGE,
    ADMIN_HAS_FULL_PERMISSION,
    ROUTE_NOT_FOR_NORMAL_ADMIN,
    BILL_STATUS,
}

/**
 *      + SmsType:
 *          1: Brandname quảng cáo
 *          2: Brandname chăm sóc khách hang
 *          8: Tin nhắn đầu số cố định 10 số, chuyên dùng cho chăm sóc khách hang.
 *      + Sandbox:
 *          0: ko thử nghiệm, gửi tin đi thật
 *          1: Thử nghiệm (tin không đi mà chỉ tạo ra tin nhắn)
 *      + Brandname: (optional) Tên Brandname (tên công ty hay tổ chức khi gửi tin sẽ hiển thị trên tin nhắn đó).
 */
const ESMS_CONFIG = {
    SmsType: {
        QUANG_CAO: 1,
        CSKH: 2,
        DAU_SO: 8,
    },
    Sandbox: {
        GUI_THAT: 0,
        GUI_THU_NGHIEM: 1,
    },
    Brandname: {
        PHIET_HOC: 'PHIET_HOC',
        DAU_SO: '0901800170',
    },
}

const COMPANY_CONFIG = {
    phone: {
        truong_ca: '0972163012'
    }
}

const PROMOTION = {
    type: {
        phanTram: {
            number: 0,
            className: 'success',
            text: 'Giảm theo %',
        },
        truTien: {
            number: 1,
            className: 'primary',
            text: 'Trừ tiền vé',
        },
    }
}
const isPromotionTypePhanTram = (type) => PROMOTION.type.phanTram.number == type;
const isPromotionTypeTruTien = (type) => PROMOTION.type.truTien.number == type;

export {
    ESMS_CONFIG,
    COMPANY_CONFIG,
    PROMOTION,
    isPromotionTypePhanTram,
    isPromotionTypeTruTien,
}