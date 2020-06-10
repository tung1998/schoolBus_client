import './tripHistoryDriver.html';
import { MeteorCall, getJsonDefault } from '../../../../functions';
import { _METHODS, _TRIP, _URL_images } from '../../../../variableConst';

Template.tripHistoryDriver.onCreated(() => {
    accessToken = Cookies.get('accessToken')
    Session.set('tripList', [])
})

Template.tripHistoryDriver.onRendered(() => {
    reloadData()
})

Template.tripHistoryDriver.onDestroyed(() => {
    Session.delete('tripList')
})

Template.tripHistoryDriver.helpers({
    tripList() {
        return Session.get('tripList')
    },
    hasData() {
        return Session.get('tripList').length
    },
})

Template.tripHtml2.helpers({
    _URL_images() {
        return _URL_images
    },
    startTime() {
        return moment(this.startTime).format("DD/MM/YYYY, HH:MM")
    },
    tripStatus() {
        return getJsonDefault(_TRIP.status, 'number', this.status)
    },
})

function reloadData() {
    MeteorCall(_METHODS.trip.GetAll, {}, accessToken).then(result => {
        console.log(result)
        Session.set('tripList', result.data)
    })
}