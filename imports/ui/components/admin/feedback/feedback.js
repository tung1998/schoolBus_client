import './feedback.html';

const Cookies = require('js-cookie');

import {
    MeteorCall,
    handleError
} from '../../functions'

import {
    _METHODS
} from '../../variableConst'

let accessToken;

Template.administratorManager.onCreated(() => {
    accessToken = Cookies.get('accessToken')

})