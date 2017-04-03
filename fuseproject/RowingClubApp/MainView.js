//Requirements/Oberservables

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
        sampleFunction: function() {sampleFunction();},
        detailEntry: function() {router.push("logbookEntry");}
};

// Start of JavaScript functions (need to be added to module.export to use)
function sampleFunction(){
    console.log("Console Log of the sample function");
}