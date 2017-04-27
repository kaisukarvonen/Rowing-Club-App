//Requirements/Oberservables
var Observable = require("FuseJS/Observable");
var GeoLocation = require("FuseJS/GeoLocation");
var Storage = require("FuseJS/Storage");

/*var Login = require("Login");
var t_data = new Observable(Login);
console.log(JSON.stringify(t_data.value));*/

var username = Observable();
var password = Observable();
var errorMessage = Observable("errorMessage");
var errorPopup = Observable(false);


//Exportmodules
module.exports = {
        //Navigation
        gotoIndex: function() {router.push("index");},
        gotoAddTrip: function() {router.push("addTrip");},
        gotoSettings: function() {router.push("settings");},
        //gotoLogbook: function() {router.push("logbook");},
        gotoStatistics: function() {router.push("statistics");},
        gotoRanking: function() {router.push("ranking");},
        goBack: function() { router.goBack();},
        detailEntry: function() {router.push("logbookEntry");},
        username: username,
        password: password,
        errorPopup_visible: errorPopup,
        errorMessage: errorMessage,
        login: login,
        //Other functions and variables
        sampleFunction: sampleFunction,
        continuousLocation: continuousLocation,
        startContinuousListener: startContinuousListener,
        stopContinuousListener: stopContinuousListener,
        recordTrip: recordTrip
};




function login() {
	if (inputIsValid(username.value, password.value)) {
		console.log("valid fields"+ username.value + ", "+ password.value);
	} else {
		var user = {username: username.value, password: password.value};
		console.log(user);

		fetch('xxx/login_user.php', {
        method: 'POST',
        headers: { "Content-type": "application/json"},
        body: JSON.stringify(user)
    }).then(function(response) {
    	console.log("Successfull! status: "+ response.status);
    	
	}).then(function(responseObject) {
		console.log(responseObject);
		var success = Storage.writeSync("user_details.json", responseObject);
			if(success) {
			    //router.push("statistics");
			}
			else {
			    errorMessage.value = "Error when logging in, please try again!";
				errorPopup.value = true;
			}
	}).catch(error) {
		console.log(error);
		if (error.status == 401) {
			errorMessage.value = "Username and password do not match!";
			errorPopup.value = true;
		} else {
			errorMessage.value = "Error when logging in, please try again!";
			errorPopup.value = true;
		}
	}
}


function inputIsValid(username, password) {
	if (username == "" || password == "") {
		errorMessage.value = "Please fill out all fields!"
		errorPopup.value = true;
		return false;
	}
	return true;
}

// Start of JavaScript functions (need to be added to module.export to use)
function sampleFunction(){
    console.log("Console Log of the sample function");
}

//Get Location (continous)
var continuousLocation = Observable("");
     GeoLocation.onChanged = function(location) {
        continuousLocation.value = JSON.stringify(location);
};

//Start function for continious location
function startContinuousListener() {
    var intervalMs = 10000;
    var desiredAccuracyInMeters = 10;
    GeoLocation.startListening(intervalMs, desiredAccuracyInMeters);
}

//Stop function for continious location
function stopContinuousListener() {
    GeoLocation.stopListening();
}

//Record trip
function recordTrip() {
    startContinuousListener();
}

//Stop trip-Record and save it
function recordTrip() {
    startContinuousListener();
}