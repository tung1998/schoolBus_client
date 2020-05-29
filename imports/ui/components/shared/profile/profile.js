import './profile.html';
import {
    MeteorCall,
    handleError,
    handleSuccess,
    makeID,
    initDropzone

} from "../../../../functions";
import {
    _METHODS,
    _SESSION,
    _URL_images
} from "../../../../variableConst";
const Cookies = require("js-cookie");
import {
    initSchoolSelect2
} from "../../admin/administratorManager/administratorManager"


let accessToken;
let userID;
let dropzone
let errorType;
Template.profile.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.profile.onRendered(() => {
    dropzone = initDropzone("#profile-dropzone")
    this.dropzone = dropzone;
    MeteorCall(_METHODS.user.GetCurrentInfor, null, accessToken).then(result => {
        Session.set(_SESSION.username, result.username);
        //$(document).ready(() => {
        //type: 0 ADMIN, schoolID = null
        if ((result.userType == 0) && (Session.get(_SESSION.isSuperadmin)==false)){
            Session.set(_SESSION.isLocalAdmin, true);
            //Session.set('schools', Session.get(_SESSION.schoolID));
        }
        userID = result._id;
        let userData = {
            name: result.name,
            phoneNumber: result.phone,
            email: result.email,
        }
        console.log(userData.image);
        $(".name").val(userData.name);
        $(".school_section").remove();
        $(".phone").val(userData.phoneNumber);
        $(".email").val(userData.email);

        let urlImage = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
        if (result.image != null) {
            urlImage = `${_URL_images}/${result.image}/0`
        }
        $('.kt-avatar__holder').css("background-image", `url(${urlImage})`)

    }).catch(handleError);
});

Template.profile.onDestroyed(() => {
    dropzone = null
});

Template.profile.rendered = () => {
    console.log($(".kt-portlet__body").height())
    Session.set(_SESSION.mapHeight, $(".kt-portlet__body").height());
}

Template.profile.events({
    'submit form': appendNewPass,
    'click #image-confirm-button': editAvatarProfile,
    'click .dz-preview': dzPreviewClick,
    'click .kt-avatar__upload': () => {
        dropzone.removeAllFiles(true)
    }
})

function dzPreviewClick() {
    dropzone.hiddenFileInput.click()
}

function checkNewPass(string1, string2) {
    //errorType = 0: trung mat khau || errorType = 1: mat khau qua ngan
    if ((string1 != string2)){
        errorType = 0;
        return false;
    }
    if (string1.length <= 8){
        errorType = 1;
        return false;
    }
    return true;
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
    //console.log(data.username)
    MeteorCall(_METHODS.token.LoginByUsername, data, null).then(result => {
        if (newPass == ""){
            handleError(null, "Vui lòng điền đủ thông tin");
        } else {
            if (oldPass == newPass) {
                handleError(null, "Mật khẩu cũ và mới không được giống nhau!")
            } else {
                if (checkNewPass(newPass, confirmation)) {
                    MeteorCall(_METHODS.user.UpdatePassword, {
                            password: newPass
                        }, accessToken)
                        .then(result => {
                            console.log(result)
                            handleSuccess("", "Đã đổi mật khẩu")
                            Cookies.remove('accessToken')
                            BlazeLayout.render("login");
                            FlowRouter.go('/login')
                        })
                        .catch(handleError);
                } else {
                    if (errorType == 0){
                        handleError(null, "Xác nhận mật khẩu sai!")
                    } else if (errorType == 1){
                        handleError(null, "Hãy nhập mật khẩu dài hơn 8 ký tự!")
                    }
                    
                }
            }
        }  
    }).catch(handleError)

}

async function editAvatarProfile() {
    try {
        let data = {
            _id: userID
        }
        console.log(data);

        let imagePreview = $('#profile-dropzone').find('div.dz-image-preview')
        if (imagePreview.length) {
            if (imagePreview.hasClass('dz-success')) {
                let imageId = makeID("user")
                let BASE64 = imagePreview.find('div.dz-image').find('img').attr('src')
                let importImage = await MeteorCall(_METHODS.image.Import, {
                    imageId,
                    BASE64: [BASE64]
                }, accessToken)
                if (importImage.error)
                    handleError(result, "Không tải được ảnh lên server!")
                else data.image = imageId
            }
        } else {
            Swal.fire({
                icon: "error",
                text: "Bạn chưa chọn ảnh!",
                timer: 3000
            })
        }
        await MeteorCall(_METHODS.user.Update, data, accessToken)
        handleSuccess("Đổi", "ảnh").then(() => {
            $('#editUploadImageModal').modal("hide")
            $('.kt-avatar__holder').css("background-image", `url(${_URL_images}/${data.image}/0)`)
            Session.set(_SESSION.avata, `${_URL_images}/${data.image}/0`)

        })
        console.log("đã update");
    } catch (error) {
        handleError(error)
    }
}