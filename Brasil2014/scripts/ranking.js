function rankingViewInit() {
    var listviews = this.element.find("ul.km-listview");

    $("#select-section").kendoMobileButtonGroup({
        select: function(e) {
            listviews.hide()
            .eq(e.index)
            .show();
        },
        index: 0
    });
}