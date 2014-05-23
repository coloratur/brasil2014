(function (global) {
    var GroupRankingViewModel,
        app = global.app = global.app || {};

    GroupRankingViewModel = kendo.data.ObservableObject.extend({
       
    });

    app.groupRanking = {
        viewModel: new GroupRankingViewModel(),
        init: function(e) {

        },
        beforeShow: function(e) {

    	},
        show: function(e) {
			app.changeClientColor(app.currentUser.userTenant.colour); 
 		},
        hide: function(e) {
			$('#group-ranking-listview').data("kendoMobileListView").destroy();
			$('#group-ranking-listview').remove();
 		},
        afterShow: function(e) {
            
          $lv = $('<ul id="group-ranking-listview"></ul>');
            
            $("#group-ranking .sub-navigation").after($lv);
            
            $lv.kendoMobileListView({
                dataSource: new kendo.data.DataSource({
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
                                        
            							return JSON.stringify(data);
            						} 
            					},
                        		schema: {
                                	data: function(res) {
                                    	var result = new Array();
                                          	
                                        	for(var i = 0; i < res.LoadTeamsResult.teams.length; i++) {
                                                var team = res.LoadTeamsResult.teams[i];

                                                if(team.group === e.view.params.group) {
                                                	result.push(team);
                                                }
                                            }
                                            
                                            return result;
                                    }
            					}
            				}),
                pullToRefresh: true,
                appendOnRefresh: false,
                template: $("#group-ranking-template").text()
            });
            
         	var group = e.view.params.group;

            this.header.find('[data-role="navbar"]').find('[data-role="view-title"]').html("Gruppe " + group);
            
            $("#navi-matches").attr("href", "#match-list?group=" + group);
            $("#navi-ranking").attr("href", "#group-ranking?group=" + group);
            
        }
    };
    
})(window);