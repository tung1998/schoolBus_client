import './login.html';
import {
    FlowRouter
} from 'meteor/kadira:flow-router';
import {
    MeteorCall,
    handleError
} from '../../../functions'
import {
    _METHODS,
    _SESSION
} from '../../../variableConst';

Template.login.events({
    'click #kt_login_signin_submit': login,
    'keypress #password': (e) => {
        if (e.which === 13 || e.keyCode == 13) {
           login()
        }
    },
});

function login() {
    let data = {
        username: $('#username').val(),
        password: $('#password').val()
    }
    MeteorCall(_METHODS.token.LoginByUsername, data, null).then(result => {
        Cookies.set("accessToken", result.access_token)
        FlowRouter.go('/profile')
    }).catch(error=>{
        handleError(error, "Sai tài khoản hoặc mật khẩu!")
    })
}