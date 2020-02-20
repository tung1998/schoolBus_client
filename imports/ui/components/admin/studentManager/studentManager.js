import './studentManager.html';

const Cookies = require('js-cookie');

import {
    MeteorCall,
    handleError
} from '../../functions'

import {
    _METHODS
} from '../../variableConst'

let accessToken

Template.studentManager.onCreated(() => {
    console.log('created')
    accessToken = Cookies.get('accessToken')
})

Template.studentManager.onRendered(() => {
    MeteorCall(_METHODS.students.GetAll, {}, accessToken).then(result => {
        console.log(result)
    }).catch(handleError)
})

Template.studentManager.events({

})