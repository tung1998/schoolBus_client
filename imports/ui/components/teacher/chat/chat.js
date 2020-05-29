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

Template.chatParent.onCreated(() => {
    accessToken = Cookies.get("accessToken");
    Meteor.subscribe("message.publish.All");
})

Template.chatParent.onRendered(() => {

    this.getUserID = Tracker.autorun(() => {
        userID = Session.get(_SESSION.userID)
        username = Session.get(_SESSION.name)
        userImage = Session.get(_SESSION.avata)
        renderListParents()
        if (FlowRouter.getQueryParam('parentID')) {
            $(`a[partnerid=${FlowRouter.getQueryParam('parentID')}]`).trigger('click')
        } else $(`a[partnerid]`).first().trigger('click')
    })

    this.renderListParentss = Tracker.autorun(() => {
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
        if (roomID) {
            loadMessagesInChatRoom(messages)
        }
    })
})

Template.chatParent.onDestroyed(() => {
    if (this.getUserID) this.getUserID = null;
    if (this.loadMessagesInChatRooms) this.loadMessagesInChatRoom = null;
    if (this.renderListParentss) this.renderListParents = null;
})

Template.chatParent.events({
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
    partnerImageUrl = $(e.currentTarget).attr("partnerImage");
    partnerName = $(e.currentTarget).attr("partnerName");
    partnerID = $(e.currentTarget).attr("partnerID");
    if (!partnerImageUrl) {
        img = `<img src="/assets/media/users/default.jpg" alt="image">`
    } else {
        img = `<img src="${partnerImageUrl}" alt="image">`
    }
    $('.avata-center').html(img)
}

function SubmitForm(e) {
    e.preventDefault();
    let message = $("#inbox_message").val();
    $("#inbox_message").val("");
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
        else { }
    })
    updateStatus(Session.get(_SESSION.roomID), partnerID);
    $(`#${Session.get(_SESSION.roomID)}`).children(".kt-widget__action").html(``)
}

function renderListParents() {
    MeteorCall(_METHODS.class.GetAll, null, accessToken)
        .then(result => {
            result.data.map(value => {
                MeteorCall(_METHODS.Parent.GetByClass, { _id: value._id }, accessToken)
                    .then(parent => {
                        if (parent.length)
                            createParentsRow(parent)
                    })
                    .catch(handleError);
            })
        }).catch(handleError)
}

function createParentsRow(result) {
    let listParent = []
    let parentsRow = []
    result.map(pr1 => {
        let check = true
        listParent.map(pr => {
            if (pr._id == pr1.user._id) {
                check = false;
            }
        })
        if (check) {
            parentsRow.push(pr1);
            listParent.push(pr1.user);
        }
    })
    let row = parentsRow.map(parentRow)
    $(".listParents").html(row.join(" "));
    if (FlowRouter.getQueryParam('parentID')) {
        $(`a[partnerid=${FlowRouter.getQueryParam('parentID')}]`).trigger('click')
    } else $(`a[partnerid]`).first().trigger('click')
}

function parentRow(data) {
    let roomID = data.user._id + userID;
    listRoomID.push(roomID);
    let img
    let partnerImg
    let unreaIcon
    if (data.user.image == null) {
        img = `<img src="/assets/media/users/default.jpg" alt="image">`
        partnerImg = "/assets/media/users/default.jpg"
    } else {
        img = `<img src="${_URL_images}/${data.user.image}/0" alt="image">`
        partnerImg = `${_URL_images}/${data.user.image}/0`
    }
    let messageInfo = getLastestAndCountUnSeenMessage(roomID);
    if (messageInfo[0] == 0) {
        unreaIcon = "";
    } else {
        unreaIcon = `<span class="kt-badge kt-badge--success kt-font-bold unreadMessage" unreadID=${roomID}> ${messageInfo[0]}</span>`
    }
    return `<div class="kt-widget__item" id=${roomID}>
                <span class="kt-media kt-media--circle"> 
                    ${img}  
                </span>
                <div class="kt-widget__info">
                    <div class="kt-widget__section">
                        <a href="#" class="kt-widget__username" partnerID=${data.user._id} partnerImage=${partnerImg} partnerName="${data.user.name}" roomID="${roomID}">${data.user.name}</a>
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
    Meteor.call('message.update', roomID, sendBy, (result, err) => {
        if (err) throw err;
        else { }
    })
}