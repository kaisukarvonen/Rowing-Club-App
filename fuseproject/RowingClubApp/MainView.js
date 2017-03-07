//Requirements/Oberservables

//Exportmodules
module.exports = {
        //Navigation
        gotoIndex: function() {router.push("index");},
        gotoPage1: function() {router.push("page1");},
        gotoPage2: function() {router.push("page2");},
        goBack: function() { router.goBack();},
        sampleFunction: function() {sampleFunction();},
};

// Start of JavaScript functions (need to be added to module.export to use)
function sampleFunction(){
    console.log("Console Log of the sample function");
}