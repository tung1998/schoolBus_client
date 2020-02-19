export{
    getByTimeESMS,
    sendSMSPOSTESMS,
    getESMSFilter,
    getBalance
}
/**
 * 
 * @param {Object} opts options: FROM, TO: (format: 'YYYY/MM/DD hh:mm:ss')
 * @param {*} accessToken 
 */
function getByTimeESMS(opts, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('eSMS.getByTime', opts, accessToken, (err, result) => {
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

/**
 * 
 * @param {Object} opts options:
 *      + Phone: 
 *      + Content: 
 *      + SmsType:
 *          1: Brandname quảng cáo
 *          2: Brandname chăm sóc khách hang
 *          8: Tin nhắn đầu số cố định 10 số, chuyên dùng cho chăm sóc khách hang.
 *      + Sandbox:
 *          0: ko thử nghiệm, gửi tin đi thật
 *          1: Thử nghiệm (tin không đi mà chỉ tạo ra tin nhắn)
 *      + RequestId: (optional) ID Tin nhắn của đối tác, dùng để kiểm tra ID này đã được hệ thống esms tiếp nhận trước đó hay chưa.
 *      + SendDate: (optional) Đặt lịch gửi tin
 *      + Brandname: (optional) Tên Brandname (tên công ty hay tổ chức khi gửi tin sẽ hiển thị trên tin nhắn đó).
 * @param {*} accessToken 
 */
function sendSMSPOSTESMS(opts, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('eSMS.sendSMSPOST', opts, accessToken, (err, result) => {
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


function getESMSFilter(opts, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('eSMS.getESMSFilter', opts, accessToken, (err, result) => {
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



function getBalance(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('eSMS.getBalance', accessToken, (err, result) => {
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