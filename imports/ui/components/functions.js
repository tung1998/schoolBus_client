import {
    Meteor
} from "meteor/meteor"

export {
    MeteorCall,
    handleError
}

function MeteorCall(method = "", data = null, accessToken = "") {
    return new Promise((resolve, reject) => {
        Meteor.call(method, data, accessToken, (err, result) => {
            console.log(err, result)
            if (result && result.error) reject(result)
            else if (err) reject(err);
            else resolve(result);
        });
    })
}

function handleError(error) {
    console.log(error)
}