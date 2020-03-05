import './profile.html';
import { MeteorCall, handleError, passChangeHandleError, handleSuccess } from "../../../../functions";
import { _METHODS, _SESSION } from "../../../../variableConst";
const Cookies = require("js-cookie");
let accessToken;
let userID = Session.get(_SESSION.userID);
Template.profile.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.profile.onRendered(() => {
    MeteorCall(_METHODS.user.GetCurrentInfor, { userID: userID }, accessToken).then(result => {
        Session.set(_SESSION.username, result.username);
        //$(document).ready(() => {
        //type: 0 ADMIN, schoolID = null
        if (result.userType == 0) {
            let userData = {
                name: result.name,
                phoneNumber: result.phone,
                email: result.email,
            }
            $(".name").val(userData.name);
            $(".school_section").remove();
            $(".phone").val(userData.phoneNumber);
            $(".email").val(userData.email);
        }
        //type: 1 TEACHER
        else if (result.userType == 1) {
            let userData = {
                name: result.name,
                school: result.schoolID,
                phoneNumber: result.phone,
                email: result.email,
            }
            $(".name").val(userData.name);
            $(".schoolName").val(userData.school);
            $(".phone").val(userData.phoneNumber);
            $(".email").val(userData.email);
        }
        //})
    }).catch(handleError);
});

Template.profile.rendered = () => {
    console.log($(".kt-portlet__body").height())
    Session.set(_SESSION.mapHeight, $(".kt-portlet__body").height());
}
Template.profile.events({
    'submit form': appendNewPass,
})

function checkNewPass(string1, string2) {
    if (string1 == string2) {
        return true
    } else return false
}

function appendNewPass(event) {
    event.preventDefault();
    let oldPass = event.target.currentPass.value;
    let newPass = event.target.newPass.value;
    let confirmation = event.target.confirmation.value;
    let data = {
        username: Session.get(_SESSION.username),
        password: oldPass
    }
    console.log(data.username)
    MeteorCall(_METHODS.token.LoginByUsername, data, null).then(result => {
        if (checkNewPass(oldPass, newPass)) {
            passChangeHandleError(null, "Mật khẩu cũ và mới không được giống nhau!")
        } else {
            if (checkNewPass(newPass, confirmation)) {
                MeteorCall(_METHODS.user.UpdatePassword, { password: newPass }, accessToken)
                    .then(result => {
                        console.log(result)
                        handleSuccess("", "Đổi mật khẩu")
                        Cookies.remove('accessToken');
                        FlowRouter.go('/login')
                    })
                    .catch(handleError);
            } else {
                passChangeHandleError(null, "Xác nhận mật khẩu sai!")
            }
        }
    }).catch(handleError)

}