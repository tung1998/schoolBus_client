import './upCommingTripInfo.html';

import {
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm
} from '../../../../functions'

import {
    _METHODS
} from '../../../../variableConst'

let accessToken;

Template.upCommingTripInfo.onCreated(() => {
    accessToken = Cookies.get('accessToken')
})

Template.upCommingTripInfo.onRendered(() => {
})

Template.upCommingTripInfo.events({
    
})
