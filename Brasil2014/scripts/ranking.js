function rankingViewInit() {
    var listviews = this.element.find("ul.km-listview");

    $("#sub-navigation").kendoMobileButtonGroup({
        select: function(event) {
            //console.log(event.sender.selectedIndex);
            console.log("rankingViewInit");
            listviews.hide()
            .eq(event.sender.selectedIndex)
            .show();
        }
    });
}

(function (global) {
    var RankingViewModel,
        app = global.app = global.app || {};

    app.ranking = {
        getUserImage: function(id) {
            var imageUrl = user.userTenant.registrationUrl + "user_images/" + id + ".jpg";
			
            if(imageExists(imageUrl)) {
                return imageUrl;
            } else {
        		imageUrl = user.userTenant.registrationUrl + "user_images/" + id + ".png";
				
                if(imageExists(imageUrl)) {
                    return imageUrl;
                } else {
                    return "styles/images/Icons/user.svg";
                }
            }
        },
        hide: function(e) {
			$('#ranking-top-list').remove();
			$('#ranking-list').remove();
 		},
        show: function(e) {
			app.changeClientColor(app.currentUser.userTenant.colour);  
        },
        afterShow: function(e) {
            $lvTop = $('<ul id="ranking-top-list"></ul>');
            
            $("#tabstrip-ranking .sub-navigation").after($lvTop);
            
            $lvTop.kendoMobileListView({
                dataSource: new kendo.data.DataSource({
            					transport: {
            						read: {
                                        url: app.WebServiceURL + "LoadUserRanking",
                                        data: { },
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
                                        	
                                        for(var i = 0; i < (res.LoadUserRankingResult.users.length > 3 ? 3 : res.LoadUserRankingResult.users.length); i++) {
                                            var user = res.LoadUserRankingResult.users[i];
                                            result.push(user);                                    
                                        }
                                            
                                        return result;
                                    }
            					}
                			}),
                pullToRefresh: true,
                appendOnRefresh: false,
                template: $("#ranking-top-list-template").text()
            });
            
            $lv = $('<ul id="ranking-list"></ul>');
            
            $("#tabstrip-ranking #ranking-top-list").after($lv);
            
            $lv.kendoMobileListView({
                dataSource: new kendo.data.DataSource({
            					transport: {
            						read: {
                                        url: app.WebServiceURL + "LoadUserRanking",
                                        data: { },
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
                                        	
                                        for(var i = 3; i < (res.LoadUserRankingResult.users.length > 50 ? 50 : res.LoadUserRankingResult.users.length) ; i++) {
                                            var user = res.LoadUserRankingResult.users[i];
                                            result.push(user);                                    
                                        }
                                            
                                        return result;
                                    }
            					}
                			}),
                pullToRefresh: true,
                appendOnRefresh: false,
                template: $("#ranking-list-template").text()
            });
        }
    };
})(window);