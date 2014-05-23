(function (global) {
    var app = global.app = global.app || {};

    app.home = {
        afterShow: function() {
		
            app.currentUser = undefined;
            //app._onCurrentUserLoaded = undefined;
            app._loadCurrentUser();
            
            app.onCurrentUserLoaded(function() {
               $("#home-score").text("Score " + app.currentUser.score);                
            });
            
            $("#matches-today-open-bets").text("-");
            
            app.WS.invokeRequest(
        		"LoadMatchesByDate", 
        		{ authString: global.localStorage.getItem("authString"), unixTimeStamp: new Date().getTime() + "" }, 
        		"Lade...", 
        		function (res) { 
        			var result = JSON.parse(res);  

        			if(typeof(result.LoadMatchesByDateResult) === "object" && result.LoadMatchesByDateResult.__type === "matchCollection") {
            			
                        var matchesToday = result.LoadMatchesByDateResult.count;
                        var matchesTodayOpen = 0;
                        
                        for(var i = 0; i < result.LoadMatchesByDateResult.matches.length; i++) {
                         	var match = result.LoadMatchesByDateResult.matches[i];
							
                            if(!match.userBet)
                            	matchesTodayOpen++;
                        }
                        
                        if(matchesTodayOpen === 0) {
                            $("#matches-today-open-bets").text("Keine Tipps offen");
                        } else {
                        	$("#matches-today-open-bets").text(matchesTodayOpen + " von " + matchesToday + " Tipps offen");
                        }
        			}
        		},
        		function (xhr) {
        			
        		}
        	);
        },
        show: function() {
            
        }
    };
})(window);