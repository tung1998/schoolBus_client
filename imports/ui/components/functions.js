import {
    Meteor
} from "meteor/meteor"

export {
    MeteorCall
}

function MeteorCall(method = "", data = null, accessToken = "") {
    Meteor.call(method, data, accessToken, (err, result) => {
        if (result && result.error) reject(result)
        else if (err) reject(err);
        else resolve(result);
    });
}