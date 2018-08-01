/*
This file defines the code that is used by the myprofileHead, myprofile, and profile Templates.

@author Chami Lamelas
*/

// global variables
const ADD_TXT = "+";
const CANCEL_TXT = "Cancel";

// On myprofileHead Template's creation, subscribes to the necessary MongoDB collection data that is published by the server
Template.myprofileHead.onCreated(function() {
  Meteor.subscribe("myprofile");
  Meteor.subscribe("mytasks");
  Meteor.subscribe("publicTasks");
  Meteor.subscribe("chats");
  Meteor.subscribe("privateProfiles");
  Meteor.subscribe("publicProfiles");
});

// These are the myprofileHead Template's helper functions; these functions are called in Blaze code in the "myprofileHead" template in myprofile.html
Template.myprofileHead.helpers({
  // gets the Profile that belongs to the logged-in user
  getProfile() {
    return Profiles.findOne({owner:Meteor.userId()});
  }
});

// On myprofile Template's creation sets up a ReactiveDict for ui state variables.
Template.myprofile.onCreated(function() {
  this.uiState = new ReactiveDict();
  this.uiState.set("taskSort", NAME_TXT);
  this.uiState.set("assnSort", NAME_TXT);
  this.uiState.set("editing", false);
  this.uiState.set("addChat", ADD_TXT);
});

// These are the myprofile Template's events functions; these functions are triggered by events in the "myprofile" template in myprofile.html
Template.myprofile.events({
  // If the js-private button is clicked
  "click #js-private"(event, instance) {
    let confirmUpdate = true;
    if (this.me.isPrivate)
      confirmUpdate = confirm("Are you sure you want to make your profile public? All of your profile data can now be viewed by anyone. Your private tasks and chats however will remain private.");
    if (confirmUpdate)
      Meteor.call("profiles.setPrivate", this.me._id, !this.me.isPrivate);
  },
  // If the js-edit button is clicked
  "click #js-edit"(event, instance) {
    instance.uiState.set("editing", true);
  },
  // If the js-update button is clicked
  "click #js-update"(event, instance) {
    const NAME = instance.$("#js-displayName").val();
    const DOB = instance.$("#js-dob").val();
    const PFP = instance.$("#js-pfp").val();
    const BIO = instance.$("#js-bio").val();
    Meteor.call("profiles.update", this.me._id, NAME, DOB, PFP, BIO);
    instance.uiState.set("editing", false);
  },
  // If the js-cancel button is clicked
  "click #js-cancel"(event, instance) {
    instance.uiState.set("editing", false);
  },
  // If the js-taskSort button is clicked
  "click #js-taskSort"(event, instance) {
    if (instance.uiState.get("taskSort") == DATE_TXT) {
      instance.uiState.set("taskSort", NAME_TXT);
    }
    else {
      instance.uiState.set("taskSort", DATE_TXT);
    }
  },
  // If the js-assnSort button is clicked
  "click #js-assnSort"(event, instance) {
    if (instance.uiState.get("assnSort") == DATE_TXT) {
      instance.uiState.set("assnSort", NAME_TXT);
    }
    else {
      instance.uiState.set("assnSort", DATE_TXT);
    }
  },
  // If the js-addChat button is clicked
  "click #js-addChat"(event, instance) {
    if (instance.uiState.get("addChat") == ADD_TXT) {
      instance.uiState.set("addChat", CANCEL_TXT);
    }
    else {
      instance.uiState.set("addChat", ADD_TXT);
    }
  },
  // If the js-makeChat button is clicked
  "click #js-makeChat"(event, instance) {
    Meteor.call("chats.insert", instance.$("#js-users").val());
    instance.$("#js-users").val("")
    instance.uiState.set("addChat", ADD_TXT);
  }
});

// Helper function that gets logged-in user's assigned tasks sorted correctly using the provided instance
function hGetMyAssignments(inst) {
  let sortedTasks = [];
  let assignedTasks = [];
  if (inst.uiState.get("assnSort") == NAME_TXT) {
    sortedTasks = Tasks.find({owner:{$ne:Meteor.userId()}}, {sort:{createdAt:-1}});
  }
  else {
    sortedTasks = Tasks.find({owner:{$ne:Meteor.userId()}}, {sort:{name:1}});
  }
  sortedTasks.forEach((task)=>{
    if (task.assignees != null && task.assignees.indexOf(Meteor.user().username) >= 0)
      assignedTasks.push(task);
  });
  return assignedTasks;
}

