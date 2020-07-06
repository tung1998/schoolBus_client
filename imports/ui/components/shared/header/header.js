import './header.html';
import {
    FlowRouter
} from 'meteor/kadira:flow-router';
import {
    _SESSION,
    _METHODS,
    TIME_DEFAULT
} from '../../../../variableConst';

const Cookies = require('js-cookie');

import {
    MeteorCall,
    MeteorCallNoEfect,
    handleError
} from '../../../../functions'

import {
    COLLECTION_TASK
} from '../../../../api/methods/task.js'

export {
    getAllNotification
}

let accessToken;

Template.header.onCreated(() => {
    accessToken = Cookies.get("accessToken");
    Session.set('isAdmin', true)
    Session.set('tripNotification', [])
    Session.set('studentNotification', [])
    Session.set('numberNotification', '')

})

Template.header.onRendered(() => {
    this.checkIsAdmin = Tracker.autorun(() => {
        if (Session.get(_SESSION.userType) === 0) {
            Session.set('isAdmin', true)
            getAllNotification()
        } else {
            Session.set('isAdmin', false)

        }
    })

    this.realTimeTracker = Tracker.autorun(() => {
        let task = COLLECTION_TASK.find({
            name: 'Trip'
        }).fetch()
        if (task.length && task[0].tasks.length && task[0].updatedTime > Date.now() - TIME_DEFAULT.check_task) {
            if (Session.get('isAdmin'))
                getAllNotification()
        }
    });

})

Template.header.onDestroyed(() => {
    if (this.checkIsAdmin) this.checkIsAdmin.stop()
    if (this.realTimeTracker) this.realTimeTracker.stop()
    Session.delete('tripNotification')
    Session.delete('studentNotification')
    Session.delete('numberNotification')
})

Template.header.events({
    'click #signOut': sightOutClick,
})

Template.header.helpers({
    username() {
        return Session.get(_SESSION.username)
    },
    avata() {
        return Session.get(_SESSION.avata)
    },
    name() {
        return Session.get(_SESSION.name)
    },
    isAdmin() {
        return Session.get('isAdmin')
    },
    numberNotification() {
        return Session.get('numberNotification')
    },
    numberStudent() {
        return Session.get('studentNotification').length
    },
    numberTrip() {
        return Session.get('tripNotification').length
    },
    numberStudent() {
        return Session.get('studentNotification').length
    },
    tripNotificationData() {
        return Session.get('tripNotification')
    },
    studentNotificationData() {
        return Session.get('studentNotification')
    },
    updatedTimeTrip() {
        return moment(this.trip.updatedTime).startOf('second').fromNow()
    },
    updatedTimeStudent() {
        return moment(this.student.updatedTime).startOf('second').fromNow()
    },
})

function sightOutClick() {
    Cookies.remove('accessToken');
    Session.set(_SESSION.name, null)
    Session.set(_SESSION.avata, null)
    Session.set(_SESSION.username, null)
    Session.set(_SESSION.userID, null)
    Session.set(_SESSION.userType, null)
    Session.delete('isAdmin')
    if (Meteor.isCordova) {
        Push.setUser();
    }
    BlazeLayout.render("login");
    FlowRouter.go('/login')
}



async function getAllNotification() {
    try {
        if (Session.get('isAdmin')) {
            let tripNotificationData = []
            let studentNotificationData = []
            let problemData = await MeteorCallNoEfect(_METHODS.trip.ProblemInDay, {
                date: moment(Date.now()).date(),
                month: moment(Date.now()).month() + 1,
                year: moment(Date.now()).year()
            }, accessToken)
            problemData.map(result => {
                if (result.studentID)
                    studentNotificationData.push(result)
                else tripNotificationData.push(result)
            })
            Session.set('numberNotification', problemData.length)
            Session.set('tripNotification', tripNotificationData);
            Session.set('studentNotification', studentNotificationData);
        }
    } catch (error) {
        handleError(error)
    }
}