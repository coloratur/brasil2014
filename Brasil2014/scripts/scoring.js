(function (global) {
    var ScoringViewModel,
        app = global.app = global.app || {};

    app.scoring = {
        show: function(e) {
			app.initView(e);
        },
        hide: function(e) {
            $("#chart .scoring-details").remove();
        },
        afterShow: function(e) {
            
            // todo: delete this div in the hide event
            $("#chart").after("<div class='scoring-details'>" + 
            "Rang: " + app.currentUser.rank + "<br />" + 
            "Punkte: " + app.currentUser.score + "<br />" + 
            "Spiele insgesamt: " + app.currentUser.matchCountTotal + "<br />" + 
            "Treffer: " + app.currentUser.matchCountCorrect + "<br />" + 
            "Tendenz: " + app.currentUser.matchCountTendency + "<br />" + 
            "</div>");
            
            $("#chart").kendoChart({
                legend: {
                    visible: false
                },
                chartArea: {
                    background: ""
                },
                theme: "flat",
                seriesDefaults: {
                    labels: {
                        template: "#= category # - #= kendo.format('{0:P}', percentage)#",
                        position: "outsideEnd",
                        visible: true,
                        background: "transparent",
                        align: "column"
                    }
                },
                series: [{
                    type: "donut",
                    startAngle: 90,
                    data: [{
                        value: 75,
                        category: "Treffer",
                        color: app.currentUser.userTenant.colour
                    }, {
                        value: 25,
                        category: "Tendenz",
                        opacity: 0.5,
                        color: '#FFF'
                    }],
                    holeSize: 70
                }]
            });
            
            $('#score-value').html('75%');
        }
    };
})(window);
