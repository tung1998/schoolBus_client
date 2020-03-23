import { Meteor } from 'meteor/meteor';
const METHOD = {
    get: 'GET',
    post: 'POST',
    put: 'PUT',
    del: 'DELETE',
}

function isStatusCodeError(result) {
    const arrayStatusCode = [400, 401, 402, 403, 404, 500, 501, 502];
    // console.log(result + "++++++++++++++");
    // console.log(result.statusCode);
    return result && arrayStatusCode.indexOf(result.statusCode) >= 0 ? true:false;
}

function msgError(result) {
    // console.log(result)
    let msg_vn = '', msg_en = '';
    if(result.data && result.data.message){
        msg_en = result.data.message;
        if(result.data.msg_vn) msg_vn = result.data.msg_vn;
        else
            switch (msg_en) {
                case 'Authentication is fail!':
                    msg_vn = 'Xác thực thất bại!';
                    break;
                case 'Account is blocked!':
                    msg_vn = 'Tài khoản bị khóa!';
                    break;
                // case 'currentTime is less than startTime':
                //     msg_vn = 'Chưa tới thời điểm xe chạy!';
                //     break;
                default:
                    msg_vn = 'Có lỗi xảy ra!';        
                    break;
            }

    }
    return {error : true, message: msg_vn, message_en: msg_en, statusCode: result.statusCode};
}

function httpDefault(method, url, { body, token, content, headers}) {
    let options = { };
    if(token) options.headers =  headerDefault(token);
    if(content) options.content = content;
    if(headers) options.headers = headers;
    switch (method) {
        case METHOD.post:
            if(body)
                options.data = body;
            break;
        case METHOD.put:
            if(body)
                options.data = body;
            break;
        case METHOD.del:
            if(body)
                options.data = body;
            break;
        default:
            break;
    }
    return new Promise((resolve, reject) => {
        // console.log(url, options);
        HTTP.call(method, url, options, (error, result) => {
            // console.log(error, result)
            if(!result && error){
                resolve({error : true, message: 'Lỗi mạng', message_en: error.errno});
            }else if(isStatusCodeError(result)) {
                resolve(msgError(result));
            } else {
                resolve(result.data);
            }
            
        });
    });
}

function headerDefault(token) {
    return {
        "Authorization": token,
        "Cache-Control": "no-cache"
    }
}

export {
    isStatusCodeError, msgError, httpDefault, METHOD, headerDefault,
}