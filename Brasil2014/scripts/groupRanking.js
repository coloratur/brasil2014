(function (global) {
    var GroupRankingViewModel,
        app = global.app = global.app || {};

    GroupRankingViewModel = kendo.data.ObservableObject.extend({
        userId: ""   
    });

    app.groupRanking = {
        viewModel: new GroupRankingViewModel(),
        teams: new kendo.data.DataSource({
              	transport: {
                      read: function(options) {
                          $.ajax({ 
                            url: app.WebServiceURL + "LoadTeams",
                            data: JSON.stringify({ authString: window.localStorage.getItem("authString") }),
                            type: "POST",
                            contentType: "application/json",
                            timeout: 10000,
                            dataType: "json",  // not "json" we'll parse 
                            success: 
                            function(res) {
                                var result = new Array();
                                
                                for(var i = 0; i < res.LoadTeamsResult.teams.length; i++) {
                                    var team = res.LoadTeamsResult.teams[i];
                                    
                                    if(team.group === app.application.view().params.group) {
                                    	result.push(team);
                                    }
                                }
                                
                                options.success(result);
                            },
                            error:  function(xhr) {
                                options.error(xhr);
                            }
                        });
            		}
                     
                  }
                })
    };
    
})(window);