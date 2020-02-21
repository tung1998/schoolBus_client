import './studentListManager.html'

const Cookies = require('js-cookie');

import {
    MeteorCall,
    handleError
} from '../../functions';

let accessToken;

Template.studentListManager.onCreated(() => {
    accessToken = Cookies.get('accessToken');
    console.log(accessToken);
});

Template.studentListManager.onCreated(() => {
    MeteorCall('student.getAll', {}, accessToken).then(result => {
        console.log(result)
    }).catch(handleError)
});