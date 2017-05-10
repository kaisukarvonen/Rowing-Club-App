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
var currentDate = Observable();


//Exportmodules
module.exports = {
        //Navigation
        gotoIndex: function() {router.push("index");},
        gotoAddTrip: function() {
        	router.push("addTrip");
        	showAddTrip();
        },
        gotoSettings: function() {router.push("settings");},
        gotoLogbook: function() {router.push("logbook");},
        gotoStatistics: function() {router.push("statistics");},
        gotoRanking: function() {router.push("ranking");},
        goBack: function() { router.goBack();},
        detailEntry: function() {router.push("logbookEntry");},
        username: username,
        password: password,
        errorPopup_visible: errorPopup,
        errorMessage: errorMessage,
        login: login,
        currentDate: currentDate,
        addTripPageActivated: onAddTripPage,
        //Other functions and variables
        sampleFunction: sampleFunction,
        continuousLocation: continuousLocation,
        startContinuousListener: startContinuousListener,
        stopContinuousListener: stopContinuousListener,
        recordTrip: recordTrip
};

function onAddTripPage() {
	showCurrentDateonAddTrip(currentDate);
}

function showAddTrip() {

	var getUserDetailsJson = Storage.readSync("user_details.json");
	if (getUserDetailsJson) {
		var parsedDetails = JSON.parse(getUserDetailsJson);
		console.log("club_id: "+parsedDetails.club_id+"\nusername: "+parsedDetails.username);

		fetch('http://www.scoctail.com/rowing_club/show_add_trip.php?clubId='+parsedDetails.club_id, {
	        method: 'GET'
		})
			.then(function(response) {
				status = response.status; 
				console.log(status);
				if (!response.ok) {
					console.log("error");
				}
				return response.json();
		})
			.then(function(responseObject) {
				//console.log(JSON.stringify(responseObject.Boats));
				if (Storage.writeSync("all_users.json", JSON.stringify(responseObject.Users)) &&
				Storage.writeSync("all_boats.json", JSON.stringify(responseObject.Boats))) {
					console.log("write to file successfull");
				}

		})
	} else {
		console.log("Error getting user details from file");
	}
}




function showCurrentDateonAddTrip(object) {
	var date = new Date();
	var dateString = date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear();
	object.value = dateString;
}



function login() {
	if (inputIsValid(username.value, password.value)) {
			var user = {"username": username.value, "password": password.value};
			console.log("username: "+user.username + " password: "+user.password);
			errorPopup.value = false;
			var jsonUser = JSON.stringify(user);

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
				console.log("club_id:"+responseObject.club_id + ", username: "+responseObject.username);
				var saveUserDetails = Storage.writeSync("user_details.json", JSON.stringify(responseObject));
				if(saveUserDetails) {
					console.log("saved");
					//gotoStatistics(); //this does not work ??
					router.push("statistics");
				} else {
					console.log("saveUserDetails error");
					errorMessage.value = "Error when logging in, please try again!";
					errorPopup.value = true;
				}
				
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