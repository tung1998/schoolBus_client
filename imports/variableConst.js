export {
    _METHODS,
    _SESSION,
    _TRIP_STUDENT
}

const _METHODS = {
    student: {
        GetAll: 'student.getAll',
        GetById: 'student.getByID',
        GetByClass: 'student.getByClass',
        Create: 'student.create',
        Update: 'student.update',
        Delete: 'student.delete',
    },
    admin: {
        GetAll: 'admin.getAll',
        GetById: 'admin.getByID',
        Create: 'admin.create',
        Update: 'admin.update',
        Delete: 'admin.delete',
    },
    car: {
        GetAll: 'car.getAll',
        GetById: 'car.getByID',
        Create: 'car.create',
        Update: 'car.update',
        Delete: 'car.delete',
    },
    carFuel: {
        GetAll: 'carFuel.getAll',
        GetById: 'carFuel.getByID',
        Create: 'carFuel.create',
        Update: 'carFuel.update',
        Delete: 'carFuel.delete',
    },
    carMaintenance: {
        GetAll: 'carMaintenance.getAll',
        GetById: 'carMaintenance.getByID',
        Create: 'carMaintenance.create',
        Update: 'carMaintenance.update',
        Delete: 'carMaintenance.delete',
    },
    carModel: {
        GetAll: 'carModel.getAll',
        GetById: 'carModel.getByID',
        Create: 'carModel.create',
        Update: 'carModel.update',
        Delete: 'carModel.delete',
    },
    carStop: {
        GetAll: 'carStop.getAll',
        GetById: 'carStop.getByID',
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
        Create: 'driver.create',
        Update: 'driver.update',
        Delete: 'driver.delete',
    },
    feedback: {
        GetAll: 'feedback.getAll',
        GetById: 'feedback.getByID',
        Create: 'feedback.create',
        Update: 'feedback.update',
        Delete: 'feedback.delete',
    },
    image:{
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
        Create: 'modules.create',
        Update: 'modules.update',
        Delete: 'modules.delete',
        GetIcons: 'modules.getIcons',
        Init: 'modules.init'
    },
    Nanny: {
        GetAll: 'Nanny.getAll',
        GetById: 'Nanny.getByID',
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
    Parrent: {
        GetAll: 'Parrent.getAll',
        GetById: 'Parrent.getByID',
        Create: 'Parrent.create',
        Update: 'Parrent.update',
        Delete: 'Parrent.delete',
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
        Create: 'route.create',
        Update: 'route.update',
        Delete: 'route.delete',
    },
    school: {
        GetAll: 'school.getAll',
        GetById: 'school.getByID',
        Create: 'school.create',
        Update: 'school.update',
        Delete: 'school.delete',
    },
    studentList: {
        GetAll: 'studentList.getAll',
        GetById: 'studentList.getByID',
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
        Create: 'teacher.create',
        Update: 'teacher.update',
        Delete: 'teacher.delete',
        Delete: 'teacher.delete',
    },
    token: {
        GetAll: 'token.getAll',
        GetById: 'token.getByID',
        Create: 'token.create',
        Update: 'token.update',
        LoginByUsername: 'token.loginByUsername',
    },
    trip: {
        GetAll: 'trip.getAll',
        GetById: 'trip.getByID',
        GetByTime: 'trip.getByTime',
        Create: 'trip.create',
        Update: 'trip.update',
        Delete: 'trip.delete',
        Attendace: 'trip.attendance',
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
        Create: 'user.create',
        Update: 'user.update',
        Delete: 'user.delete',
        GetCurrentInfor: 'user.getCurrentInfor'
    },
    sms: {
        GetAll: 'sms.getSMS',
        GetById: 'sms.getSMSByID',
        GetBYPage: 'getSMSByPage',
        Create: 'sms.createSMS',
        Update: 'sms.updateSMS',
        Delete: 'sms.deleteSMS',
    },
    gps: {
        getLast: 'monitoring.getLastgps'
    }
}

const _SESSION = {
    accessToken: 'accessToken',
    userID: 'userID'
}

const _TRIP_STUDENT = {
    status : {
        undefined:{
            text: "Chưa xác nhận",
            number: 0
        },
        pickUp:{
            text: "Trên xe",
            number: 1
        },
        getOff:{
            text: "Xuống xe",
            number: 2
        },
        absent:{
            text: "Vắng mặt",
            number: 3
        }
    }
}