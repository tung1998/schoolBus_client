import './tripList.html';
import { MeteorCall, getJsonDefault, handleError } from '../../../../functions';
import { _METHODS, _TRIP, _URL_images, LIMIT_DOCUMENT_PAGE } from '../../../../variableConst';

Template.tripList.onCreated(() => {
    accessToken = Cookies.get('accessToken')
    Session.set('tripList', [])
})

Template.tripList.onRendered(() => {
    reloadData()
})

Template.tripList.onDestroyed(() => {
    Session.delete('tripList')
})

Template.tripList.helpers({
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

function reloadData(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE) {
    console.log(FlowRouter.getRouteName())
    if (FlowRouter.getRouteName() == 'driver.tripHistory')
        MeteorCall(_METHODS.trip.GetByPage, {
            page: page,
            limit: limitDocPerPage,
            options: [{
                text: "status",
                value: _TRIP.status.finish.number,
            }]
        }, accessToken).then(result => {
            Session.set('tripList', result.data)
        }).catch(handleError)
    else {
        MeteorCall(_METHODS.trip.GetAllNext, {}, accessToken).then(result => {
            Session.set('tripList', result)
        }).catch(handleError)
    }
}