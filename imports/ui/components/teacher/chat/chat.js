import './chat.html'

const Cookies = require("js-cookie");

import {
    MeteorCall,
    handleError,
    handleSuccess,
} from "../../../../functions";

import {
    _METHODS,
    _SESSION,
    _URL_images,
} from "../../../../variableConst";

import {
    COLLECTION_Messages,
} from "../../../../api/methods/chat";

let accessToken;
let userID;
let username;
let userImage;
let partnerImage;
let partnerName

Template.chatParent.onCreated(() => {
    accessToken = Cookies.get("accessToken");
})

Template.chatParent.onRendered(() => {
    $(document).ready(() => {
        $(".kt-chat__title").html("Nhắn tin với phụ huynh")
        $(".kt-chat__status").hide();

        $(".box_messages_foot").hide();
        // $(".kt-chat__messages").html(``)
    })
    this.getUserID = Tracker.autorun(() => {
        userID = Session.get(_SESSION.userID)
        username = Session.get(_SESSION.name)
        userImage = Session.get(_SESSION.avata)
        console.log(userImage, username, userID)
        console.log(userID)
    })

    renderListParents()

    this.loadMessagesInChatRoom = Tracker.autorun(() => {
        let roomID = Session.get(_SESSION.roomID)
        if (roomID) {
            Meteor.subscribe("message.publish.byRoomID", roomID);
            loadMessagesInChatRoom()
        }
    })
})

Template.chatParent.onDestroyed(() => {
    if (this.getUserID) this.getUserID = null;
    if (this.loadMessagesInChatRoom) this.loadMessagesInChatRoom = null;
})

Template.chatParent.events({
    'click .kt-widget__username': ClickUserName,
    'submit form': SubmitForm,

})

function loadMessagesInChatRoom() {
    let roomID = Session.get(_SESSION.roomID)
    let messages = COLLECTION_Messages.find({ roomID: roomID }).fetch();
    renderMessages(messages)
}

function renderMessages(messages) {
    console.log(partnerName)
    $(".kt-chat__title").html(partnerName)
    $(".box_messages_foot").show();
    let messagesData = messages.map(message => {
        console.log(message)
        if (message.sendBy == userID) {
            return renderRightMessage(message)
        } else {
            return renderLeftMessage(message)
        }
    })

    $(".kt-chat__messages").html(messagesData.join(" "));
}

function renderRightMessage(message) {
    return `<div class="kt-chat__message kt-chat__message--right">
                <div class="kt-chat__user">
                    <span class="kt-chat__datetime">${moment(message.updatedTime).startOf('hour').fromNow()}</span>
                    <a href="#" class="kt-chat__username">${username}</a>
                    <span class="kt-media kt-media--circle kt-media--sm"> 
                        <img src=${userImage} alt="image">   
                    </span>
                </div>
                <div class="kt-chat__text kt-bg-light-success">
                   ${message.text}
                </div>
            </div>`
}

function renderLeftMessage(message) {
    return `<div class="kt-chat__message">
                <div class="kt-chat__user">
                    <span class="kt-media kt-media--circle kt-media--sm"> 
                        <img src=${partnerImage} alt="image">   
                    </span>
                    <a href="#" class="kt-chat__username">${partnerName}</a>
                    <span class="kt-chat__datetime">${moment(message.updatedTime).startOf('hour').fromNow()}</span>
                </div>
                <div class="kt-chat__text kt-bg-light-success">
                   ${message.text}
                </div>
            </div>`
}

function ClickUserName(e) {
    e.preventDefault();
    $(".kt-chat__status").show();
    Session.set(_SESSION.roomID, $(e.currentTarget).attr("roomID"));
    console.log(Session.get(_SESSION.roomID))
    partnerImage = $(e.currentTarget).attr("partnerImage");
    partnerName = $(e.currentTarget).attr("partnerName")
}

function SubmitForm(e) {
    e.preventDefault();
    let message = $("#inbox_message").val();
    $("#inbox_message").val("");
    console.log(message)
    console.log(userID, Session.get(_SESSION.roomID))
    Meteor.call('message.create', {
        text: message,
        createdTime: Date.now(),
        updatedTime: Date.now(),
        isDeleted: false,
        sendBy: userID,
        roomID: Session.get(_SESSION.roomID),
        status: 0
    })
}

function renderListParents() {
    MeteorCall(_METHODS.Parent.GetAll, null, accessToken)
        .then(result => {
            console.log(result)
            createParentsRow(result)
        })
        .catch(handleError)
}

function createParentsRow(result) {
    let parentsRow = result.data.map(parentRow)
    $(".listParents").html(parentsRow.join(" "));
}

function parentRow(data) {
    let roomID = data.user._id + userID;
    let img
    let partnerImg
    if (data.user.image == null) {
        img = `<img src="/assets/media/users/default.jpg" alt="image">`
        partnerImg = "/assets/media/users/default.jpg"
    } else {
        img = `<img src="${_URL_images}/${data.user.image}/0" alt="image">`
        partnerImg = `${_URL_images}/${data.user.image}/0`
    }
    return `<div class="kt-widget__item" >
                <span class="kt-media kt-media--circle"> 
                    ${img}  
                </span>
                <div class="kt-widget__info">
                    <div class="kt-widget__section">
                        <a href="#" class="kt-widget__username" partnerImage=${partnerImg} partnerName="${data.user.name}" roomID="${roomID}">${data.user.name}</a>
                        <span class="kt-badge kt-badge--success kt-badge--dot"></span>
                    </div>

                    <span class="kt-widget__desc">
                       Lời nhắn cuối cùng
                    </span>
                </div>
                <div class="kt-widget__action">
                    <span class="kt-widget__date">giây phút cuối</span>
                    <span class="kt-badge kt-badge--success kt-font-bold">10</span>
                </div>
            </div>
        `
}