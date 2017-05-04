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
			var user = {"username": username.value, "password": password.value};
			console.log("username: "+user.username + " password: "+user.password);
			errorPopup.value = false;
			var jsonUser = JSON.stringify(user);

			/*var xhr = new XMLHttpRequest();
			var params = "username=x";
			xhr.open("POST", "http://www.scoctail.com/rowing_club/login_user.php" , true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.onreadystatechange = function() {
			  if (xhr.readyState == 4) {
			    // JSON.parse does not evaluate the attacker's scripts.
			    var resp = JSON.parse(xhr.responseText);
			    //console.log(resp.status);
			  }
			}
			xhr.send(params);*/


			fetch('http://www.scoctail.com/rowing_club/login_user.php?user='+username.value+
				'&pw='+password.value, {
	        method: 'GET'
	    })
			.then(function(response) {
			    status = response.status;  // Get the HTTP status code
			    console.log(status);
			    
			    if (!response.ok) {
			    	if (status == 401) {
					errorMessage.value = "Username and password do not match!";
					errorPopup.value = true;
					} else {
						errorMessage.value = "Error when logging in, please try again!";
						errorPopup.value = true;
					}
			    }
			    return response.json();    // This returns a promise
		})
			.then(function(responseObject) {
			console.log("object:"+responseObject);
			//var writeToFile = Storage.writeSync("user_details.json", responseObject);
			/*	if(writeToFile) {
				    //go to statistics page
				}
				else {
					console.log("writeToFile error");
				    errorMessage.value = "Error when logging in, please try again!";
					errorPopup.value = true;
				}
			*/
		
		})
	}
}


function inputIsValid(username, password) {
	if (!username || !password) {
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