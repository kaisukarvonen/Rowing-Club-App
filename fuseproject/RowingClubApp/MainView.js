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
var boatSelectionIsOpen = Observable(false);
var boatOptions = Observable();
var selectedBoat = Observable();
var participantSelectionIsOpen = Observable(false);
var selectedParticipant = Observable();
var participantOptions = Observable();
var participantArray = Observable();
var chosenBoatFormatted = Observable({id: 0, name: 0, capacity: 0});
var dateInput = Observable();
var pastTripActive = Observable(false);
var dateValue = Observable();
var kilometerValue = Observable();
var trips = Observable();

var chosenParticipantsFormatted = Observable();

var participantIds = [];


//Exportmodules
module.exports = {
        //Navigation
        gotoIndex: function() {router.push("index");},
        gotoAddTrip: function() {
        	router.push("addTrip");
        	showAddTrip();
        	
        },
        gotoSettings: function() {router.push("settings");},
        gotoLogbook: function() {
        	router.push("logbook");
        	showLogbook();

        },
        gotoStatistics: function() {router.push("statistics");},
        gotoRanking: function() {router.push("ranking");},
        goBack: function() { router.goBack();},
        detailEntry: function() {router.push("logbookEntry");},
        username: username,
        password: password,
        errorPopup_visible: errorPopup,
        errorMessage: errorMessage,
        login: login,

        dateInput: dateInput,
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
	        			chosenBoatFormatted.replaceAt(0, {id: option.id, name: option.name, capacity: option.capacity});
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
	        			
	        			if (!participantArray.contains(option) && chosenBoatFormatted.getAt(0).capacity-1 > participantArray.length) {
	        				participantOptions.replaceAt(participantOptions.indexOf(option), "✓ "+option);
	        				
	        				participantArray.add("✓ "+option);
	        			} else if (participantArray.contains(option) && chosenBoatFormatted.getAt(0).capacity-1 >= participantArray.length) {
		        				participantOptions.replaceAt(participantOptions.indexOf(option), option.substring(2));
		        				participantArray.remove(option);
		        			
	        			}


	        			if (participantArray.length > 1) {
	        				selectedParticipant.value = participantArray.length + " participants + you";
	        			} else if (participantArray.length === 0) {
	        				selectedParticipant.value = "Choose participants";
	        			} else {
	        				selectedParticipant.value = "1 participant + you";
	        			}
	        			
	        			
        		}
        	}
        }),

        trips: trips.map(function(trip) {
        	return {
        		id: trip.id,
        		km: trip.km,
        		date: trip.date,
        		boatName: trip.boatName
        		//boatName: boat_name
        	}
        }),
      	
      	kilometerValue: kilometerValue,
      	dateValue: dateValue,
      	pastTripActive: pastTripActive,
      	currentLatitude: currentLatitude,
      	currentLongitude: currentLongitude, 
        continuousLocation: continuousLocation,
        startContinuousListener: startContinuousListener,
        stopContinuousListener: stopContinuousListener,
        immediateLocation: immediateLocation,
        recordTrip: recordTrip,

};


function openParticipantSelection() {
	participantSelectionIsOpen.value = !participantSelectionIsOpen.value;
}


function openBoatSelection() {
	boatSelectionIsOpen.value = !boatSelectionIsOpen.value;
}

function onAddTripPage() {
		showCurrentDateonAddTrip(dateInput);
	
}

function showLogbook() {
	var parsedDetails = getUserDetails("user_details.json");

	fetch('http://www.scoctail.com/rowing_club/show_logbook.php?userId='+parsedDetails.id, {
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
				trips.clear();

				for(var i=0; i<responseObject.Trips.length; i++) {
					trips.add({id: responseObject.Trips[i].id, km: responseObject.Trips[i].km, date: responseObject.Trips[i].date,
						boatName: responseObject.Trips[i].boat_name});
				}


		})
}


function showAddTrip() {
		participantArray.clear();
		selectedParticipant.value = "Choose participants";
		selectedBoat.value = "Choose boat";

		var parsedDetails = getUserDetails("user_details.json");
		console.log("club_id: "+parsedDetails.club_id+"\nusername: "+parsedDetails.username);
		participantIds.push(parsedDetails.id);

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
	optionsObject.clear();
		for(var i=0; i<array.length; i++) {
			optionsObject.add({id: array[i].id, name: array[i].name, capacity: array[i].capacity});
		}
}


