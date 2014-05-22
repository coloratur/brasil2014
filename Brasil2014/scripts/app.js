// global functions
function hasNetworkConnection() { return true; };
function showAlert(title, text) { alert(title + "\r\n" + text); };

(function (global) {
    var app = global.app = global.app || {};

    app.WebServiceURL = "http://wm2014.coloratur.com/Service.svc/";
    //app.WebServiceURL = "http://jarjarbinks.dev.webservice.wc2014.de/Service.svc/";
    
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
        
        app.logout = function() {
            global.localStorage.removeItem("user");
            global.localStorage.removeItem("authString");
            
			app.application.navigate("#tabstrip-login", "slide");     
        };
        
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
                            
                            var imageUrl = user.userTenant.registrationUrl + "user_images/" + user.id + ".jpg";
                            
                            $.get(imageUrl).fail(
                                function() { 
                        			imageUrl = user.userTenant.registrationUrl + "user_images/" + user.id + ".png";
                                    
                                    $.get(imageUrl).fail(
                                        function() { 
                                			imageUrl = undefined;
                                		}
                                    );
                        		}
                            );
                            
                            if(imageUrl) {
                                $("#user-image").css("background-image", "url(" + imageUrl + ")");
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