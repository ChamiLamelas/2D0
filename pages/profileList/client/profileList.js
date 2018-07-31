/*
This file defines the code that is used by the profileList and profileBar Templates.

@author Chami Lamelas
*/

// global variables
const AZ_TXT = "Sort A-Z";
const ZA_TXT = "Sort Z-A";

/*
On profileList Template's creation, subscribes to the necessary MongoDB collection data that is published by the server and sets up a ReactiveDict for ui state
variables.
*/
Template.profileList.onCreated(function() {
  this.uiState = new ReactiveDict();
  this.uiState.set("profileSort", ZA_TXT);
  Meteor.subscribe("myprofile");
  Meteor.subscribe("privateProfiles");
  Meteor.subscribe("publicProfiles");
});

// These are the profileList Template's helper functions; these functions are called in Blaze code in the "profileList" template in profileList.html
Template.profileList.helpers({
  // gets the profileSort ReactiveDict variable
  getProfileSort() {
    return Template.instance().uiState.get("profileSort");
  },
  // gets the profiles to be displayed on the list based on the current sort selection
  getProfiles() {
    if (Template.instance().uiState.get("profileSort")==AZ_TXT)
      return Profiles.find({}, {sort:{username:-1}}).fetch();
    return Profiles.find({}, {sort: {username:1}}).fetch();
  },
  // gets the number of profiles to be displayed
  getNumProfiles() {
    return Profiles.find().count();
  }
});

// These are the profileList Template's events functions; these functions are triggered by events in the "profileList" template in profileList.html
Template.profileList.events({
  // If the js-profileSort button is clicked
  "click #js-profileSort"(event, instance) {
    if (instance.uiState.get("profileSort")==AZ_TXT) {
      instance.uiState.set("profileSort", ZA_TXT);
    }
    else {
      instance.uiState.set("profileSort", AZ_TXT);
    }
  }
});

// These are the profileBar Template's helper functions; these functions are called in Blaze code in the "profileBar" template in profileList.html
Template.profileBar.helpers({
  // checks whether or not the logged-in user is the owner of the current profile being displayed in the bar
  isOwner() {
    if (Meteor.userId())
      return this.curr.username == Meteor.user().username;
    return false;
  },
});
