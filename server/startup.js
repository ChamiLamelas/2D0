/*
This file contains the code that runs on the Meteor server. All CRUD (Create, Read, Update, and Delete) operations performed on website data is handled
in this file. Client side code must call the methods defined here to perform CRUD operations. This code also defines what data is sent to clients by the server.
The encryption and any other security of these client to server requests is handled by Meteor. This way the MongoDB collections are operated on securely.

@author Chami Lamelas
*/

// function that runs on server start-up
Meteor.startup(function(){
	 // removeAllProfiles();
	 // removeAllTasks();
	 // removeAllChats();
});

// removes all the tasks from MongoDB
function removeAllTasks() {
	Tasks.find().forEach((task) => {
		Tasks.remove(task._id);
	});
}

// removes all the profiles from MongoDB
function removeAllProfiles() {
	Profiles.find().forEach((profile) => {
		Profiles.remove(profile._id);
	});
}

// removes all chats from MongoDB
function removeAllChats() {
	Chats.find().forEach((chat) => {
		Chats.remove(chat._id);
	});
}

// helper function in updating d.o.b. of user profiles
function getDateInputFormat(date) {
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var out = year + "-";
	if (month < 10)
		out += "0"
	out += month + "-";
	if (day < 10)
		out += "0";
	out += day;
	return out;
}

/*
Task Constructor

@params
	aName - name for the Task
	someAssignees - Task assignees
*/
function Task(aName, someAssignees) {
  this.name = aName;
  this.createdAt = new Date();
  this.done = false;
	this.doneBy = "";
	this.doneAtIP = "";
	this.assignees = someAssignees;
	this.isPrivate = false;
  this.owner = Meteor.userId();
  //this.email = Meteor.user().emails[0].address;
	this.username = Meteor.user().username;
}

// Profile Constructor
function Profile() {
	this.displayName = Meteor.user().username;
	this.dob = getDateInputFormat(new Date());
	this.pfp = "";
	this.bio = "";
	this.isPrivate = true;
	this.owner = Meteor.userId();
	this.username = Meteor.user().username;
}

/*
Chat Constructor

@params
	users - Chat's users
*/
function Chat(users) {
	this.users = users;
	this.messages = [];
	this.messageLimit = 10;
	this.lastUsed = new Date();
	this.owner = Meteor.userId();
	var prof = Profiles.findOne({owner:Meteor.userId()});
	this.title =prof.displayName;
	var e;
	for (e in this.users)
		this.title += ", " + this.users[e];
}

/*
Message Constructor

@params
	txt - text of the message
	img - attached image of the message
*/
function Message(txt, img) {
	var prof = Profiles.findOne({owner:Meteor.userId()});
	this.text = txt;
	this.imgSrc = img;
	this.createdAt = new Date();
	this.displayName = prof.displayName;
	this.username = prof.username;
	this.owner = prof.owner;
}

