(function (global) {
    var MatchListViewModel,
        app = global.app = global.app || {};

    MatchListViewModel = kendo.data.ObservableObject.extend({
       
    });
console.log(global.localStorage);
    app.matchList = {
        viewModel: new MatchListViewModel(),
        refreshItems: function() {
            console.log("refreshItems");
            $("#match-list-listview").data("kendoMobileListView").setDataSource(app.matchList.matches);
            $("#match-list-listview").data("kendoMobileListView").refresh();
            app.matchList.matches.fetch();
        },
        init: function(e) {

        },
        beforeShow: function(e) {

    	},
        show: function(e) {
 		},
        afterShow: function(e) {
         	var group = e.view.params.group;

            this.header.find('[data-role="navbar"]').find('[data-role="view-title"]').html("Gruppe " + group);
            
            $("#navi-matches-list").attr("href", "#match-list?group=" + group);
            $("#navi-ranking-list").attr("href", "#group-ranking?group=" + group);
            
        },
        saveBet: function(e) {
        	
        	var matchId = $(e.srcElement).data("matchid");
            
            var goals1 = $("#goals-team1-" + matchId).val();
            var goals2 = $("#goals-team2-" + matchId).val();
            
            console.log(matchId);
            console.log(goals1);
            console.log(goals2);
            
            app.WS.invokeRequest(
        		"PlaceBet", 
        		{ authString: global.localStorage.getItem("authString"), goals1: goals1, goals2: goals2, matchId: matchId }, 
        		"Tipp abgeben...", 
        		function (res) { 
        			var result = JSON.parse(res);     
        			if(typeof(result.PlaceBetResult) === "object" && result.PlaceBetResult.__type == "bool") {
                        if(result.PlaceBetResult.value) {
        					 
                            var $saved = $("<div style='margin-top: -50px;'></div>");
                            $saved.text("Gespeichert!");
                            
                            $("#game-info-" + matchId).append($saved); 
                            
                            setTimeout(function() { $saved.remove(); }, 2500);
                            
                            return;
                        }
        			}
                    
        		},
        		function (xhr) {        			
        			
        		}
        	);
        },
        matches: new kendo.data.DataSource({
					transport: {
						read: {
                            url: app.WebServiceURL + "LoadMatchesByStage",
                            data: { authString: global.localStorage.getItem("authString"), sStage: "GROUP" },
                            type: "POST",
                            contentType: "application/json",
                            timeout: 10000,
                            dataType: "json",
                            processData: false
                        },
						parameterMap: function(data, type) {
							data.authString = global.localStorage.getItem("authString");
                            return JSON.stringify(data);
						} 
					},
            		schema: {
                    	data: function(res) {
                        	var result = new Array();
                              	
                            	for(var i = 0; i < res.LoadMatchesByStageResult.matches.length; i++) {
                                    var match = res.LoadMatchesByStageResult.matches[i];
                                    
                                    if(app.application.view().params.group && app.application.view().params.group == match.group) {
                                    	result.push(match);                                    
                                    }
                                    console.log(match);
                                }
                                
                                return result;
                        }
					}
		})
    };
    
})(window);