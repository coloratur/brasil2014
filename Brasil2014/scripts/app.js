// global functions
function hasNetworkConnection() { return true; };
function showAlert(title, text) { alert(title + "\r\n" + text); };

(function (global) {
    var app = global.app = global.app || {};

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

        app.currentUser = function(){
        	var user = undefined;
    		
            if(window.localStorage.getItem("authString")) {
    	    	WS.invokeRequest(
            		"LoadUserPrivate", 
            		{ authString: window.localStorage.getItem("authString") }, 
            		"Lade...", 
            		function (res) { 
            			var result = JSON.parse(res);     
            			if(typeof(result.LoadUserPrivateResult) === "object" && result.LoadUserPrivateResult.__type == "userPrivate") {
            				user = result.LoadUserPrivateResult;
            			}
            		},
            		function (xhr) {
            			
            		}
            	);
    		}
            
    		return user;
        }();
        
    }, false);
})(window);