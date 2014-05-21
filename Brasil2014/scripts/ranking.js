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