(function (global) {
    var ScoringViewModel,
        app = global.app = global.app || {};

    app.scoring = {
        show: function(e) {
			app.initView(e);
        },
        hide: function(e) {
            $("#tabstrip-score .content-container .scoring-details").remove();
        },
        afterShow: function(e) {
            app.onCurrentUserLoaded(function() {
            	(function() {	
                    $("#tabstrip-score .content-container").append("<div class='scoring-details'>" + 
                        "Rang: " + app.currentUser.rank + "<br />" + 
                        "Punkte: " + app.currentUser.score + "<br />" + 
                        "Spiele gesamt: " + app.currentUser.matchCountTotal + "<br />" + 
                        "Treffer: " + app.currentUser.matchCountCorrect + "<br />" + 
                        "Tendenz: " + app.currentUser.matchCountTendency + 
                    "</div>");
                    
                    $("#chart").knob({
                    	'min':0,
                        'max':100,
                        'readOnly':true,
                        'thickness':'0.2',
                        'width':'60%',
                        'fgColor':app.currentUser.userTenant.colour,
                        'inputColor':'#FFF',
                        'font':'Roboto',
                        'fontWeight':100,
                        'bgColor':'#FFF',
                        draw : function () {
                            var a = this.angle(this.cv)  // Angle
                                , sa = this.startAngle          // Previous start angle
                                , sat = this.startAngle         // Start angle
                                , ea                            // Previous end angle
                                , eat = sat + a                 // End angle
                                , r = true;

                            this.g.lineWidth = this.lineWidth;

                            this.o.cursor
                                && (sat = eat - 0.3)
                                && (eat = eat + 0.3);

                            if (this.o.displayPrevious) {
                                ea = this.startAngle + this.angle(this.value);
                                this.o.cursor
                                    && (sa = ea - 0.3)
                                    && (ea = ea + 0.3);
                                this.g.beginPath();
                                this.g.strokeStyle = this.previousColor;
                                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
                                this.g.stroke();
                            }

                            this.g.beginPath();
                            this.g.strokeStyle = r ? this.fgColor : this.fgColor ;
                            this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
                            this.g.stroke();

                            this.g.lineWidth = 2;
                            this.g.beginPath();
                            this.g.strokeStyle = '#FFF';
                            this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                            this.g.stroke();

                            return false;
                        }
                	});
                	$({
                		value: 0
                	}).animate({
                		value: app.currentUser.matchCountTotal == 0 ? 0 : (app.currentUser.matchCountCorrect/app.currentUser.matchCountTotal)*100
                	}, {
                		duration: 2000,
                		easing: 'swing',
                		step: function() {
                			return $('#chart').val(Math.ceil(this.value) + '%').trigger('change');
                		}
                	});
                	return setTimeout(function() {
                		return $('#chart').attr('data-fgColor', 'red').trigger('change');
                	}, 1000);
                }).call(this);
            });
        }
            
    };
})(window);
