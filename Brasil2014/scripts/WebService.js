var WebService = function WebService(url)
{
	this.url = url;
	
	this.invokeRequest = function(method, data, loadingMessage, successCallback, errorCallback) {
		
		if(!hasNetworkConnection()) {
			showAlert("Keine Internetverbindung!", "Bitte stellen Sie eine Internetverbindung her, um auf das Tippspiel zugreifen zu können.");
		}
		else
		{
     		$.ajax( { 
                url: url + method,
                data: JSON.stringify(data),
                type: "POST",
                contentType: "application/json",
                timeout: 10000,
                dataType: "text",  // not "json" we'll parse 
                success: 
                function(res) 
                {
                	successCallback(res);
                },
                error:  function(xhr) {
                	errorCallback(xhr);
                }
            });
		}
		
	};
}

var WS = new WebService("http://wm2014.coloratur.com/Service.svc/");