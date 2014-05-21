function rankingViewInit() {
    var listviews = this.element.find("ul.km-listview");

    $("#sub-navigation").kendoMobileButtonGroup({
        select: function(event) {
            //console.log(event.sender.selectedIndex);
            
            listviews.hide()
            .eq(event.sender.selectedIndex)
            .show();
        }
    });
}