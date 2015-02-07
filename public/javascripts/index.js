$(document).ready(function(){
	

	var $pokedex = $('.pokedex');
	try {
		var myPokemons = JSON.parse(localStorage.getItem('myPokemons')) || [];
	} catch(e) {
		var myPokemons = [];
	} 

	$pokedex.isotope({
		itemSelector: '.pokemon'
	}).isotope( 'on', 'layoutComplete', function( isoInstance, laidOutItems ) {
		$pokedex.selectable('refresh');
	});

	/**
	 * Single selector
	 */
	/*$('.pokemon-capture').on('click', function(){
		$(this).parents('.pokemon:first').toggleClass('ui-selected');
		savePokedex();
		$('.my-pokemon-number').text(myPokemons.length);	
	});*/

	/**
	 * Multi selector
	 */
	var $currentlySelected = null;
	var selected = [];
	$pokedex.bind('mousedown', function(e){
		e.metaKey = true;
	}).selectable({
		autoRefresh: false,
		filter: '.pokemon',
	    start: function(event, ui) {
	        $currentlySelected = $('.ui-selected');
	    },
	    stop: function(event, ui) {
	        for (var i = 0; i < selected.length; i++) {
	            if ($.inArray(selected[i], $currentlySelected) >= 0) {
	              $(selected[i]).removeClass('ui-selected');
	            }
	        }
	        selected = [];

	        var selectedPokemons = [];
			$('.ui-selected').each(function(){
				var $pokemon = $(this);
				selectedPokemons.push($pokemon.data('id'));
			});
			myPokemons = selectedPokemons;
			
			updatePokemonCounter();

			localStorage.setItem('myPokemons', JSON.stringify(myPokemons));
	    },
	    selecting: function(event, ui) {
	        $currentlySelected.addClass('ui-selected'); // re-apply ui-selected class to currently selected items
	    },
	    selected: function(event, ui) {
	        selected.push(ui.selected); 
	    }
	});
	

	if(myPokemons.length > 0) {
		$.map($('.pokemon'), function(pokemon){
			if($.inArray($(pokemon).data('id'), myPokemons) > -1) {
				$(pokemon).addClass('ui-selected');
			}
		});
	}

	var resetPokedex = function() {
		$('.ui-selected').removeClass('ui-selected');
		myPokemons = [];
		updatePokemonCounter();
	}

	var updatePokemonCounter = function() {
		if(myPokemons.length == 1) {
			$('.my-pokemon-number').text('1 pokemon');	
		} else {
			$('.my-pokemon-number').text(myPokemons.length + ' pokemons');	
		}
	}

	var savePokedex = function() {
		var selectedPokemons = [];
		$('.ui-selected').each(function(){
			var $pokemon = $(this);
			selectedPokemons.push($pokemon.data('id'));
		});
		myPokemons = selectedPokemons;
		localStorage.setItem('myPokemons', JSON.stringify(myPokemons));
	}

	updatePokemonCounter();

	$('a.reset-pokedex').on('click', resetPokedex);
	$('a.save-pokedex').on('click', savePokedex);

	// Display pokemon names in tooltip
	$('[data-toggle="tooltip"]').tooltip();

	// Filter by Name
	$('.search-pokemon').on('change', function(){
		var searchValue = $(this).val().toLowerCase();
		$pokedex.isotope({
			filter: function() {
			    var name = $(this).data('id') + $(this).data('name').toLowerCase();
			    return name.match( searchValue );
  			}
		});
		// Reset label filters
		$('.pokemon-filters label').removeClass('active');
	});

	// Filter by capture
	$('.pokemon-filters label').on('click', function(){
		var filterValue = $(this).data('filter');
		$pokedex.isotope({
			filter: filterValue
		});
	});

});