(function (global) {
    var HomeViewModel,
        app = global.app = global.app || {};

    HomeViewModel = kendo.data.ObservableObject.extend({
        userId: ""   
    });

    app.home = {
        viewModel: new HomeViewModel(),
        show: function() {
            app.onCurrentUserLoaded(function() {
                app.home.viewModel.userId = app.currentUser.id;
                kendo.bind($("#home-userId"), app.home.viewModel);
            });
        }
    };
})(window);