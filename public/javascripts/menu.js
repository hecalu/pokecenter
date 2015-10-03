$(document).ready(function(){
  
	/**
   * Top navbar pokemon search form.
   * Use a datalist to autocomplete and suggest pokemon names to user.
   * On submit search, opens a new page on pokepedia with the selected pokemon.
   */
  $('.view-pokemon-details').on('submit', function(e){
		e.preventDefault();
		var pokemonName = $('.view-pokemon').val();
		var $pokemonSearched = $(this).find('option[value="' + pokemonName + '"]');
		if($pokemonSearched.length > 0) {
			// Redirect to pokepedia
			window.open('http://www.pokepedia.fr/'+pokemonName, '_blank');
		}
	});

  /**
   * Ajax call in POST method for register a new user
   */
  $('.register-form').on('submit', function(e){
    e.preventDefault();

    var warningMessage = $(this).find('.bg-warning');
    // Form data
    var formAction = $(this).attr('action');
    var username = $(this).find('input[name="username"]').val();
    var password = $(this).find('input[name="password"]').val();

    try {
      var myPokemons = JSON.parse(localStorage.getItem('myPokemons')) || [];
      var myBoxes = JSON.parse(localStorage.getItem('myBoxes')) || [];
    
    } catch(e) {
      var myPokemons = [];
      var myBoxes = [];
    }

    warningMessage.addClass('hide'); // Hide warning message.

    $.ajax({
      url: formAction,
      method: 'POST',
      data: {
        username: username,
        password: password,
        pokemons: myPokemons,
        boxes: myBoxes
      }
    })
    .done(function(data){
      if(data.success) {
        location.reload(); // Refresh current page to update DOM.

      } else {
        warningMessage.text(data.message).removeClass('hide');
      }
    });
  });

  /**
   * Ajax call in POST method for authenticate a new user
   */
  $('.login-form').on('submit', function(e){
    e.preventDefault();

    var warningMessage = $(this).find('.bg-warning');
    
    // Form data
    var formAction = $(this).attr('action');
    var username = $(this).find('input[name="username"]').val();
    var password = $(this).find('input[name="password"]').val();

    warningMessage.addClass('hide'); // Hide warning message.

    $.ajax({
      url: formAction,
      method: 'POST',
      data: {
        username: username,
        password: password
      }
    })
    .done(function(data){
      if(data.success) {
        location.reload(); // Refresh current page to update DOM.

      } else {
        warningMessage.text(data.message).removeClass('hide');
      }
    });
  });

});