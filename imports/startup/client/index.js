// Import client startup through a single index entry point
import './registerComponent'
import './routes.js';
import './adminRoutes'
import './parentRoutes'
import './teacherRoutes'
import './driverRoutes'
import './nannyRoutes'
import { handleSuccess } from '../../functions';


Meteor.startup(function() {
    if (Meteor.isCordova) {
        cordova.plugins.diagnostic.requestCameraAuthorization(function (granted) {
            handleSuccess("Successfully requested camera authorization: authorization was " + granted ? "GRANTED" : "DENIED")
        })
    }
});