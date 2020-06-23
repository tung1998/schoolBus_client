export {
    _METHODS,
    _SESSION,
    _TRIP_STUDENT,
    LIMIT_DOCUMENT_PAGE,
    _URL_images,
    _TRIP,
    _FEEDBACK,
    _REQUEST,
    _MARKER_CONFIG,
    _TRIP_LOG,
    _TRIP_CARSTOP,
    _USER,
    TIME_DEFAULT
}
const _URL_images = 'http://192.168.0.111:3000/images'
// const _URL_images = 'http://113.190.128.251:3000/images'

const _METHODS = {
    student: {
        GetAll: 'student.getAll',
        GetById: 'student.getByID',
        GetByPage: 'student.getByPage',
        GetByClass: 'student.getByClass',
        Create: 'student.create',
        Update: 'student.update',
        Delete: 'student.delete',
    },
    admin: {
        GetAll: 'admin.getAll',
        GetById: 'admin.getByID',
        GetByPage: 'admin.getByPage',
        Create: 'admin.create',
        Update: 'admin.update',
        Delete: 'admin.delete',
    },
    car: {
        GetAll: 'car.getAll',
        GetById: 'car.getByID',
        GetByPage: 'car.getByPage',
        Create: 'car.create',
        Update: 'car.update',
        Delete: 'car.delete',
    },
    carFuel: {
        GetAll: 'carFuel.getAll',
        GetById: 'carFuel.getByID',
        GetByPage: 'carFuel.getByPage',
        Create: 'carFuel.create',
        Update: 'carFuel.update',
        Delete: 'carFuel.delete',
    },
    carMaintenance: {
        GetAll: 'carMaintenance.getAll',
        GetById: 'carMaintenance.getByID',
        GetByPage: 'carMaintenance.getByPage',
        Create: 'carMaintenance.create',
        Update: 'carMaintenance.update',
        Delete: 'carMaintenance.delete',
    },
    carModel: {
        GetAll: 'carModel.getAll',
        GetById: 'carModel.getByID',
        GetByPage: 'carModel.getByPage',
        Create: 'carModel.create',
        Update: 'carModel.update',
        Delete: 'carModel.delete',
    },
    carStop: {
        GetAll: 'carStop.getAll',
        GetById: 'carStop.getByID',
        GetByPage: 'carStop.getByPage',
        Create: 'carStop.create',
        Update: 'carStop.update',
        Delete: 'carStop.delete',
    },
    carStopTrip: {
        GetAll: 'carStopTrip.getAll',
        GetById: 'carStopTrip.getByID',
        Create: 'carStopTrip.create',
        Update: 'carStopTrip.update',
        Delete: 'carStopTrip.delete',
    },
    class: {
        GetAll: 'class.getAll',
        GetByPage: 'class.getByPage',
        GetById: 'class.getByID',
        Create: 'class.create',
        Update: 'class.update',
        Delete: 'class.delete',
    },
    config: {
        GetAll: 'config.getAll',
        GetById: 'config.getByID',
        Create: 'config.create',
        Update: 'config.update',
        Delete: 'config.delete',
    },
    driver: {
        GetAll: 'driver.getAll',
        GetById: 'driver.getByID',
        GetByPage: 'driver.getByPage',
        Create: 'driver.create',
        Update: 'driver.update',
        Delete: 'driver.delete',
    },
    feedback: {
        GetAll: 'feedback.getAll',
        GetById: 'feedback.getByID',
        GetByPage: 'feedback.getByPage',
        Create: 'feedback.create',
        Update: 'feedback.update',
        Delete: 'feedback.delete',
        Response: 'feedback.response',
    },
    image: {
        GetAll: 'image.getAll',
        GetById: 'image.getByID',
        Import: 'image.import',
    },
    log: {
        GetAll: 'log.getAll',
        GetById: 'log.getByID',
    },
    modules: {
        GetAll: 'modules.get',
        GetById: 'modules.getByID',
        GetByPage: 'modules.getByPage',
        Create: 'modules.create',
        Update: 'modules.update',
        Delete: 'modules.delete',
        GetIcons: 'modules.getIcons',
        Init: 'modules.init'
    },
    Nanny: {
        GetAll: 'Nanny.getAll',
        GetById: 'Nanny.getByID',
        GetByPage: 'Nanny.getByPage',
        Create: 'Nanny.create',
        Update: 'Nanny.update',
        Delete: 'Nanny.delete',
    },
    notification: {
        GetAll: 'notification.getAll',
        Create: 'notification.create',
        Update: 'notification.update',
        Delete: 'notification.delete',
    },
    Parent: {
        GetAll: 'Parent.getAll',
        GetById: 'Parent.getByID',
        GetByPage: 'Parent.getByPage',
        GetByClass: 'Parent.getByClass',
        Create: 'Parent.create',
        Update: 'Parent.update',
        Delete: 'Parent.delete',
    },
    ParrentRequest: {
        GetAll: 'ParrentRequest.getAll',
        GetById: 'ParrentRequest.getById',
        Create: 'ParrentRequest.create',
        Update: 'ParrentRequest.update',
        Delete: 'ParrentRequest.delete',
    },
    route: {
        GetAll: 'route.getAll',
        GetById: 'route.getByID',
        GetByPage: 'route.getByPage',
        Create: 'route.create',
        Update: 'route.update',
        Delete: 'route.delete',
    },
    school: {
        GetAll: 'school.getAll',
        GetById: 'school.getByID',
        GetByPage: 'school.getByPage',
        Create: 'school.create',
        Update: 'school.update',
        Delete: 'school.delete',
    },
    studentList: {
        GetAll: 'studentList.getAll',
        GetById: 'studentList.getByID',
        GetByPage: 'studentList.getByPage',
        Create: 'studentList.create',
        Update: 'studentList.update',
        Delete: 'studentList.delete',
        AddStudentIDs: 'studentList.addStudentIDs',
        RemoveStudentIDs: 'studentList.removeStudentIDs',
    },
    studentTrip: {
        GetAll: 'studentTrip.getAll',
        GetById: 'studentTrip.getByID',
        Create: 'studentTrip.create',
        Update: 'studentTrip.update',
        Delete: 'studentTrip.delete',
    },
    task: {
        Update: 'task.update',
    },
    teacher: {
        GetAll: 'teacher.getAll',
        GetById: 'teacher.getByID',
        GetBySchoolID: 'teacher.getBySchool',
        GetByPage: 'teacher.getByPage',
        Create: 'teacher.create',
        Update: 'teacher.update',
        Delete: 'teacher.delete',
    },
    token: {
        GetAll: 'token.getAll',
        GetById: 'token.getByID',
        Create: 'token.create',
        Update: 'token.update',
        LoginByUsername: 'token.loginByUsername',
        GetUserInfo: 'token.getUserInfo',
    },
    trip: {
        GetAll: 'trip.getAll',
        GetById: 'trip.getByID',
        GetByTime: 'trip.getByTime',
        GetByPage: 'trip.getByPage',
        Create: 'trip.create',
        Update: 'trip.update',
        Delete: 'trip.delete',
        Attendace: 'trip.attendance',
        Image: 'trip.image',
        GetNext: 'trip.getNext',
        GetAllNext: 'trip.getAllNext',
        GetByStudent: 'trip.getByStudent',
        GetTripLogByTripID: 'trip.getLogByTripID',
        GetStudentTripLog: 'trip.getStudentTripLog',
        UpdateTripStatus: 'trip.updateTripStatus',
        UpdateCarStop: 'trip.updateCarStop'
    },
    tripLocation: {
        GetAll: 'tripLocation.getAll',
        GetById: 'tripLocation.getByID',
        Create: 'tripLocation.create',
        Update: 'tripLocation.update',
        Delete: 'tripLocation.delete',
    },
    user: {
        GetAll: 'user.getAll',
        GetById: 'user.getByID',
        GetByPage: 'user.getByPage',
        Create: 'user.create',
        Update: 'user.update',
        Delete: 'user.delete',
        GetCurrentInfor: 'user.getCurrentInfor',
        UpdatePassword: 'user.updatePassword',
        IsSuperadmin: 'user.isSuperadmin',
        BlockUser: 'user.blockUser',
        UnblockUser: 'user.unblockUser',
        ResetPassword: 'user.resetPassword',
        UpdateUserPassword: 'user.updateUserPassword'
    },
    sms: {
        GetAll: 'sms.getSMS',
        GetById: 'sms.getSMSByID',
        GetByPage: 'getSMSByPage',
        Create: 'sms.createSMS',
        Update: 'sms.updateSMS',
        Delete: 'sms.deleteSMS',
    },
    gps: {
        getLast: 'gps.getLastgps',
        getLastByCar: 'gps.getLastByCar'
    },
    wemap: {
        getAddress: 'wemap.getAddress',
        getDrivePath: 'wemap.getDrivePath'
    }
}

