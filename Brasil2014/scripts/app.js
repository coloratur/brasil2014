// global functions
function hasNetworkConnection() { return true; };
function showAlert(title, text) { alert(title + "\r\n" + text); };

function imageExists(image_url){

    var http = new XMLHttpRequest();

    http.open('HEAD', image_url, false);
    http.send();

    return http.status != 404;
}

(function (global) {
    var app = global.app = global.app || {};

    //app.WebServiceURL = "http://wm2014.coloratur.com/Service.svc/";
    app.WebServiceURL = "http://jarjarbinks.dev.webservice.wc2014.de/Service.svc/";
    
    app.requestPwReset = function () {
    	app.WS.invokeRequest(
    		"RequestPasswordReset", 
    		{ userIdOrEmail: $("#tbUserIdOrEmail").val() }, 
    		"Lade...", 
    		function (res) { 
    			var result = JSON.parse(res);  

    			if(typeof(result.RequestPasswordResetResult) === "object" && result.RequestPasswordResetResult.__type === "bool") {    				
					console.log(result.RequestPasswordResetResult.value);
                    if(result.RequestPasswordResetResult.value) {
                        showAlert("Wir haben Ihnen eine E-Mail mit Anweisungen zum Zurücksetzen Ihres Passworts zugesendet.");
                        
                        app.application.navigate("#tabstrip-login", "slide");
                    } else {   
						showAlert("Es ist ein unerwarteter Fehler aufgetreten.");
                    }
    			} else if(typeof(result.RequestPasswordResetResult) === "object" && result.RequestPasswordResetResult.__type === "exception") {
					if(result.RequestPasswordResetResult.type === "USER_NOT_FOUND")
                    	showAlert("Der angegebene Benutzer wurde nicht gefunden.");
                }                    
    		},
    		function (xhr) {
					showAlert("Es ist ein unerwarteter Fehler aufgetreten.");
    		}
    	);
    };
    
    app.logout = function() {
        global.localStorage.removeItem("user");
        global.localStorage.removeItem("authString");
        
        $("#tbUsername").val("");
        $("#tbPassword").val("");
        
		app.application.navigate("#tabstrip-login", "slide");     
    };
    
    app.openPrices = function () {
        window.open(app.currentUser.userTenant.registrationUrl + "preise.pdf", "_blank");
    };
        
    
    function WebService(url) {
    	this.url = url;
    	
    	this.invokeRequest = function(method, data, loadingMessage, successCallback, errorCallback) {
    		
    		if(!hasNetworkConnection()) {
    			showAlert("Keine Internetverbindung!", "Bitte stellen Sie eine Internetverbindung her, um auf das Tippspiel zugreifen zu können.");
    		} else {
                app.application.showLoading();
                
         		$.ajax( { 
                    url: url + method,
                    data: JSON.stringify(data),
                    type: "POST",
                    contentType: "application/json",
                    timeout: 10000,
                    dataType: "text",  // not "json" we'll parse 
                    success: 
                    function(res) {
                        app.application.hideLoading();
                    	successCallback(res);
                    },
                    error:  function(xhr) {
                        app.application.hideLoading();
                    	errorCallback(xhr);
                    }
                });
    		}
    	};
    }    
    
    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
        StatusBar.hide();
        
        // some global native functions
		hasNetworkConnection = function () {
			return navigator.connection.type  != Connection.NONE;
		}
		
		showAlert = function (title, text) {
			navigator.notification.alert(text, function () { }, title, "OK");
		}
        
        app.application = new kendo.mobile.Application(document.body, { skin: "flat" });
        
        app.WS = new WebService(app.WebServiceURL);
        
        app._onCurrentUserLoaded = new Array();
        app.onCurrentUserLoaded = function(func) {
            if(app.currentUser) {
                func();
            } else {
                app._onCurrentUserLoaded.push(func);
            }
        };
        
        app.currentUserLoaded = function() {
            for(var i = 0; i < app._onCurrentUserLoaded.length; i++) {
                app._onCurrentUserLoaded[i]();
            }
        };
        
        app._loadCurrentUser = function() {
            if(global.localStorage.getItem("authString")) {
    	    	app.WS.invokeRequest(
            		"LoadUserPrivate", 
            		{ authString: global.localStorage.getItem("authString") }, 
            		"Lade...", 
            		function (res) { 
            			var result = JSON.parse(res);  

            			if(typeof(result.LoadUserPrivateResult) === "object" && result.LoadUserPrivateResult.__type === "userPrivate") {
            				user = result.LoadUserPrivateResult;
                            app.currentUser = user;
              
                            global.localStorage.setItem("tenantColour", user.userTenant.colour);
                            
                            app.currentUserLoaded();
                            
                            app.application.navigate("#tabstrip-home", "slide");
                            
                            $("#home-score").text("Score " + app.currentUser.score); 
                            $("#home-userId").text(app.currentUser.id);

                            var imgUrl = app.ranking.getUserImage(app.currentUser.id);

                            if(imgUrl) {
                            	$("#user-image").css("background-image", "url(" + imgUrl + ")");
                            }
            			}
            		},
            		function (xhr) {
            			
            		}
            	);
    		}
        }
        
        app._loadCurrentUser();
        
    }, false);

})(window);