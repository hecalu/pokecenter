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
  
});