(function (global) {
    var LoginViewModel,
        app = global.app = global.app || {};

    LoginViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        username: "",
        password: "",

        onLogin: function () {
            var that = this,
                username = that.get("username").trim(),
                password = that.get("password").trim();

            if (username === "" || password === "") {
                navigator.notification.alert("Beide Felder müssen ausgefüllt werden!",
                    function () { }, "Login falsch!", 'OK');

                return;
            }

            // User wants to login, check provided credentials
			// Save an authstring on local storage if authentication was successful
        	WS.invokeRequest(
        		"AuthenticateUser", 
        		{ user: username, password: password }, 
        		"Anmelden...", 
        		function (res) { 
        			var result = JSON.parse(res);     
        			if(typeof(result.AuthenticateUserResult) === "object" && result.AuthenticateUserResult.__type == "userCredentials") {
        				window.localStorage.setItem("authString", result.AuthenticateUserResult.authString);
        				window.localStorage.setItem("user", username);
        				
        				app.application.navigate("#tabstrip-home", "slide"); 
        			} else {
        				window.localStorage.removeItem("authString");
        				showAlert("Login fehlgeschlagen!", "Sie konnten mit der angegebenen Kombination aus Benutzername und Passwort nicht angemeldet werden. Bitte überprüfen Sie Ihre Daten.");
        			}
        		},
        		function (xhr) {
        			window.localStorage.removeItem("authString");
        			showAlert("Login fehlgeschlagen!", "Sie konnten mit der angegebenen Kombination aus Benutzername und Passwort nicht angemeldet werden. Bitte überprüfen Sie Ihre Daten.");
        			if (xhr.responseText) {
        		  	var err = JSON.parse(xhr.responseText);
        		   }
        		}
        	);
            
            //that.set("isLoggedIn", true);
            //app.application.navigate("#tabstrip-home", "slide"); 
        },

        onLogout: function () {
            var that = this;

            that.clearForm();
            that.set("isLoggedIn", false);
        },

        clearForm: function () {
            var that = this;

            that.set("username", "");
            that.set("password", "");
        },

        checkEnter: function (e) {
            var that = this;

            if (e.keyCode == 13) {
                $(e.target).blur();
                that.onLogin();
            }
        }
    });

    app.loginService = {
        viewModel: new LoginViewModel()
    };
})(window);