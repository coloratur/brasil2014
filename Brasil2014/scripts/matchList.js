(function (global) {
    var MatchListViewModel,
        app = global.app = global.app || {};

    MatchListViewModel = kendo.data.ObservableObject.extend({
       
    });
console.log(global.localStorage);
    app.matchList = {
        viewModel: new MatchListViewModel(),
        init: function(e) {
			
            
        },
        beforeShow: function(e) {
            
			
    	},
        hide: function(e) {
			$('#match-list-listview').remove();
    	},
        show: function(e) {
 		},
        afterShow: function(e) {
            
            $lv = $('<ul id="match-list-listview"></ul>');
            
            $("#match-list .sub-navigation").after($lv);
            
            $lv.kendoMobileListView({
                dataSource: new kendo.data.DataSource({
            					transport: {
            						read: {
                                        url: app.WebServiceURL + "LoadMatchesByStage",
                                        data: { },
                                        type: "POST",
                                        contentType: "application/json",
                                        timeout: 10000,
                                        dataType: "json",
                                        processData: false
                                    },
            						parameterMap: function(data, type) {
            							data.authString = global.localStorage.getItem("authString");
                                        data.sStage = e.view.params.group ? "GROUP" : e.view.params.stage;
            
                                        return JSON.stringify(data);
            						} 
            					},
                        		schema: {
                                	data: function(res) {
                                    	var result = new Array();
                                          	
                                        	for(var i = 0; i < res.LoadMatchesByStageResult.matches.length; i++) {
                                                var match = res.LoadMatchesByStageResult.matches[i];
                                                
                                                if(e.view.params.group && e.view.params.group == match.group) {
                                                	result.push(match);                                    
                                                } else if(e.view.params.group === undefined) {
                                                    result.push(match);
                                                }
                                            }
                                            
                                            return result;
                                    }
            					}
                			}),
                pullToRefresh: true,
                appendOnRefresh: false,
                template: $("#match-list-template").text()
            });
            
            
         	var group = e.view.params.group;
            
            if(group) {
            	$("#match-list .sub-navigation").show();
                this.header.find('[data-role="navbar"]').find('[data-role="view-title"]').html("Gruppe " + group);
            	$("#navi-matches-list").attr("href", "#match-list?group=" + group);
				$("#navi-ranking-list").attr("href", "#group-ranking?group=" + group);
                
                $("#match-list a[data-role='backbutton']").attr("href", "#tabstrip-group");
            } else {
                $("#match-list .sub-navigation").hide();
                
                var stage = "";
                switch(e.view.params.stage){
                    case "ROUND_OF_16": 
                    	stage = "Achtelfinale";
                    	break;
                	case "QUARTER_FINALS": 
                    	stage = "Viertelfinale";
                    	break;
                    case "SEMI_FINALS": 
                    	stage = "Halbfinale";
                    	break;
                    case "THIRD_PLACE": 
                    	stage = "Spiel um Platz 3";
                    	break;
                    case "FINAL": 
                    	stage = "Finale";
                    	break;
                }
                
                this.header.find('[data-role="navbar"]').find('[data-role="view-title"]').html(stage);
                
                $("#match-list a[data-role='backbutton']").attr("href", "#tabstrip-schedule");
            }
            
        },
        saveBet: function(e) {
        	
        	var matchId = $(e.srcElement).data("matchid");
            
            var goals1 = $("#goals-team1-" + matchId).val();
            var goals2 = $("#goals-team2-" + matchId).val();
            
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
        }
    };
    
})(window);