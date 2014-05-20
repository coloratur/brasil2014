(function (global) {
    var app = global.app = global.app || {};

    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
        StatusBar.hide();

        app.application = new kendo.mobile.Application(document.body, { skin: "flat" });
    }, false);
    
})(window);