const _SESSION = {
    accessToken: 'accessToken',
    userID: 'userID',
    username: 'username',
    userType: 'userType',
    schoolID: 'schoolID',
    modules: 'modules',
    mapHeight: 'mapHeight',
    isSuperadmin: 'isSuperadmin',
    avata: 'avata',
    name: 'name',
    isLoading: 'isLoading',
    isLocalAdmin: 'isLocalAdmin',
    students: 'students',

    roomID: 'roomID',
}

const _TRIP_STUDENT = {
    status: {
        undefined: {
            text: "Chưa xác nhận",
            number: 0,
            classname: 'primary'
        },
        pickUp: {
            text: "Lên xe",
            number: 1,
            classname: 'info'
        },
        getOff: {
            text: "Xuống xe",
            number: 2,
            classname: 'success'
        },
        request: {
            text: "Xin Nghỉ",
            number: 3,
            classname: 'warning'
        },
        absent: {
            text: "Vắng mặt",
            number: 4,
            classname: 'danger'
        }
    }
}

const _TRIP = {
    status: {
        ready: {
            text: "Đang đợi",
            classname: 'primary',
            number: 0
        },
        moving: {
            text: "Đang di chuyển",
            classname: 'success',
            number: 1
        },
        finish: {
            text: "Đã kết thúc",
            classname: 'dark',
            number: 2
        },
        accident: {
            text: "Gặp sự cố",
            classname: 'warning',
            number: 3
        }
    },
    type: {
        toSchool: {
            text: "Lượt đi",
            classname: 'primary',
            number: 0
        },
        toHome: {
            text: "Lượt về",
            classname: 'success',
            number: 1
        }
    }
}

