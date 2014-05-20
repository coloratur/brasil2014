// global functions
function hasNetworkConnection() { return true; };
function showAlert(title, text) { alert(title + "\r\n" + text); };

(function (global) {
    var app = global.app = global.app || {};

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
        
        app.WS = new WebService("http://wm2014.coloratur.com/Service.svc/");
        
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
            if(window.localStorage.getItem("authString")) {
    	    	app.WS.invokeRequest(
            		"LoadUserPrivate", 
            		{ authString: window.localStorage.getItem("authString") }, 
            		"Lade...", 
            		function (res) { 
            			var result = JSON.parse(res);  

            			if(typeof(result.LoadUserPrivateResult) === "object" && result.LoadUserPrivateResult.__type === "userPrivate") {
            				user = result.LoadUserPrivateResult;
                            app.currentUser = user;
                            
                            app.currentUserLoaded();
                            
                            app.application.navigate("#tabstrip-home", "slide");
            			}
            		},
            		function (xhr) {
            			
            		}
            	);
    		}
        }
    }, false);

})(window);