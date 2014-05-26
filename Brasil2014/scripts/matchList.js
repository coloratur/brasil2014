(function (global) {
    var MatchListViewModel,
        app = global.app = global.app || {};

    MatchListViewModel = kendo.data.ObservableObject.extend({
       
    });

    app.matchList = {
        viewModel: new MatchListViewModel(),
        init: function(e) {
            
        },
        beforeShow: function(e) {
			
    	},
        hide: function(e) {
			$('#match-list-listview').data("kendoMobileListView").destroy();
			$('#match-list-listview').remove();
            
            if($("#match-list .no-matches").length) {
                $("#match-list .no-matches").remove();
            }
    	},
        show: function(e) {
        	app.initView(e);
 		},
        afterShow: function(e) {
            
            $lv = $('<ul id="match-list-listview"></ul>');
            
            $("#match-list .sub-navigation").after($lv);
            
            $lv.kendoMobileListView({
                dataSource: new kendo.data.DataSource({
            					transport: {
            						read: {
                                        url: app.WebServiceURL + ( e.view.params.today ? "LoadMatchesByDate" : "LoadMatchesByStage"),
                                        data: { },
                                        type: "POST",
                                        contentType: "application/json",
                                        timeout: 10000,
                                        dataType: "json",
                                        processData: false
                                    },
            						parameterMap: function(data, type) {
            							data.authString = global.localStorage.getItem("authString");
                                        
                                        if(e.view.params.today) {
                                            data.unixTimeStamp = new Date().getTime() + "";
                                        } else {
                                        	data.sStage = e.view.params.group ? "GROUP" : e.view.params.stage;
            							}
                                        return JSON.stringify(data);
            						} 
            					},
                        		schema: {
                                	data: function(res) {
                                    	var result = new Array();
                                          	
                                        	if(e.view.params.today) {
                                                result = res.LoadMatchesByDateResult.matches;
                                                
                                                if(result.length === 0) {
                                                    var $noMatches = $("<div class='no-matches'></div>");
                                                    $noMatches.text("Heute finden keine Spiele statt!");
                                                    
                                                    if($("#match-list .no-matches").length === 0) {
	                                                    $("#match-list .sub-navigation").after($noMatches); 
                                                    }
                                                }
                                            } else {
                                                for(var i = 0; i < res.LoadMatchesByStageResult.matches.length; i++) {
                                                    var match = res.LoadMatchesByStageResult.matches[i];
                                                    
                                                    if(e.view.params.group && e.view.params.group == match.group) {
                                                    	result.push(match);                                    
                                                    } else if(e.view.params.group === undefined) {
                                                        result.push(match);
                                                    }
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
            
            if(e.view.params.today) {
                $("#match-list .sub-navigation").hide();
                this.header.find('[data-role="navbar"]').find('[data-role="view-title"]').html("Spiele heute");
                
                if(e.view.params.fromHome)
                	$("#match-list a[data-role='backbutton']").attr("href", "#tabstrip-home");
                else
                	$("#match-list a[data-role='backbutton']").attr("href", "#tabstrip-schedule");
            } else {
            
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
            }
            
        },
        saveBet: function(e) {
        	
        	var matchId = $(e.srcElement).data("matchid");
            
            var goals1 = parseInt($("#goals-team1-" + matchId).val());
            var goals2 = parseInt($("#goals-team2-" + matchId).val());
            
            if(!isPositiveInteger(goals1) || !isPositiveInteger(goals2) || goals1 > 99 || goals2 > 99) {
                showAlert("Keine gültige Zahl");
                return;
            }
            
            app.WS.invokeRequest(
        		"PlaceBet", 
        		{ authString: global.localStorage.getItem("authString"), goals1: goals1, goals2: goals2, matchId: matchId }, 
        		"Tipp abgeben...", 
        		function (res) { 
        			var result = JSON.parse(res);     
        			if(typeof(result.PlaceBetResult) === "object" && result.PlaceBetResult.__type == "bool") {
                        if(result.PlaceBetResult.value) {
        					
                            if($("#game-info-" + matchId + " .saved-label").length === 0) {
                                var $saved = $("<div class='saved-label'></div>");
                                $saved.text("Gespeichert!");
                                
                                $("#game-info-" + matchId).append($saved); 
                                
                                setTimeout(function() { 
                                    if($saved && $saved.length) {
                                    	$saved.remove();
                                    }
                                }, 2500);
                            }
                            
                            return;
                        }
        			}
                    
                    showAlert("Es ist ein Fehler aufgetreten.");
        		},
        		function (xhr) {        			
                    showAlert("Es ist ein Fehler aufgetreten.");
        		}
        	);
        }
    };
    
})(window);