import './profile.html';
import {
    MeteorCall,
    handleError,
    handleSuccess,
    makeID,
} from "../../../../functions";
import {
    _METHODS,
    _SESSION
} from "../../../../variableConst";
const Cookies = require("js-cookie");


let accessToken;
let userID;

Template.profile.onCreated(() => {
    accessToken = Cookies.get("accessToken");
    userID = Cookies.get(_SESSION.userID);
});

Template.profile.onRendered(() => {
    initDropzoneProfile()


    MeteorCall(_METHODS.user.GetCurrentInfor, null, accessToken).then(result => {
        Session.set(_SESSION.username, result.username);
        //$(document).ready(() => {
        //type: 0 ADMIN, schoolID = null

        if (result.userType == 0) {
            let userData = {
                name: result.name,
                phoneNumber: result.phone,
                email: result.email,
            }
            if (result.image == null) {
                userData.image = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
            } else {
                userData.image = `http://123.24.137.209:3000/images/${result.image}/0`
            }
            console.log(userData.image);
            $(".name").val(userData.name);
            $(".school_section").remove();
            $(".phone").val(userData.phoneNumber);
            $(".email").val(userData.email);
            $('.kt-avatar__holder').css("background-image", `url(${userData.image})`)
        }
        //type: 1 TEACHER
        else if (result.userType == 1) {
            let userData = {
                name: result.name,
                school: result.schoolID,
                phoneNumber: result.phone,
                email: result.email,
            }
            if (result.image == null) {
                userData.image = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
            } else {
                userData.image = `http://123.24.137.209:3000/images/${result.image}/0`
            }
            $(".name").val(userData.name);
            $(".schoolName").val(userData.school);
            $(".phone").val(userData.phoneNumber);
            $(".email").val(userData.email);
            $('.kt-avatar__holder').css("background-image", `url(${userData.image})`)
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
    'click #image-confirm-button': editAvatarProfile,
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
            handleError(null, "Mật khẩu cũ và mới không được giống nhau!")
        } else {
            if (checkNewPass(newPass, confirmation)) {
                MeteorCall(_METHODS.user.UpdatePassword, {
                        password: newPass
                    }, accessToken)
                    .then(result => {
                        console.log(result)
                        handleSuccess("", "Đổi mật khẩu")
                        Cookies.remove('accessToken');
                        FlowRouter.go('/login')
                    })
                    .catch(handleError);
            } else {
                handleError(null, "Xác nhận mật khẩu sai!")
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

        let imagePreview = $('div.dropzone-previews').find('div.dz-image-preview')
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
            $('.kt-avatar__holder').css("background-image", `url(http://123.24.137.209:3000/images/${data.image}/0)`)

        })
        console.log("đã update");
    } catch (error) {
        handleError(error)
    }
}

function initDropzoneProfile() {
    Dropzone.autoDiscover = false;
    let myDropzone = new Dropzone('#profile-dropzone', {
        url: "#", // Set the url for your upload script location
        paramName: "file", // The name that will be used to transfer the file
        maxFiles: 1,
        maxFilesize: 5, // MB
        addRemoveLinks: true,
        acceptedFiles: "image/*",
        previewsContainer: '.dropzone-previews',
        previewTemplate: $('.dropzone-previews').html(),
        dictUploadCanceled: "",
        dictRemoveFile: `<hr/><button type="button" class="btn btn-outline-hover-dark btn-icon btn-circle"><i class="fas fa-trash"></i></button>`,
    })

    myDropzone.on('complete', function (file) {
        $('.kt-avatar__upload').on('click', function () {
            myDropzone.removeFile(file)
            $('.dropzone-msg-title').html("Kéo ảnh hoặc click để chọn ảnh.")
        })

        $('a.dz-remove').on('click', function () {
            $('.dropzone-msg-title').html("Kéo ảnh hoặc click để chọn ảnh.")
        })
        $('.dropzone-msg-title').html("Đã chọn ảnh, xóa ảnh để chọn ảnh mới")
        myDropzone.disable()
    })

    myDropzone.on('uploadprogress', function (file) {
        $('.dropzone-previews').find('div:eq(0)').hide()
    })

    myDropzone.on("removedfile", function (file) {
        myDropzone.enable()
        $('.dropzone-previews').find('div:eq(0)').show()
    })
}