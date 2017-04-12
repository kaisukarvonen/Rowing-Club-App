//Requirements/Oberservables
var Observable = require("FuseJS/Observable");
var GeoLocation = require("FuseJS/GeoLocation");


//Exportmodules
module.exports = {
        //Navigation
        gotoIndex: function() {router.push("index");},
        gotoAddTrip: function() {router.push("addTrip");},
        gotoSettings: function() {router.push("settings");},
        gotoLogbook: function() {router.push("logbook");},
        gotoStatistics: function() {router.push("statistics");},
        gotoRanking: function() {router.push("ranking");},
        goBack: function() { router.goBack();},
        detailEntry: function() {router.push("logbookEntry");},
        //Other functions and variables
        sampleFunction: sampleFunction,
        continuousLocation: continuousLocation,
        startContinuousListener: startContinuousListener,
        stopContinuousListener: stopContinuousListener,
        recordTrip: recordTrip
};

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