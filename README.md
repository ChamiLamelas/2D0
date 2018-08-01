# 2D0 Website

The purpose of 2D0 is to build upon the [Meteor tutorial](https://www.meteor.com/tutorials/react/creating-an-app) to-do project as well as the objectives taught at the 2018 Brandeis App Design Boot Camp.

## Getting Started

This project is built using the [Meteor](https://www.meteor.com/) framework in the [Atom IDE](https://atom.io/). The [Meteor](https://www.meteor.com/) framework uses a template system and the [Blaze](http://blazejs.org/) helper language to link HTML/CSS code with JavaScript code. [Meteor](https://www.meteor.com/) also comes with [Bootstrap](https://getbootstrap.com/) for easier HTML-styling as well as [MongoDB](https://www.mongodb.com/) which is a jQuery database for storing and manipulating data.

### Prerequisites

1) Install Meteor [here](http://www.meteor.com). Meteor installation can take a very long time, and sometimes on Windows devices, the firewall or antivirus software may have to be disabled. To check that Meteor installed successfully, do the following:
* If your computer is running Windows, open Windows Powershell (you may need to run it as an administrator). If your computer is running OSX, open Terminal.
* Navigate to the project folder using whichever command line you are using and open the todo folder. If you are unfamiliar with Unix bash, see this [tutorial](https://www.tutorialspoint.com/unix/).
* Run the following command:

```
meteor --version
```

* If Meteor installed properly, it will output something like the text below. If not, your command line will display an error.

```
Meteor 1.4.4.3
```

2) Once Meteor has been installed, install a text editor. Here are a couple besides [Atom](https://atom.io/), which was the IDE used for this project.
* [sublime text 3](https://www.sublimetext.com/)
* [notepad++](https://notepad-plus-plus.org/)
3) Google Chrome provides a good JavaScript debugger, so it is recommended that you use Google Chrome for testing. Download it [here](https://www.google.com/chrome/browser/desktop/) if you do not already have it. The debugger can be used to perform jQuery tests or check that status of your MongoDB collections, or to view the output of console.log statements in your code. Lastly, when you are testing, you may have to disable your ad-blocker.

### Set-Up

Once you have installed all of the prerequisite programs, you can begin the set-up for using the project.

#### Setting up Meteor in the project folder.

1) If your computer is running Windows, open Windows Powershell (you may need to run it as an administrator). If your computer is running OSX, open Terminal.
2) Navigate to the project folder using whichever command line you are using and open the todo folder. If you are unfamiliar with Unix bash, see this [tutorial](https://www.tutorialspoint.com/unix/).
3) Once you are in the todo folder of your project, follow these steps:

Install meteor into this project using the following command:

```
meteor npm install
```

Add the ReactiveDict package to the project. Using ReactiveDict is similar to using Session.get() and Session.set() where data is updated reactively to be used by the Templates. While there are advantages and disadvantages of using ReactiveDict over Session, the reason I used it was because ReactiveDict's scope is limited to the Template. Session variables are project global. If you are
interested more on the comparison between the two, see [this article](https://blog.meteor.com/the-meteor-chef-reactive-dict-reactive-vars-and-session-variables-971584515a27).

```
meteor add reactive-dict
```

Disable autopublishing in the Meteor project so the Meteor publish and subscribe functions can be used properly to control the transfer of data.

```
meteor remove autopublish
```

Remove the insecure package from the Meteor project for the creation of secure functions.

```
meteor remove insecure
```

### Running/Editing the Project

Once the set-up is complete, to run the project use the following command:

```
meteor run
```

Meteor will then build and prepare your app, and will inform you when your app has started at address localhost:3000/. If you wish to start and run the app in future from this project folder, only the last step must be repeated.

Every time you edit a file and save it in the editor, Meteor automatically updates your app and displays the updated app in your browser if you have it open.

If you ever need to wipe a collection, do so in the server start-up function. As of now, three helper functions for removing all Tasks, Profiles, and Chats from MongoDB have been defined. These can be run like so:

*server/startup.js*
```
// function that runs on server start-up
Meteor.startup(function(){
	 removeAllProfiles();
	 removeAllTasks();
	 removeAllChats();
});
```

For the purpose of debugging client side code, console.log is very useful and can be used as follows:

```
console.log("There seems to be an error here!");
```

For displaying JSON objects using console.log, use the following format:

```
let someObject = {var1:"foo",var2:"bar"};
console.log(`${JSON.stringify(someObject)}`);
```

If you ever want to check the state of your collections in the Chrome console, <collectionName>.find().fetch() displays the collection data as an array in the console. Throughout the source code, you will find other such commands including findOne() and parameters being added to find() such as limit or sort. For more information on performing CRUD (Create, Read, Update, and Delete) operations on the Meteor MongoDB collections, go [here](https://docs.meteor.com/api/collections.html).

Lastly, it is recommended to use the login/accounts system that comes with Meteor. That way, you do not have to worry about the security of users' credentials, or the punishments for theft of said data. The login/account system is very convenient to use, and you can edit what type of login system you would like (email & password vs. username & password for example). For more about the Meteor account/login system, go [here](https://guide.meteor.com/accounts.html).

## Authors

* **Chami Lamelas** - *Expansion on Meteor tutorial and work at 2018 App Design Boot Camp* - [LiquidsShadow](https://github.com/LiquidsShadow)

## Acknowledgments

* Meteor tutorial to-do app linked [here](https://www.meteor.com/tutorials/react/creating-an-app).
* [PurpleBooth](https://github.com/PurpleBooth) for their README [template](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2).
* App Design 2018 Boot Camp as taught by Professor [Tim Hickey](http://www.cs.brandeis.edu/~tim/).

## Other Useful Sources (Especially when learning HTML/CSS/JS)

* Bootstrap components [documentation](https://getbootstrap.com/docs/4.0/components/alerts/).
* w3schools HTML [Tutorials](https://www.w3schools.com/html/default.asp).
* w3schools CSS [Tutorials](https://www.w3schools.com/css/default.asp).
* w3schools JS [Tutorials](https://www.w3schools.com/js/default.asp).
* w3schools Bootstrap [Tutorials](https://www.w3schools.com/bootstrap/default.asp).
* MongoDB Shell Commands [documentation](https://docs.mongodb.com/manual/reference/method/).
* MongoDB Operators [documentation](https://docs.mongodb.com/manual/reference/operator/).
* Meteor API [documentation](https://docs.meteor.com/).
* JS Keycode [Info](http://keycode.info/).
