function openVoting(event) {
    //console.log($(this).closest('.list-item'));

    var button = event.target;
    var activeItem = $(button).closest('li');
    
    var origOffset = $(activeItem).offset().top;
    var offset = ((origOffset * -1) + 75).toString() + "px";
    
    var scrollContainer = $(activeItem).closest('.km-scroll-container');
    //$(scrollContainer).css({'webkit-transform': 'translate3d(0px, ' + offset + ', 0px)'});
    
    // ---
    
    var votingContainer = '';
    votingContainer +=   '<div class="voting-container">' +
    						'<input type="number" id="teamOne"/>' +
    						'<input type="number" id="teamTwo"/>' +
 						'</div>';
    
    $(activeItem).find('.list-item .game-info').prepend(votingContainer);
    
    // ---
    
    var buttonContainer = '';
    buttonContainer +=	'<div class="button-container">' +
    					  	'<div data-role="button" id="voteButton" class="button km-widget km-button"><span class="km-text">Tipp abgeben</span></div>' +
    					  	'<div data-role="button" id="chancelButton" class="button km-widget km-button"><span class="km-text">Abbrechen</span></div>' +
    				 	  '</div>';
    
    $(activeItem).find('.list-item').append(buttonContainer);
    
    // ---
    
    $(activeItem).css({height: 165});
    $(activeItem).find('.voting-container').css({opacity: 1});
    $(activeItem).find('.button-container').css({opacity: 1});
    $(button).css({display: 'none'});
    
    // ---
    
    $('#voteButton').click(function() {
		
	});
    
    $('#chancelButton').click(function(event) {
        event.preventDefault();
        
		$(button).css({display: 'inline-block'});
        $(activeItem).find('.list-item .voting-container').remove();
        $(activeItem).find('.list-item .button-container').remove();
        $(activeItem).css({height: 110});
                
        //$(scrollContainer).css({'webkit-transform': 'translate3d(0px, 0px, 0px)'});
	});
}