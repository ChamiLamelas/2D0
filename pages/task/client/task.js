/*
This is the file that defines the code that runs in the taskPage and task templates.

@author Chami Lamelas
*/

/*
On taskPage Template's creation, subscribes to the necessary MongoDB collection data that is published by the server and sets up a ReactiveDict for ui state
variables.
*/
Template.taskPage.onCreated( function () {
  this.uiState = new ReactiveDict();
  this.uiState.set("sort", NAME_TXT);
  this.uiState.set("initPrivate", true);
  this.uiState.set("hideCompleted", false);
  Meteor.subscribe("mytasks");
  Meteor.subscribe("publicTasks");
  Meteor.subscribe("myprofile");
  Meteor.subscribe("privateProfiles");
  Meteor.subscribe("publicProfiles");
});

/*
Helper function that calls the functions that add the new Task created from the data extracted from the provided instance to the MongoDB
"tasks" collection.
*/
function addNewTask(instance) {
  const NAME = instance.$("#js-name").val();
  if (NAME != "") {
    Meteor.call("tasks.insert", NAME, instance.uiState.get("initPrivate"), instance.$("#js-assignees").val());
    instance.$("#js-name").val("");
    instance.uiState.set("initPrivate", true);
    instance.$("#js-assignees").val("");
  }
}

// These are the taskPage Template's events functions; these functions are triggered by events in the "taskPage" template in task.html
Template.taskPage.events({
  // If a key is pressed in the js-name text box; keycode info: http://keycode.info/
  "keypress #js-name"(event, instance) {
    if (event.which == 13)
      addNewTask(instance);
  },
  // If the js-create button is clicked
  "click #js-create"(event, instance) {
    addNewTask(instance);
  },
  // If the js-hideCompleted checkbox is clicked
  "click #js-hideCompleted"(event, instance) {
    instance.uiState.set("hideCompleted", event.target.checked);
  },
  // If the js-initPrivate checkbox is clicked
  "click #js-initPrivate"(event, instance) {
    instance.uiState.set("initPrivate", event.target.checked);
  },
  // If the js-sort button is clicked
  "click #js-sort"(event, instance) {
    if (instance.uiState.get("sort") == DATE_TXT) {
      instance.uiState.set("sort", NAME_TXT);
    }
    else {
      instance.uiState.set("sort", DATE_TXT);
    }
  }
});

// These are the taskPage Template's helper functions; these functions are called by the Blaze code in the "taskPage" template in task.html
Template.taskPage.helpers({
  // Gets the current sort value from the uiState ReactiveDict
  getSort() {
    return Template.instance().uiState.get("sort");
  },
  // Gets all of the Profiles besides the one owned by the logged-in user
  users() {
    return Profiles.find({owner:{$ne:Meteor.userId()}}).fetch();
  },
  // Gets all of the Tasks according to the current sort selection and whether or not the user has chosen to hide completed tasks
  getTasks() {
    const SORT_BY_DATE = Template.instance().uiState.get("sort") == NAME_TXT;
    if (Template.instance().uiState.get("hideCompleted")) {
      if (SORT_BY_DATE)
        return Tasks.find({done:false}, {sort: {createdAt:-1}}).fetch();
      return Tasks.find({done:false}, {sort: {name:1}}).fetch();
    }
    else {
      if (SORT_BY_DATE)
        return Tasks.find({}, {sort: {createdAt:-1}}).fetch();
      return Tasks.find({}, {sort: {name:1}}).fetch();
    }
  },
  // Gets the number of tasks that have not been done
  incompleteTaskCount() {
    return Tasks.find({done:false}).count();
  },
  // Checks whether or not the user has set the new Task to be created as initially private
  isInitPrivate() {
    return Template.instance().uiState.get("initPrivate");
  }
});

// These are the task Template's events functions; these functions are triggered by events in the "task" template in task.html
Template.task.events({
  // If the js-delete button is clicked
  "click #js-delete"(event, instance) {
    Meteor.call("tasks.remove", this._id);
  },
  // If the js-done button is clicked
  "click #js-done"(event, instance) {
    Meteor.call("tasks.setDone", this._id, !this.done);
  },
  // If the js-private button is clicked
  "click #js-private"(event, instance) {
    Meteor.call("tasks.setPrivate", this._id, !this.isPrivate);
  }
});

// These are the task Template's helper functions; these functions are called by the Blaze code in the "task" template in task.html
Template.task.helpers({
  // Checks whether the logged-in user is the owner of this task
  isOwner() {
    return Meteor.userId() == this.owner;
  },
  // Checks whether the logged-in user is an assignee of this task
  isAssignee() {
    return Meteor.userId() && this.assignees.indexOf(Meteor.user().username) >= 0;
  },
  // Checks whether or not the task has any assignees
  hasAssignees() {
    return this.assignees != null;
  },
  // Gets the profiles of this task's assignees
  getAssigneesProfiles() {
    let assigneeProfiles = [];
    for (i in this.assignees) {
      assigneeProfiles[i] = Profiles.findOne({username:this.assignees[i]});
    }
    return assigneeProfiles;
  },
  // Checks whether not the logged-in user can complete this task
  canComplete() {
    return Meteor.userId() && ((this.assignees != null && this.assignees.indexOf(Meteor.user().username) >= 0) || Meteor.userId() == this.owner);
  },
  // Gets the link of the creator of the task
  getCreatorLink() {
    return "/profiles/" + Profiles.findOne({username:this.username})._id;
  }
});