// These are the myprofile Template's helper functions; these functions are called in Blaze code in the "myprofile" template in myprofile.html
Template.myprofile.helpers({
  // Gets the logged-in user's tasks
  getMyTasks() {
    if (Template.instance().uiState.get("taskSort") == NAME_TXT)
      return Tasks.find({owner:Meteor.userId()}, {sort:{createdAt:-1}}).fetch();
    return Tasks.find({owner:Meteor.userId()}, {sort:{name:1}}).fetch();
  },
  // Gets the number of the logged-in user's tasks
  getNumTasks() {
    return Tasks.find({owner:Meteor.userId()}).count();
  },
  // Gets the logged-in user's assigned tasks
  getMyAssignments() {
    return hGetMyAssignments(Template.instance());
  },
  // Gets the number of the logged-in user's assigned tasks
  getNumAssignments() {
    return hGetMyAssignments(Template.instance()).length;
  },
  // Gets the my task sort ui state variable from the ReactiveDict
  getTaskSort() {
    return Template.instance().uiState.get("taskSort");
  },
  // Gets the assigned task sort ui state variable from the ReactiveDict
  getAssnSort() {
    return Template.instance().uiState.get("assnSort");
  },
  // Checks whether or not the user is editing based on the ui state ReactiveDict
  isEditing() {
    return Template.instance().uiState.get("editing");
  },
  // Gets the chats that belong to the logged-in user
  getChats() {
    return Chats.find().fetch();
  },
  // Gets the number of chats that belong to the logged-in user
  getNumChats() {
    return Chats.find().count();
  },
  // Checks the state of whether or not the user is adding a chat from the ui state ReactiveDict
  isAdding() {
    return Template.instance().uiState.get("addChat") == CANCEL_TXT;
  },
  // Gets all of the Profiles not owned by the logged-in user
  users() {
    return Profiles.find({owner:{$ne:Meteor.userId()}}).fetch();
  }
});

/*
On profile Template's creation, subscribes to the necessary MongoDB collection data that is published by the server and sets up a ReactiveDict for ui state
variables.
*/
Template.profile.onCreated(function() {
  Meteor.subscribe("publicTasks");
  Meteor.subscribe("myprofile");
  Meteor.subscribe("privateProfiles");
  Meteor.subscribe("publicProfiles");
  this.uiState = new ReactiveDict();
  this.uiState.set("taskSort", NAME_TXT);
  this.uiState.set("assnSort", NAME_TXT);
});

// These are the profile Template's events functions; these functions are triggered by events in the "profile" template in myprofile.html
Template.profile.events({
  // If the js-taskSort button is clicked
  "click #js-taskSort"(event, instance) {
    if (instance.uiState.get("taskSort") == DATE_TXT) {
      instance.uiState.set("taskSort", NAME_TXT);
    }
    else {
      instance.uiState.set("taskSort", DATE_TXT);
    }
  },
  // If the js-assnSort button is clicked
  "click #js-assnSort"(event, instance) {
    if (instance.uiState.get("assnSort") == DATE_TXT) {
      instance.uiState.set("assnSort", NAME_TXT);
    }
    else {
      instance.uiState.set("assnSort", DATE_TXT);
    }
  }
});

// Helper function that gets the tasks assigned to this profile sorted correctly using the provided instance
function hGetAssignments(inst, name) {
  let sortedTasks = [];
  let assignedTasks = [];
  if (inst.uiState.get("assnSort") == NAME_TXT) {
    sortedTasks = Tasks.find({username:{$ne:name}}, {sort:{createdAt:-1}});
  }
  else {
    sortedTasks = Tasks.find({username:{$ne:name}}, {sort:{name:1}});
  }
  sortedTasks.forEach((task)=>{
    if (task.assignees != null && task.assignees.indexOf(name) >= 0) {
      assignedTasks.push(task);
    }
  });
  return assignedTasks;
}

// These are the profile Template's helper functions; these functions are called in Blaze code in the "profile" template in myprofile.html
Template.profile.helpers({
  // Gets the public tasks created by this profile's username
  getPublicTasks() {
    if (Template.instance().uiState.get("taskSort") == NAME_TXT)
      return Tasks.find({username:this.username}, {sort:{createdAt:-1}}).fetch();
    return Tasks.find({username:this.username}, {sort:{name:1}}).fetch();
  },
  // Gets the number of public tasks created by this profile's username
  getNumPublicTasks() {
    return Tasks.find({username:this.username}).count();
  },
  // Gets the tasks assigned to this profile
  getAssignments() {
    return hGetAssignments(Template.instance(), this.username);
  },
  // Gets the number of tasks assigned to this profile
  getNumAssignments() {
    return hGetAssignments(Template.instance(), this.username).length;
  },
  // Gets the state of this profile's task sort selection from the ui state ReactiveDict
  getTaskSort() {
    return Template.instance().uiState.get("taskSort");
  },
  // Gets the state of this profile's assignment sort selection from the ui state ReactiveDict
  getAssnSort() {
    return Template.instance().uiState.get("assnSort");
  },
  // Reroutes to the logged-in user's profile page if possible
  rerouteIfPossible() {
    if (Meteor.user() && Meteor.user().username == this.username)
      Router.go("myprofileHead");
  }
});
