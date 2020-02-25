import {
    Meteor
} from "meteor/meteor"

export {
    MeteorCall,
    handleError,
    editFormModal
}

function MeteorCall(method = "", data = null, accessToken = "") {
    return new Promise((resolve, reject) => {
        Meteor.call(method, data, accessToken, (err, result) => {
            if (result && result.error) reject(result)
            else if (err) reject(err);
            else resolve(result);
        });
    })
}



function handleError(error) {
    console.log(error)
}

// function editFormModal(titleForm = "", titleButton = "") {
//    $('.kt-section').find('.kt-section__content').find('.btn.btn-outline-brand.mb-4').click(() => {
//         $('.modal-header').find('.modal-title').html(titleForm);
//         $('.modal-footer').find('.btn.btn-primary').html(titleButton);
//     });
// }