function reportWeekByCarModel({carModelID, time},accessToken){
    return new Promise((resolve, reject) => {
        Meteor.call('report.getWeekByCarModel', {carModelID, time}, accessToken, (err, result) => {
            if (result && result.error) {
                reject(result);
            } else if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function reportMonthByCarModel({carModelID, time},accessToken){
    return new Promise((resolve, reject) => {
        Meteor.call('report.getMonthByCarModel', {carModelID, time}, accessToken, (err, result) => {
            if (result && result.error) {
                reject(result);
            } else if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function reportMonthByCarModel({carModelID, time},accessToken){
    return new Promise((resolve, reject) => {
        Meteor.call('report.getMonthByCarModel', {carModelID, time}, accessToken, (err, result) => {
            if (result && result.error) {
                reject(result);
            } else if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function reportDatesByCarModel({carModelID, startTime, endTime},accessToken){
    return new Promise((resolve, reject) => {
        Meteor.call('report.getDatesByCarModel', {carModelID, startTime, endTime}, accessToken, (err, result) => {
            if (result && result.error) {
                reject(result);
            } else if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

export{
    reportWeekByCarModel, reportMonthByCarModel,reportDatesByCarModel,
}