// Methods that perform CRUD operations on MongoDB collections. These methods are to be called in client-side code using Meteor.call() in order to edit server-side data.
Meteor.methods({
	// Creates a new Task with a name and assignees in the MongoDB collection
	"tasks.insert"(newTaskName, newTaskAssignees) {
		if (Meteor.userId()) {
			check(newTaskName, String);
			if (newTaskAssignees != null)
				check(newTaskAssignees, [String]);
			Tasks.insert(new Task(newTaskName, newTaskAssignees));
		}
	},
	// Deletes the Task with the target id from the MongoDB collection
	"tasks.remove"(targetId) {
		check(targetId, String);
		if (Tasks.findOne(targetId).owner == Meteor.userId()) {
			Tasks.remove(targetId);
		}
	},
	// Updates the Task with the target id from the MongoDB collection to be done or not done
	"tasks.setDone"(targetId, doneState) {
		check(targetId, String);
		const TASK = Tasks.findOne(targetId);
		if ((TASK.isPrivate && TASK.owner == Meteor.userId()) || (!TASK.isPrivate && (Meteor.userId() || (TASK.assignees != null && TASK.assignees.indexOf(Meteor.userId()) >= 0)))) {
			check(doneState, Boolean);
			var DONE_BY = "";
			var DONE_AT_IP = "";
			if (doneState) {
				DONE_BY = Meteor.user().username;
				DONE_AT_IP = this.connection.clientAddress;
			}
			Tasks.update(targetId, {$set: {done: doneState, doneBy:DONE_BY, doneAtIP:DONE_AT_IP}});
		}
	},
	// Updates the Task with the target id from the MongoDB collection to be private or public
	"tasks.setPrivate"(targetId, privateState) {
		check(targetId, String);
		if (Meteor.userId() == Tasks.findOne(targetId).owner) {
			check(privateState, Boolean);
			Tasks.update(targetId, {$set: {isPrivate: privateState}});
			if (privateState)
				Tasks.update(targetId, {$set: {assignees: []}});
		}
	},
	// Updates the Profile with the target id from the MongoDB collection to be private or public
	"profiles.setPrivate"(targetId, privateState) {
		check(targetId, String);
		if (Meteor.userId() == Profiles.findOne(targetId).owner) {
			check(privateState, Boolean);
			Profiles.update(targetId, {$set: {isPrivate: privateState}});
		}
	},
	// Updates the Profile with the target id from the MongoDB collection to have a new display name, new d.o.b., new profile picture, and new bio
	"profiles.update"(targetId, newDisplayName, newDob, newPfp, newBio) {
		check(targetId, String);
		if (Meteor.userId() == Profiles.findOne(targetId).owner) {
			check(newDisplayName, String);
			check(newDob, String);
			check(newPfp, String);
			check(newBio, String);
			Profiles.update(targetId, {$set: {displayName: newDisplayName, dob: newDob, pfp:newPfp, bio:newBio}});
		}
	},
	// Creates a Chat with users in the MongoDB collection
	"chats.insert"(users) {
		if (Meteor.userId() && users != null) {
			check(users, [String]);
			Chats.insert(new Chat(users));
		}
	},
	// Updates the message limit of a Chat with a new limit in the MongoDB collection
	"chats.updateLimit"(chat, limit) {
		if (Meteor.userId()) {
			check(chat, String);
			var lim = parseInt(limit);
			check(lim, Match.Integer);
			Chats.update(chat, {$set: {messageLimit:lim}});
		}
	},
	// Updates the messages of a Chat with some text and (possibly) an image in the MongoDB collection
	"chats.addMsg"(chat, txt, img) {
		check(chat, String);
		var theChat = Chats.findOne(chat);
		if (theChat.users.indexOf(Meteor.user().username) >= 0 || Meteor.userId() == theChat.owner) {
			check(txt, String);
			check(img, String);
			var newMessages = Chats.findOne(chat).messages;
			newMessages.push(new Message(txt, img));
			Chats.update(chat, {$set: {messages: newMessages, lastUsed: new Date()}});
		}
	},
	// Deletes the Chat with the target id from the MongoDB collection
	"chats.remove"(targetId) {
		check(targetId, String);
		if (Meteor.userId() == Chats.findOne(targetId).owner) {
			Chats.remove(targetId);
		}
	}
});

/*
Publishing and Subscribing is how Meteor restricts which data is sent from the server and picked up by the client respectively. In these functions, the server
controls which data is sent to clients.
*/

// publishes the Tasks classified under "mytasks"
Meteor.publish("mytasks", function() {
	return Tasks.find({owner:this.userId});
});

// publishes the Tasks classified under "publicTasks"
Meteor.publish("publicTasks", function() {
	return Tasks.find({isPrivate:false, owner:{$ne:this.userId}}, {fields:{doneBy:0, doneAtIP:0}});
});

// publishes the Profile classified under "myprofile"
Meteor.publish("myprofile", function() {
	if (this.userId) {
		if (!Profiles.findOne({owner:this.userId}))
			Profiles.insert(new Profile());
		return Profiles.find({owner:this.userId});
	}
	return undefined;
});

// publishes the Profiles classified under "privateProfiles"
Meteor.publish("privateProfiles", function() {
	return Profiles.find({owner: {$ne:this.userId}, isPrivate:true}, {fields:{username:1, isPrivate:1}});
});

// publishes the Profiles classified under "publicProfiles"
Meteor.publish("publicProfiles", function() {
	return Profiles.find({owner: {$ne:this.userId}, isPrivate:false});
});

// publishes the Chats classified under "chats"
Meteor.publish("chats", function() {
	if (this.userId) {
		var username = Meteor.users.findOne(this.userId).username;
		return Chats.find({$or:[{owner:this.userId}, {users:username}]}, {sort:{lastUsed:-1}});
	}
	return undefined;
});
