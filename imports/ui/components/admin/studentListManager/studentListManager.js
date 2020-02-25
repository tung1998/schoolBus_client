import './studentListManager.html'

const Cookies = require('js-cookie');

import {
    MeteorCall,
    handleError
} from '../../../../functions';

import {
    _METHODS
} from '../../variableConst';

let accessToken;
let data;

Template.studentListManager.onCreated(() => {
    accessToken = Cookies.get('accessToken');
    console.log(accessToken);
});

Template.studentListManager.onRendered(() => {
    MeteorCall(_METHODS.studentList.GetAll, {}, accessToken).then(result => {
        data = result;
    }).catch(handleError);
});