/*
This file defines the routing to be used by the website. Routing can be done by calling Router.go() in client side code.

@author Chami Lamelas
*/

Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
});

/*
"/" Defines the main page route that can be accessed by clicking the name of the website and the home page link on the navigation bar; the name field
speciifies the name of the desired template to be displayed
*/
Router.route('/', {name: 'taskPage'});
// Regular routing; the name of the desired template to be routed to is provided
Router.route("myprofileHead");
Router.route("profileList");
/*
"xs/:_id" is the generic route for this route request. All of the routes are "x" routes and will be displayed using the x template, as shown by the name
field specifying the profile template's name. The data to be displayed in the profile template is specified by the "id" parameter of the generic route and
is extracted using the function() defined below.
*/
Router.route("profiles/:_id", {name:"profile", data: function() {
	return Profiles.findOne(this.params._id);
}});
Router.route("tasks/:_id", {name:"task", data: function() {
	return Tasks.findOne(this.params._id);
}});
Router.route("chats/:_id", {name:"chat", data: function() {
	return Chats.findOne(this.params._id);
}});
