$(document).ready(function(){
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