const _FEEDBACK = {
    status: {
        received: {
            text: "Đã gủi",
            classname: 'primary',
            number: 0
        },
        readed: {
            text: "Đã tiếp nhận",
            classname: 'warning',
            number: 1
        },
        response: {
            text: "Được phản hồi",
            classname: 'success',
            number: 2
        },
    },
    type: {
        other: {
            text: "Khác",
            classname: 'primary',
            number: 0
        },
        negative: {
            text: "Phản ánh tiêu cực",
            classname: 'danger',
            number: 1
        },
        appError: {
            text: "Phản ánh lỗi ứng dụng",
            classname: 'info',
            number: 2
        },
        opinion: {
            text: "Đóng góp ý kiến",
            classname: 'warning',
            number: 3
        },
    }
}

const _REQUEST = {
    status: {
        received: {
            text: "Đã gủi",
            classname: 'primary',
            number: 0
        },
        readed: {
            text: "Đã tiếp nhận",
            classname: 'warning',
            number: 1
        },
        confirmed: {
            text: "Đã xác nhận",
            classname: 'success',
            number: 2
        },
    },
    type: {
        other: {
            text: "Khác",
            classname: 'primary',
            number: 0
        },
        otherVehicle: {
            text: "Đưa đón bằng phương tiện khác",
            classname: 'danger',
            number: 1
        },
        busy: {
            text: "Xin nghỉ học",
            classname: 'info',
            number: 2
        },
    }
}

const LIMIT_DOCUMENT_PAGE = 10;

const _MARKER_CONFIG = {
    red: {
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    },
    blue: {
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    },
    gray: {
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }
}

const _TRIP_LOG = {
    status: {
        ready: {
            text: "Đã sẵn sàng",
            classname: 'primary',
            number: 0
        },
        moving: {
            text: "Đang di chuyển",
            classname: 'success',
            number: 1
        },
        finish: {
            text: "Đã kết thúc",
            classname: 'warning',
            number: 2
        },
        accident: {
            text: "Gặp sự cố",
            classname: 'danger',
            number: 3
        }
    }, type: {
        create: {
            text: "Khởi tạo",
            classname: 'primary',
            number: 0
        },
        update: {
            text: "Cập nhật",
            classname: 'warning',
            number: 1
        },
        delete: {
            text: "Xóa",
            classname: 'danger',
            number: 2
        }
    }
}
const _TRIP_CARSTOP = {
    status: {
        arrived: {
            text: "Đanng ở điểm dừng",
            classname: 'primary',
            number: 1
        },
        leaved: {
            text: "Đã rời điểm dừng",
            classname: 'success',
            number: 2
        },
        notArrived: {
            text: "Chưa đến điểm dừng",
            classname: 'warning',
            number: 0
        },
    }
}

const _USER = {
    status: {
        
    },
    type:{
        administrator: {
            text: "Quản trị viên",
            classname: 'primary',
            number: 0
        },
        student: {
            text: "Học sinh",
            classname: 'secondary',
            number: 1
        },
        nanny: {
            text: "Bảo mẫu",
            classname: 'danger',
            number: 2
        },
        parent: {
            text: "Phụ huynh",
            classname: 'success',
            number: 3
        },
        driver: {
            text: "Tài xế",
            classname: 'info',
            number: 4
        },
        teacher: {
            text: "Giáo viên",
            classname: 'warning',
            number: 5
        },
        
    }
}

const TIME_DEFAULT = {
    trip_end: 1.5,
    trip_end_default: 150, // 150 minute
    timeAnimate: 200, // 200 seconds
    hold_seat: 5 * 60, // second,
    hold_seat_app: 5 * 60, // second,
    check_task: 15 * 1000, // 15 second,
}