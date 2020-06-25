App.info({
    id: 'com.FIMO.SchoolBus', // replace with your bundle ID
    name: 'SchooBus',                // replace with your own name
    description: 'Hệ thống xe buýt trường học',
    author: 'FIMO Dev Team',
    email: 'tungbt@fimo.edu.vn',
    // website: 'https://airnet.vn',
    version: '1.0.0'
});

App.addResourceFile('google-services.json', 'google-services.json', 'android');

App.accessRule('https://maps.googleapis.com/*');
App.accessRule('*');
App.setPreference('android-targetSdkVersion', '28');
App.setPreference('android-minSdkVersion', '23');


App.configurePlugin ('phonegap-plugin-push', {
    SENDER_ID: 350796419919
});


App.icons({
    // iOS

    'app_store': 'icons/app_store.png',
    'iphone_2x': 'icons/iphone_2x.png',
    'iphone_3x': 'icons/iphone_3x.png',
    'ipad_2x': 'icons/ipad_2x.png',
    'ipad_pro': 'icons/ipad_pro.png',
    'ios_settings_2x': 'icons/ios_settings_2x.png',
    'ios_settings_3x': 'icons/ios_settings_3x.png',
    'ios_spotlight_2x': 'icons/ios_spotlight_2x.png',
    'ios_spotlight_3x': 'icons/ios_spotlight_3x.png',
    'ios_notification_2x': 'icons/ios_notification_2x.png',
    'ios_notification_3x': 'icons/ios_notification_3x.png',
    'ipad': 'icons/ipad.png',
    'ios_settings': 'icons/ios_settings.png',
    'ios_spotlight': 'icons/ios_spotlight.png',
    'ios_notification': 'icons/ios_notification.png',
    'iphone_legacy': 'icons/iphone_legacy.png',
    'iphone_legacy_2x': 'icons/iphone_legacy_2x.png',
    'ipad_spotlight_legacy': 'icons/ipad_spotlight_legacy.png',
    'ipad_spotlight_legacy_2x': 'icons/ipad_spotlight_legacy_2x.png',
    'ipad_app_legacy': 'icons/ipad_app_legacy.png',
    'ipad_app_legacy_2x': 'icons/ipad_app_legacy_2x.png',

    // Android
    'android_mdpi': 'icons/android_mdpi.png',
    'android_hdpi': 'icons/android_xhdpi.png',
    'android_xhdpi': 'icons/android_xhdpi.png',
    'android_xxhdpi': 'icons/android_xxhdpi.png',
    'android_xxxhdpi': 'icons/android_xxxhdpi.png',
});
App.launchScreens({
    // IOS
    'iphone5': 'splash/iphone5.png',
    'iphone6': 'splash/iphone6.png',
    'iphone6p_portrait': 'splash/iphone6p_portrait.png',
    'iphoneX_portrait': 'splash/iphoneX_portrait.png',
    'ipad_portrait_2x': 'splash/ipad_portrait_2x.png',
    'iphone': 'splash/iphone.png',
    'iphone_2x': 'splash/iphone_2x.png',
    'ipad_portrait': 'splash/ipad_portrait.png',
    'ipad_landscape_2x': 'splash/ipad_landscape_2x.png',
    'ipad_landscape': 'splash/ipad_landscape.png',
    // Android
    'android_mdpi_portrait': 'splash/android_mdpi_portrait.png',
    'android_hdpi_portrait': 'splash/android_hdpi_portrait.png',
    'android_xhdpi_portrait': 'splash/android_xhdpi_portrait.png',
    'android_xxhdpi_portrait': 'splash/android_xxhdpi_portrait.png',
    'android_xxxhdpi_portrait': 'splash/android_xxxhdpi_portrait.png',
});

// Set PhoneGap/Cordova preferences.
App.setPreference('StatusBarStyle', "styleLightContent");
App.setPreference('SplashScreenDelay', 3000);
App.setPreference('ShowSplashScreenSpinner', "true");
App.setPreference("cordova.plugins.diagnostic.modules", value="LOCATION CAMERA CALENDAR EXTERNAL_STORAGE");
