(function (global) {
    var LoginViewModel,
        app = global.app = global.app || {};

    LoginViewModel = kendo.data.ObservableObject.extend({
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
        	app.WS.invokeRequest(
        		"AuthenticateUser", 
        		{ user: username, password: password }, 
        		"Anmelden...", 
        		function (res) { 
        			var result = JSON.parse(res);     
        			if(typeof(result.AuthenticateUserResult) === "object" && result.AuthenticateUserResult.__type == "userCredentials") {
        				global.localStorage.setItem("authString", result.AuthenticateUserResult.authString);
        				global.localStorage.setItem("user", username);
                        
                        app._loadCurrentUser();
        				
        				//app.application.navigate("#tabstrip-home", "slide"); 
                        
                        app.WS.invokeRequest(
                    		"LoadTenants", 
                    		undefined, 
                    		"Anmelden...", 
                    		function (res) { 
                    			var result = JSON.parse(res);   
                                
                    			if(typeof(result.LoadTenantsResult) === "object" && result.LoadTenantsResult.__type == "tenantCollection") {
                    				
                                	app.onCurrentUserLoaded(function() {
                                    	    
                                   	for(var i = 0; i < result.LoadTenantsResult.tenant.length; i++) {
                                           var tenant = result.LoadTenantsResult.tenant[i];
                                           
                                           if(tenant.id == app.currentUser.tenantId) {
                                               global.localStorage.setItem("tenantColour", tenant.colour);
                                               
                                               app.application.navigate("#tabstrip-home", "slide"); 
                                               
                                               break;
                                           }
                                       }
                                        
                                    });
                                    
                    				
                    			} else {
                    				showAlert("Login fehlgeschlagen!", "Sie konnten mit der angegebenen Kombination aus Benutzername und Passwort nicht angemeldet werden. Bitte überprüfen Sie Ihre Daten.");
                    			}
                    		},
                    		function (xhr) {
                    			showAlert("Login fehlgeschlagen!", "Sie konnten mit der angegebenen Kombination aus Benutzername und Passwort nicht angemeldet werden. Bitte überprüfen Sie Ihre Daten.");
                    		}
                    	);
                        
        			} else {
        				global.localStorage.removeItem("authString");
        				showAlert("Login fehlgeschlagen!", "Sie konnten mit der angegebenen Kombination aus Benutzername und Passwort nicht angemeldet werden. Bitte überprüfen Sie Ihre Daten.");
        			}
        		},
        		function (xhr) {
        			global.localStorage.removeItem("authString");
        			showAlert("Login fehlgeschlagen!", "Sie konnten mit der angegebenen Kombination aus Benutzername und Passwort nicht angemeldet werden. Bitte überprüfen Sie Ihre Daten.");
        			if (xhr.responseText) {
        		  	var err = JSON.parse(xhr.responseText);
        		   }
        		}
        	);
        },

        onLogout: function () {
            var that = this;

            that.clearForm();
            
            global.localStorage.removeItem("authString");
			global.localStorage.removeItem("user");
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