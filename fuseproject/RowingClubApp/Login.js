var Observable = require("FuseJS/Observable");

var username = Observable("username");
var password = Observable("password");
var errorMessage = Observable("errorMessage");
var errorPopup = Observable(false);


function login() {
	if (inputIsValid(username.value, password.value)) {
		console.log("valid fields"+ username.value + ", "+ password.value);
	}
}


function inputIsValid(username, password) {
	if (username.isEmpty() || password.isEmpty()) {
		errorMessage.value = "Please fill out all fields!"
		errorPopup.value = true;
		return false;
	}
	return true;
}


module.exports = {
        username: username,
        password: password,
        errorPopup_visible: errorPopup,
        errorMessage: errorMessage,
        login: function() {
        	console.log("login button");
        }

    };