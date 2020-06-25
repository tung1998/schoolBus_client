import { FCM_ } from '../../api/config';
import { NOTI_DEFAULT } from '../../variableConst';

Meteor.startup(function () {
    // get current location if app cordova
    // if(Meteor.isCordova){
    //     Location.getGPSState(success, failure, options);
    // }

    // key map in project: WSN account: hainv@fimo.edu.vn
    // không cần phải chọn Restrictions...
    // GoogleMaps.load({v: '3', key: 'AIzaSyDa-epGk5gYdpYf_jXwItwGKaygniRQIl8', libraries: 'geometry,places'});
    window.addEventListener('resize', function () {
        Session.set("resize", new Date());
    });

    Push.Configure({
        android: {
            senderID: FCM_.sender_ID,
            // alert: true,
            // badge: true,
            // sound: true,
            // vibrate: true,
            // clearNotifications: true
            // "icon": "pushicon",
            // "iconColor": "#FF00FF",
        },
        alert: true,
        badge: true,
        sound: true,
        vibrate: true,
        clearNotifications: true
    });

    // Push.addListener('alert', function(notification) {
    //     // Called when message recieved on startup (cold+warm)
    //     console.log('alert' + JSON.stringify(notification));
    //     alertify.success('alert' + JSON.stringify(notification));
    //     alert('alert' + JSON.stringify(notification));
    // });

    Push.addListener('message', handleNotification);
});

function handleNotification(noti) {
    // alert(JSON.stringify(noti));
    let noti_modal = $('#notiModal');
    let notiActivity = noti.additionalData.activity;
    let go_to_page = '#', textBtn = 'Chuyển hướng';
    let current_page = window.location.pathname;
    switch (notiActivity) {
        case NOTI_DEFAULT.customerTrip.new.activity:
            go_to_page = '/driver/current-trip';
            textBtn = 'Đến trang chuyến đi hiện tại';
            break;
        case NOTI_DEFAULT.assign.car.activity:
            go_to_page = '/driver/list-trip';
            textBtn = 'Đến trang danh sách chuyến đi';
            break;
        // default:
        //     go_to_page = '/driver/current-trip';
        //     break;
    }
    noti_modal.find('.modal-title').html(noti.title);
    noti_modal.find('#noti-text').html(noti.message);
    noti_modal.find('#go-to-page').removeClass('d-none').attr('href', go_to_page).html(textBtn);
    if(go_to_page == current_page)
        noti_modal.find('#go-to-page').addClass('d-none');
    noti_modal.modal('show');
}

function success(state) {
    if(state === 'Enabled') {
        // alert("GPS Is Enabled");
    }
}

function failure() {
    // alert("Failed to get the GPS State");
}
let options = {
    dialog: true,
    title: 'abc',
}