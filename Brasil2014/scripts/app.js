(function (global) {
    var app = global.app = global.app || {};

    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
        StatusBar.hide();

        app.application = new kendo.mobile.Application(document.body, { skin: "flat" });
        
        //app = new kendo.mobile.Application(document.body, { skin: "flat" });

        
        //analytics.Start();
    }, false);    
})(window);