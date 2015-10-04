$(document).ready(function(){

	// Simulate position fixed on filters column
	var filtersOriginalTopPosition = $('.filters').offset().top;
	$(window).scroll(function() {
		//$('.filters').stop().animate({'top': $(this).scrollTop() + filtersOriginalTopPosition + "px"}, 250);
	});

	var $pokedex = $('.pokedex');
	try {
		if(myDbPokemons) { // Try retrieve data from DB
			var myPokemons = myDbPokemons;

		} else { //Fallback for old system on localstorage
			var myPokemons = JSON.parse(localStorage.getItem('myPokemons')) || [];
		} 
		
	} catch(e) {
		var myPokemons = [];
	} 

	$pokedex.isotope({
		itemSelector: '.pokemon',
		transitionDuration: 0
	}).isotope( 'on', 'layoutComplete', function( isoInstance, laidOutItems ) {
		$pokedex.selectable('refresh');
	});

	/**
	 * Multi selector
	 */
	var $currentlySelected = null;
	var selected = [];
	// Make pokemons selectable
	
	$pokedex.bind('mousedown', function(e){
		e.metaKey = true;

	}).selectable({
		autoRefresh: false,
		filter: '.pokemon',
    start: function(event, ui) { // On mouse down
      $currentlySelected = $('.ui-selected');
    },
    stop: function(event, ui) { // On mouse up
      // Remove caught class on selected pokemon
      for (var i = 0; i < selected.length; i++) {
          if ($.inArray(selected[i], $currentlySelected) >= 0) {
            $(selected[i]).removeClass('ui-selected');
          }
      }
      selected = [];

      // Save pokedex and update the pokemon caught counter.
      savePokedex();
			updatePokemonCounter();
    },
    // Styles tweaks
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

	/**
	 * Clean saved pokedex.
	 */
	var resetPokedex = function() {
		// Ask twice user for this.
		if(confirm('Are you sure you want to reset your pokedex ? You will lose all your progression !')) {
			if(confirm('Are you REALLY sure to do that ?')) {
				$('.ui-selected').removeClass('ui-selected');
				myPokemons = [];
				updatePokemonCounter();
				savePokedex();
			}
		}
	}

	var updatePokemonCounter = function() {
		if(myPokemons.length == 1) {
			$('.my-pokemon-number').text('1 pokemon');	
		} else {
			$('.my-pokemon-number').text(myPokemons.length + ' pokemons');	
		}

		// Update generation progression counters
		var firstGenPokemons = $('.pokemon.ui-selected.generation-1').length;
		var secondGenPokemons = $('.pokemon.ui-selected.generation-2').length;
		var thirdGenPokemons = $('.pokemon.ui-selected.generation-3').length;
		var fourthGenPokemons = $('.pokemon.ui-selected.generation-4').length;
		var fifthGenPokemons = $('.pokemon.ui-selected.generation-5').length;
		var sixthGenPokemons = $('.pokemon.ui-selected.generation-6').length;
		$('.progress-bar.generation-1').css('width', firstGenPokemons / 151 * 100 + '%');
		$('.generation-1-progression').text(firstGenPokemons + '/'+ 151);
		$('.progress-bar.generation-2').css('width', $('.pokemon.ui-selected.generation-2').length / 100 * 100 + '%');
		$('.generation-2-progression').text(secondGenPokemons + '/'+ 100);
		$('.progress-bar.generation-3').css('width', $('.pokemon.ui-selected.generation-3').length / 135 * 100 + '%');
		$('.generation-3-progression').text(thirdGenPokemons + '/'+ 135);
		$('.progress-bar.generation-4').css('width', $('.pokemon.ui-selected.generation-4').length / 107 * 100 + '%');
		$('.generation-4-progression').text(fourthGenPokemons + '/'+ 107);
		$('.progress-bar.generation-5').css('width', $('.pokemon.ui-selected.generation-5').length / 156 * 100 + '%');
		$('.generation-5-progression').text(fifthGenPokemons + '/'+ 156);
		$('.progress-bar.generation-6').css('width', $('.pokemon.ui-selected.generation-6').length / 70 * 100 + '%');
		$('.generation-6-progression').text(sixthGenPokemons + '/'+ 70);
	}

	var savePokedex = function() {
		var selectedPokemons = [];
		$('.ui-selected').each(function(){
			var $pokemon = $(this);
			selectedPokemons.push($pokemon.data('id'));
		});
		myPokemons = selectedPokemons;

		if(userIsAuthenticated) {
			$.post('/user/updatePokedex', {
				pokemons: JSON.stringify(myPokemons)
			});

		} else {
			localStorage.setItem('myPokemons', JSON.stringify(myPokemons));

		}
	}

	updatePokemonCounter();

	$('a.reset-pokedex').on('click', resetPokedex);

	// Display pokemon names in tooltip
	$('[data-toggle="tooltip"]').tooltip({animation: false});

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