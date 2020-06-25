// Import server startup through a single index entry point

import './register-api.js';
import { FCM_ } from '../../api/config';

Push.debug = true;
Push.Configure({
	gcm: {
        apiKey: FCM_.server_key,
		projectNumber: FCM_.project_number,
		senderID: FCM_.sender_ID
	},
	// apn: {
	// 	// certData: Assets.getText('PushChatCert.pem'),
	// 	// keyData: Assets.getText('PushChatKey.pem'),
	// 	// passphrase: '12345678',
	// },
    alert: true,
	badge: true,
	sound: true,
	vibrate: true,
	// clearNotifications: true
});
