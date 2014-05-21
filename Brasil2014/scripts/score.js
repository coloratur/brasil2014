$(document).ready(function() {
	//createGauge();
});


function createGauge() {
    $("#gauge").kendoRadialGauge({
        pointer: {
            value: 150
        },
        scale: {
            minorUnit: 5,
            startAngle: -30,
            endAngle: 210,
            max: 180
        }
    });
}
