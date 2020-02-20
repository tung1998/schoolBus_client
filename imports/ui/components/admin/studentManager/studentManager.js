import './studentManager.html';

const Cookies = require('js-cookie');

import {
    MeteorCall,
    handleError
} from '../../functions'

let accessToken

Template.studentManager.onCreated(() => {
    console.log('created')
    accessToken = Cookies.get('accessToken')
})

Template.studentManager.onRendered(() => {
    MeteorCall('student.getAll', {}, accessToken).then(result => {
        console.log(result)
    }).catch(handleError)
})

Template.studentManager.events({

})