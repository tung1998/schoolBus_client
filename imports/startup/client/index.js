// Import client startup through a single index entry point
import './registerComponent'
import './routes.js';
import './adminRoutes'
import './parentRoutes'
import './teacherRoutes'
import './driverRoutes'
import './nannyRoutes'
import './FCM'


Meteor.startup(function() {
    if (Meteor.isCordova) {
        cordova.plugins.diagnostic.requestCameraAuthorization(function (granted) {
            // handleSuccess("Successfully requested camera authorization: authorization was " + granted ? "GRANTED" : "DENIED")
        })
        PushNotification.createChannel(
            () => {
                console.log('createChannel');
            },
            () => {
                console.log('error');
            },
            {
               id: Session.get("userID"), //Use any Id you prefer, but the same Id for this channel must be sent from the server, 
               description: 'Android Channel', //And any description your prefer
               importance: 3,
               vibration: true
              }
        );
    }
});