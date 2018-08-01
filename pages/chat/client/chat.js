/*
This file defines the code to be used by the Chat and Message Templates.

@author Chami Lamelas
*/

let img = ""; // global variable, does not matter if this variable is wiped on page refresh.. used by prompt() for image attachment

// Calls the server-side code to update a Chat's message limit given an instance from which to extract the new message limit
function updateMessageLimit(chat, instance) {
  const LIMIT = instance.$("#js-msgLimit").val();
  if (LIMIT != "") {
    Meteor.call("chats.updateLimit", chat, LIMIT);
    instance.$("#js-msgLimit").val("");
  }
}

// Calls the server-side code to update a Chat's messages with the newly sent message extracted from a given instance
function sendMessage(chat, instance) {
  const TXT = instance.$("#js-newMsg").val();
  if (TXT != "") {
    Meteor.call("chats.addMsg", chat, TXT, img);
    instance.$("#js-newMsg").val("");
    img = "";
  }
}

// On Chat Template's creation, subscribes to the necessary MongoDB collection data that is published by the server
Template.chat.onCreated(function() {
  Meteor.subscribe("chats");
  Meteor.subscribe("myprofile");
  Meteor.subscribe("privateProfiles");
  Meteor.subscribe("publicProfiles");
});

// When the Chat Template is rendered, the chatbox will scroll to the bottom of the chat box and will be animated smoothly
Template.chat.onRendered(function() {
  $('#js-chatBox').animate({scrollTop: $('#js-chatBox').prop('scrollHeight')}, 500);
});

// These are the Chat Template's helper functions; these functions are called in Blaze code in the "chat" template in chat.html
Template.chat.helpers({
  // gets the messages to be displayed in the chat box. the chat box automatically will scroll to the bottom of the chat box and animate smoothly.
  getMessages() {
    $('#js-chatBox').animate({scrollTop: $('#js-chatBox').prop('scrollHeight')}, 500);
    let limitedMessages = [];
    if (this._id) {
      let start = this.messages.length-this.messageLimit;
      if (start < 0)
        start = 0;
      let i;
      for (i = start; i < this.messages.length; i++) {
        limitedMessages[i-start] = this.messages[i];
      }
    }
    return limitedMessages;
  },
  // checks whether the logged-in user is the owner of the chat
  isOwner() {
    return Meteor.userId() == this.owner;
  },
  // checks whether the logged-in user is authorized to view this chat
  canViewChat() {
    return Meteor.userId() == this.owner || (this.users && this.users.indexOf(Meteor.user().username) >= 0);
  }
});

// These are the Chat Template's events functions; these functions are triggered by events in the "chat" template in chat.html
Template.chat.events({
  // If a key is pressed in the js-msgLimit text box; keycode info: http://keycode.info/
  "keypress #js-msgLimit"(event, instance) {
    if (event.which == 13)
      updateMessageLimit(this._id, instance);
  },
  // If the js-msgLimUpdate button is clicked
  "click #js-msgLimUpdate"(event, instance) {
    updateMessageLimit(this._id, instance);
  },
  // If the js-newMsg button is clicked
  "keypress #js-newMsg"(event, instance) {
    if (event.which == 13)
      sendMessage(this._id, instance);
  },
  // If the js-addPic button is clicked
  "click #js-addPic"(event, instance) {
    img = prompt("What image would you like to link?", "enter image link");
  },
  // If the js-send button is clicked
  "click #js-send"(event, instance) {
    sendMessage(this._id, instance);
  },
  // If the js-del button is clicked
  "click #js-del"(event, instance) {
    Meteor.call("chats.remove", this._id);
    Router.go("myprofileHead");
  }
});

// These are the Message Template's helper functions; these functions are called by the Blaze code in the "message" template in chat.html
Template.message.helpers({
  // Checks whether or not this message has an image that has been attached
  hasAttachedImg() {
    return this.imgSrc != "";
  },
});
