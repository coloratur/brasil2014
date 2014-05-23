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
                        visible: false,
                        background: "transparent"
                    }
                },
                series: [{
                    type: "donut",
                    data: [{
                        value: 75,
                        color: '#FF0000'
                    }, {
                        value: 25,
                        opacity: 0.5,
                        color: '#FFF'
                    }],
                    holeSize: 70
                }]
            });
            
            $('#score-value').html('75%');
            
            
            /*
            $("#chart").kendoRadialGauge({

                pointer: {
                    value: 80
                },
                scale: {
                    minorUnit: 5,
                    startAngle: -30,
                    endAngle: 210,
                    max: 180
                },
                labels: {
                    position: "inside"
                },
                ranges: [
                    {
                        from: 80,
                        to: 120,
                        color: "#ffc700"
                    }, {
                        from: 120,
                        to: 150,
                        color: "#ff7a00"
                    }, {
                        from: 150,
                        to: 180,
                        color: "#c20000"
                    }
                ]
            });
            */
        }
    };
})(window);