function addOptionsToParticipantDropDownList(array, optionsObject) {
	optionsObject.clear();
	chosenParticipantsFormatted.clear();
	var parsedDetails = getUserDetails("user_details.json");
	for(var i=0; i<array.length; i++) {
		if (array[i].username !== parsedDetails.username) {
			optionsObject.add(array[i].firstname + " " + array[i].lastname);
			chosenParticipantsFormatted.add({id: array[i].id, name: array[i].firstname + " " + array[i].lastname});
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


var coordinates = [];

//Stop function for continious location
function stopContinuousListener() {
    GeoLocation.stopListening();

    var boatId = chosenBoatFormatted.getAt(0).id;
	
	var totalKm = calculateTotalDistance(coordinates);
	var fixedKm = totalKm.toFixed(1);
	console.log("total: "+totalKm);
    var coordinatesString = JSON.stringify(coordinates);
    var idString = JSON.stringify(participantIds);  
    console.log(coordinatesString);
    console.log(idString);

    
    fetch('http://www.scoctail.com/rowing_club/add_new_trip.php?boatId='+boatId+
			'&coordinates='+coordinatesString+'&km='+fixedKm+'&participants='+idString, {
	        method: 'GET'
		})
			.then(function(response) {
				status = response.status; 
				console.log(status);
				if (!response.ok) {
					if (status == 400) {
						console.log("trip already added");
					} else {
						console.log("error");
					}
				} else {
					gotoStatistics();
				}
				return response.json();
		})


}



//Record trip
function recordTrip() {
	console.log(pastTripActive.value);
    createParticipantIdList(participantArray, participantIds);
	if (chosenBoatFormatted.getAt(0).id != 0 && participantIds.length > 1) {
		if (pastTripActive.value == true) {
			//savePastTrip();
			console.log("past");
		} else if (pastTripActive.value == false) {
			console.log("new");
			router.push("showCurrentTrip");
			coordinates = [];
	    	startContinuousListener();
	    }
	} else {
		//show alert box
	}
}

GeoLocation.on("changed", function(location) {
		currentLatitude.value = location.latitude;
		currentLongitude.value = location.longitude;
		coordinates.push({lat: location.latitude, lon: location.longitude});

});

function savePastTrip() {
	var date = dateValue.value; //format yyyy-mm-dd
	var kms = kilometerValue.value;
	var boatId = chosenBoatFormatted.getAt(0).id;
	var idString = JSON.stringify(participantIds);
	console.log(idString);

	fetch('http://www.scoctail.com/rowing_club/add_past_trip.php?boatId='+boatId+
			'&km='+kms+'&participants='+idString+'&date='+date, {
	        method: 'GET'
		})
			.then(function(response) {
				status = response.status; 
				console.log(status);
				if (!response.ok) {
					if (status == 400) {
						console.log("trip already added");
					} else {
						//error adding to database
						console.log("error");
					}
				}
				return response.json();
		})
	
}


function calculateTotalDistance(array) {
	var totalKm = 0;
	for (var i=0; i < array.length-1; i++) {
		var km = distanceBetweenTwoPoints(array[i].lat, array[i].lon,
		array[i+1].lat, array[i+1].lon);
		totalKm+= km;
	}
	return totalKm;
}

function distanceBetweenTwoPoints(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

function createParticipantIdList(originalArray) {
	clearedArray = [];
	clearedArray.push(participantIds[0]);
	participantIds = clearedArray;
	originalArray.forEach(function(name,index) {
   		originalArray.replaceAt(index, name.substring(2));
    });
	originalArray.forEach(function(name,index) {
    	for(var i=0; i < chosenParticipantsFormatted.length; i++) {
    		
    		if (chosenParticipantsFormatted.getAt(i).name === name) {
    			participantIds.push(chosenParticipantsFormatted.getAt(i).id);
    			//console.log(chosenParticipantsFormatted.getAt(i).id);
    		}
    	}
    });


}
