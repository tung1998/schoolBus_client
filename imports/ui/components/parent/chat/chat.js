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
let partnerName;
let partnerID;
let listRoomID = [];


Template.chatTeacher.onCreated(() => {
    accessToken = Cookies.get("accessToken");
    Meteor.subscribe("message.publish.All");
})

Template.chatTeacher.onRendered(() => {
    this.getUserID = Tracker.autorun(() => {
        userID = Session.get(_SESSION.userID)
        username = Session.get(_SESSION.name)
        userImage = Session.get(_SESSION.avata)
        renderListTeacher()
    })

    this.renderListTeachers = Tracker.autorun(() => {
        let messages = COLLECTION_Messages.find({ isDeleted: false, sendBy: { $ne: userID } }).fetch();
        console.log(listRoomID)
        listRoomID.map(value => {
            console.log(value)
            let lastestMsg = [];
            let countUnread = 0;
            messages.map(msg => {
                if (msg.roomID == value) {
                    console.log(msg.text)
                    lastestMsg.push(msg.text);
                    if (msg.status == 0) {
                        countUnread++;
                    }
                }

            })
            console.log(lastestMsg);

            $(`#${value}`).children(".kt-widget__info").children(".kt-widget__desc").html(lastestMsg[lastestMsg.length - 1])
            if (countUnread != 0 && countUnread < 11) {
                $(`#${value}`).children(".kt-widget__action").html(`<span class="kt-badge kt-badge--success kt-font-bold unreadMessage" >${countUnread}</span>`)
            } else if (countUnread > 10) {
                $(`#${value}`).children(".kt-widget__action").html(`<span class="kt-badge kt-badge--success kt-font-bold unreadMessage" >10+</span>`)
            }
        })
    })

    this.loadMessagesInChatRooms = Tracker.autorun(() => {
        let roomID = Session.get(_SESSION.roomID)
        let messages = COLLECTION_Messages.find({ roomID: roomID, isDeleted: false }).fetch();
        if (messages) {
            loadMessagesInChatRoom(messages)
        }
    })
})

Template.chatTeacher.onDestroyed(() => {
    if (this.getUserID) this.getUserID = null;
    if (this.loadMessagesInChatRooms) this.loadMessagesInChatRooms = null;
    if (this.renderListTeachers) this.renderListTeachers = null;
})

Template.chatTeacher.events({
    'click .kt-widget__username': ClickUserName,
    'submit form': SubmitForm,
})

function loadMessagesInChatRoom(messages) {
    renderMessages(messages)
}

function renderMessages(messages) {
    $(".kt-chat__title").html(partnerName)
    $(".box_messages_foot").show();
    let messagesData = messages.map(message => {
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
                    <span class="kt-chat__datetime">${moment(message.updatedTime).startOf('second').fromNow()}</span>
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
                    <span class="kt-chat__datetime">${moment(message.updatedTime).startOf('second').fromNow()}</span>
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
    partnerName = $(e.currentTarget).attr("partnerName");
    partnerID = $(e.currentTarget).attr("partnerID");
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
    }, (result, err) => {
        if (err) throw err;
        else {}
    })
    updateStatus(Session.get(_SESSION.roomID), partnerID);
    $(`#${Session.get(_SESSION.roomID)}`).children(".kt-widget__action").html(``)
}

function renderListTeacher() {
    console.log(userID)
    MeteorCall(_METHODS.token.GetUserInfo, null, accessToken)
        .then(result => {
            console.log(result);
            createTeachersRow(result);
        }).catch(handleError)
}

function createTeachersRow(result) {
    let listTeacher = []
    let teachersRow = []

    result.students.map(std => {
        let check = true
        listTeacher.map(tc => {
            if (tc._id == std.class.teacher.user._id) {
                check = false;
            }
        })
        if (check) {
            teachersRow.push(std);
            listTeacher.push(std.class.teacher.user);
        }
    })
    let row = teachersRow.map(teacherRow);
    $(".listParents").html(row.join(" "));
}

function teacherRow(data) {
    let roomID = userID + data.class.teacher.user._id;
    listRoomID.push(roomID);
    let img
    let partnerImg
    let unreaIcon
    if (data.class.teacher.user.image == null) {
        img = `<img src="/assets/media/users/default.jpg" alt="image">`
        partnerImg = "/assets/media/users/default.jpg"
    } else {
        img = `<img src="${_URL_images}/${data.class.teacher.user.image}/0" alt="image">`
        partnerImg = `${_URL_images}/${data.class.teacher.user.image}/0`
    }
    let messageInfo = getLastestAndCountUnSeenMessage(roomID);
    if (messageInfo[0] == 0) {
        unreaIcon = "";
    } else {
        unreaIcon = `<span class="kt-badge kt-badge--success kt-font-bold unreadMessage" > ${messageInfo[0]}</span>`
    }
    return `<div class="kt-widget__item" id=${roomID}>
                <span class="kt-media kt-media--circle"> 
                    ${img}  
                </span>
                <div class="kt-widget__info">
                    <div class="kt-widget__section">
                        <a href="#" class="kt-widget__username" partnerID=${data.class.teacher.user._id} partnerImage=${partnerImg} partnerName="${data.class.teacher.user.name}" roomID="${roomID}">${data.class.teacher.user.name}</a>
                        <span class="kt-badge kt-badge--success kt-badge--dot"></span>
                    </div>

                    <span class="kt-widget__desc">
                       ${messageInfo[1]}
                    </span>
                </div>
                <div class="kt-widget__action">
                    ${unreaIcon}
                </div>
            </div>
        `
}

function getLastestAndCountUnSeenMessage(roomID) {
    let messages = COLLECTION_Messages.find({ roomID: roomID, sendBy: { $ne: userID }, isDeleted: false }, { sort: { createdTime: -1 } }).fetch();
    let result = [];
    console.log(messages);
    result.push(getUnSeenMessages(messages));
    if (messages[0]) {
        result.push(messages[0].text);
    } else {
        result.push("");
    }
    return result;
}

function getUnSeenMessages(messages) {
    let count = 0;
    messages.map(msg => {
        if (msg.status == 0) {
            count++;
        }
    })
    if (count <= 10) {
        return count;
    } else {
        return "10+";
    }
}

function updateStatus(roomID, sendBy) {
    console.log("status")
    Meteor.call('message.update', roomID, sendBy, (result, err) => {
        if (err) throw err;
        else {}
    })
}