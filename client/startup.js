/*
This file contains code that runs on the Meteor client.

@author Chami Lamelas
*/

// Define project-wide variables
NAME_TXT = "Sort A-Z";
DATE_TXT = "Sort Newest to Oldest";

// Code that runs on console start-up
Meteor.startup(function(){
  console.log("starting up the client!");
});

// Set up a unique username-based account system. By default, Meteor uses an email-based account system
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});
