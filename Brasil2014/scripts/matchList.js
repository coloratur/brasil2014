(function (global) {
    var MatchListViewModel,
        app = global.app = global.app || {};

    MatchListViewModel = kendo.data.ObservableObject.extend({
       
    });

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
        matches: new kendo.data.DataSource({
					transport: {
						read: {
                            url: app.WebServiceURL + "LoadMatchesByStage",
                            data: { authString: window.localStorage.getItem("authString"), sStage: "GROUP" },
                            type: "POST",
                            contentType: "application/json",
                            timeout: 10000,
                            dataType: "json",
                            processData: false
                        },
						parameterMap: function(data, type) {
							return JSON.stringify(data);
						} 
					},
            		schema: {
                    	data: function(res) {
                        	var result = new Array();
                              	
                            	for(var i = 0; i < res.LoadMatchesByStageResult.matches.length; i++) {
                                    var match = res.LoadMatchesByStageResult.matches[i];
                                    result.push(match);                                    
                                }
                                
                                return result;
                        }
					}
		})
    };
    
})(window);