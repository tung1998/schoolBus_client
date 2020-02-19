function sendSMS(data, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('sms.send', data, accessToken, (err, result) => {
            if(result && result.error) reject(result)
            else if(err) reject(err);
            else resolve(result);
        });
    });
}

export {
    sendSMS,
}