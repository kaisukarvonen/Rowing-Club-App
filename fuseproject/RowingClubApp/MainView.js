//Requirements/Oberservables
var Observable = require("FuseJS/Observable");
var GeoLocation = require("FuseJS/GeoLocation");
var Storage = require("FuseJS/Storage");

/*var Login = require("Login");
var t_data = new Observable(Login);
console.log(JSON.stringify(t_data.value));*/

var currentLatitude = Observable();
var currentLongitude = Observable();
var immediateLocation = Observable("now location");
var continuousLocation = Observable();
var username = Observable();
var password = Observable();
var errorMessage = Observable("errorMessage");
var errorPopup = Observable(false);
var currentDate = Observable();
var boatSelectionIsOpen = Observable(false);
var boatOptions = Observable();
var selectedBoat = Observable("Choose boat");
var participantSelectionIsOpen = Observable(false);
var selectedParticipant = Observable("Choose participants");
var participantOptions = Observable();
var participantArray = Observable();
var chosenBoatFormatted = Observable({name: 0, capacity: 0});


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
        boatSelectionIsOpen: boatSelectionIsOpen,
        openBoatSelection: openBoatSelection,
        selectedBoat: selectedBoat,
        boatOptions: boatOptions.map(function(option) {
        		return {
        			boatName: option.name + " (fits "+option.capacity+")",
	        		boatNameClicked: function() {
	        			selectedBoat.value = "Boat: "+option.name + " (fits "+option.capacity+")";
	        			boatSelectionIsOpen.value = false;
	        			chosenBoatFormatted.replaceAt(0, {name: option.name, capacity: option.capacity});
        		}
        	}
        }),


        openParticipantSelection: openParticipantSelection,
        participantSelectionIsOpen: participantSelectionIsOpen,
        selectedParticipant: selectedParticipant,
        participantOptions: participantOptions.map(function(option) {
        		return {
        			participantName: option,
	        		participantNameClicked: function() {
	        			selectedParticipant.value = option;
	        			
	        			if (!participantArray.contains(option) && chosenBoatFormatted.getAt(0).capacity > participantArray.length) {
	        				participantOptions.replaceAt(participantOptions.indexOf(option), "✓ "+option);
	        				
	        				participantArray.add("✓ "+option);
	        			} else if (participantArray.contains(option) && chosenBoatFormatted.getAt(0).capacity >= participantArray.length) {
		        				participantOptions.replaceAt(participantOptions.indexOf(option), option.substring(2));
		        				participantArray.remove(option);
		        			
	        			}


	        			if (participantArray.length > 1) {
	        				selectedParticipant.value = participantArray.length + " participants";
	        			} else if (participantArray.length === 0) {
	        				selectedParticipant.value = "Choose participants";
	        			} else {
	        				selectedParticipant.value = "1 participant";
	        			}
	        			
	        			
        		}
        	}
        }),
      
      	currentLatitude: currentLatitude,
      	currentLongitude: currentLongitude, 
        continuousLocation: continuousLocation,
        startContinuousListener: startContinuousListener,
        stopContinuousListener: stopContinuousListener,
        immediateLocation: immediateLocation,
        recordTrip: recordTrip
};

function openParticipantSelection() {
	participantSelectionIsOpen.value = !participantSelectionIsOpen.value;
}


function openBoatSelection() {
	boatSelectionIsOpen.value = !boatSelectionIsOpen.value;
}


function onAddTripPage() {
	showCurrentDateonAddTrip(currentDate);
}

function showAddTrip() {


		var parsedDetails = getUserDetails("user_details.json");
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
				//
				if (Storage.writeSync("all_users.json", JSON.stringify(responseObject.Users)) &&
				Storage.writeSync("all_boats.json", JSON.stringify(responseObject.Boats))) {
					console.log("write to file successfull");
				}
				addOptionsToBoatDropDownList(responseObject.Boats, boatOptions);
				addOptionsToParticipantDropDownList(responseObject.Users, participantOptions);

		})
}

function getUserDetails(file) {
	var getUserDetailsJson = Storage.readSync(file);
	if (getUserDetailsJson) {
		var parsedDetails = JSON.parse(getUserDetailsJson);
		return parsedDetails;
	}
}

function addOptionsToBoatDropDownList(array, optionsObject) {
	if (array.length !== optionsObject.length) {
		optionsObject.clear();
		for(var i=0; i<array.length; i++) {
			optionsObject.add({name: array[i].name, capacity: array[i].capacity});
		}
	}
	//console.log(optionsObject.getAt(0).capacity);
}


function addOptionsToParticipantDropDownList(array, optionsObject) {
	var parsedDetails = getUserDetails("user_details.json");
	for(var i=0; i<array.length; i++) {
		if (!optionsObject.contains(array[i].username) && array[i].username !== parsedDetails.username) {
			optionsObject.add(array[i].firstname + " " + array[i].lastname);
		}
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
		errorMessage.value = "Please fill out all fields!";
		errorPopup.value = true;
		return false;
	}
	return true;
}


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
    router.push("showCurrentTrip");
    
	GeoLocation.on("changed", function(location) {
		currentLatitude.value = location.latitude;
		currentLongitude.value = location.longitude;
	});


    console.log(chosenBoatFormatted.getAt(0).name);
    participantArray.forEach(function(name,index) {
    	participantArray.replaceAt(index, name.substring(2));
    });
	participantArray.forEach(function(name,index) {
    	console.log(name);
    });


}
