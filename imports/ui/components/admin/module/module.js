import './module.html';
import { Session } from 'meteor/session';

const Cookies = require('js-cookie');

import {
    MeteorCall,
    handleError
} from '../../functions'

import {
    _METHODS
} from '../../variableConst';

let accessToken;

Template.moduleManager.onCreated(() => {
    accessToken = Cookies.get('accessToken');
});

Template.moduleManager.onRendered(() => {
    Session.setDefault('module-parent-route', []);
    Session.setDefault('icons', []);

    MeteorCall.modules.GetIcons()
});


Template.editModuleModal.helpers({
    icon: function() {
        return
    },

    parentRoute: function() {
        return 
    }

});



function getInput() {
    let input = {
        name: $('#module-name').val(),
        description: $('#module-description').val(),
        route: $('module-route').val(),
        level: 0,
        parent: '',
        icon: $('#module-icon').val(),
        permission: $('module-permission').val()
    };

    if ($('#module-parent-route').val()) {
        input.level = 1;
        input.parent = $('#module-parent-route').val();
    };

    if ($('#module-id').val()) {
        input._id = $('#module-id').val();
    }
    
    return input;
}