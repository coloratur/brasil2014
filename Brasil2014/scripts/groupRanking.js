(function (global) {
    var GroupRankingViewModel,
        app = global.app = global.app || {};

    GroupRankingViewModel = kendo.data.ObservableObject.extend({
       
    });

    app.groupRanking = {
        viewModel: new GroupRankingViewModel(),
        refreshItems: function() {
            console.log("refreshItems");
            $("#group-ranking-listview").data("kendoMobileListView").setDataSource(app.groupRanking.teams);
            $("#group-ranking-listview").data("kendoMobileListView").refresh();
            app.groupRanking.teams.fetch();
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
            
            $("#navi-matches").attr("href", "#match-list?group=" + group);
            $("#navi-ranking").attr("href", "#group-ranking?group=" + group);
            
        },
        teams: new kendo.data.DataSource({
					transport: {
						read: {
                            url: app.WebServiceURL + "LoadTeams",
                            data: { authString: global.localStorage.getItem("authString") },
                            type: "POST",
                            contentType: "application/json",
                            timeout: 10000,
                            dataType: "json",
                            processData: false
                        },
						parameterMap: function(data, type) {
							data.authString = global.localStorage.getItem("authString");
                            console.log(global.localStorage.getItem("authString"));
                            console.log(data);
							return JSON.stringify(data);
						} 
					},
            		schema: {
                    	data: function(res) {
                        	var result = new Array();
                              	
                            	for(var i = 0; i < res.LoadTeamsResult.teams.length; i++) {
                                    var team = res.LoadTeamsResult.teams[i];
                                    console.log(app.application.view().params.group);
                                    if(team.group === app.application.view().params.group) {
                                    	result.push(team);
                                    }
                                }
                                
                                return result;
                        }
					}
		})
    };
    
})(window);