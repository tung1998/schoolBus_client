export{
    getOperators,
    getOperatorByID,
    getOperatorByUserID,
    getOperatorsByPage,
    createOperator,
    deleteOperator,
    updateOperator,
}

function getOperators(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('operator.getAll', accessToken, (err, result) => {
            // if(result.error) reject(result);
            resolve(result);
        });
    });
}

function getOperatorByID(accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('operator.getByID', accessToken, (err, result) => {
            resolve(result);
        });
    });
}

function getOperatorByUserID(userID, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('operator.getByUserID', userID, accessToken, (err, result) => {
            if(result && result.error) reject(result);
            else if(err) reject(err);
            resolve(result);
        });
    });
}

function getOperatorsByPage(accessToken = '', page) {
    return new Promise((resolve, reject) => {
        Meteor.call('operator.getByPage', accessToken, page, (err, result) => {
            resolve(result);
        });
    });
}

function createOperator(operator, accessToken = '') {
    return new Promise((resolve, reject) => {
        Meteor.call('operator.create', operator, accessToken, (err, result) => {
            resolve(result);
        });
    });
}

function updateOperator(operator, accessToken = '', callback) {
    Meteor.call('operator.update', operator, accessToken, callback)
}

function deleteOperator(operatorID, accessToken = '', callback) {
    Meteor.call('operator.delete', operatorID, accessToken, callback)
}