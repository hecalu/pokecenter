$(document).ready(function(){

	// Simulate position fixed on filters column
	var filtersOriginalTopPosition = $('.filters').offset().top;
	$(window).scroll(function() {
		//$('.filters').stop().animate({'top': $(this).scrollTop() + filtersOriginalTopPosition + "px"}, 250);
	});

	var mode = "capture";
	
	// Shiny tracking params
	var encounters = 0;
	var shinyCharm = true;
	var encounterMethod = "random";
	var trackingGeneration = 7;
  var selectedPokemonID = null;


	var $pokedex = $('.pokedex');
	try {
		if(userIsAuthenticated) { // Try retrieve data from DB
      var myPokemons = myDbPokemons;
      var myShinies = myDbShinies;

		} else { //Fallback for old system on localstorage
      var myPokemons = JSON.parse(localStorage.getItem('myPokemons')) || [];
      var myShinies = JSON.parse(localStorage.getItem('myShinies')) || [];
		} 
		
	} catch(e) {
    var myPokemons = [];
    var myShinies = [];
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
	

	function setCaptureMode() {
		console.log('capture mode');
		$pokedex.selectable( "option", "disabled", false );
		$('.capture-progression').removeClass('hide');
		$('.shiny-tracking').addClass('hide');
    $('.pokedex').removeClass('theme-shiny');
    $('.pokedex').addClass('theme-capture');
	}
	
	function setShinyTrackingMode() {
		console.log('shiny-tracking mode');
		$pokedex.selectable( "option", "disabled", true );
		$('.capture-progression').addClass('hide');
		$('.shiny-tracking').removeClass('hide');
    $('.pokedex').addClass('theme-shiny');
    $('.pokedex').removeClass('theme-capture');
	}


	if(myPokemons.length > 0 || myShinies.length) {
		$.map($('.pokemon'), function(pokemon){
      if($.inArray($(pokemon).data('id'), myPokemons) > -1) {
        $(pokemon).addClass('ui-selected');
      }
      if($.inArray($(pokemon).data('id'), myShinies) > -1) {
        $(pokemon).addClass('shiny');
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
        myShinies = [];
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
    var firstGenPokemons = $('.pokemon.generation-1').length;
    var secondGenPokemons = $('.pokemon.generation-2').length;
    var thirdGenPokemons = $('.pokemon.generation-3').length;
    var fourthGenPokemons = $('.pokemon.generation-4').length;
    var fifthGenPokemons = $('.pokemon.generation-5').length;
    var sixthGenPokemons = $('.pokemon.generation-6').length;
    var seventhGenPokemons = $('.pokemon.generation-7').length;
    
    var firstGenCaught = $('.pokemon.ui-selected.generation-1').length;
    var secondGenCaught = $('.pokemon.ui-selected.generation-2').length;
    var thirdGenCaught = $('.pokemon.ui-selected.generation-3').length;
    var fourthGenCaught = $('.pokemon.ui-selected.generation-4').length;
    var fifthGenCaught = $('.pokemon.ui-selected.generation-5').length;
    var sixthGenCaught = $('.pokemon.ui-selected.generation-6').length;
    var seventhGenCaught = $('.pokemon.ui-selected.generation-7').length;
    
		$('.progress-bar.generation-1').css('width', firstGenCaught / firstGenPokemons * 100 + '%');
		$('.generation-1-progression').text(firstGenCaught + '/'+ firstGenPokemons);
		$('.progress-bar.generation-2').css('width', secondGenCaught / secondGenPokemons * 100 + '%');
		$('.generation-2-progression').text(secondGenCaught + '/'+ secondGenPokemons);
		$('.progress-bar.generation-3').css('width', thirdGenCaught / thirdGenPokemons * 100 + '%');
		$('.generation-3-progression').text(thirdGenCaught + '/'+ thirdGenPokemons);
		$('.progress-bar.generation-4').css('width', fourthGenCaught / fourthGenPokemons * 100 + '%');
		$('.generation-4-progression').text(fourthGenCaught + '/'+ fourthGenPokemons);
		$('.progress-bar.generation-5').css('width', fifthGenCaught / fifthGenPokemons * 100 + '%');
		$('.generation-5-progression').text(fifthGenCaught + '/'+ fifthGenPokemons);
		$('.progress-bar.generation-6').css('width', sixthGenCaught / sixthGenPokemons * 100 + '%');
		$('.generation-6-progression').text(sixthGenCaught + '/'+ sixthGenPokemons);
    $('.progress-bar.generation-7').css('width', seventhGenCaught / seventhGenPokemons * 100 + '%');
    $('.generation-7-progression').text(seventhGenCaught + '/'+ seventhGenPokemons);
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
        pokemons: JSON.stringify(myPokemons),
        shinies: JSON.stringify(myShinies)
			});

		} else {
      localStorage.setItem('myPokemons', JSON.stringify(myPokemons));
      localStorage.setItem('myShinies', JSON.stringify(myShinies));

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
		var filterValue = (mode === "capture")? $(this).data('capture-filter') : $(this).data('shiny-filter');
		$pokedex.isotope({
			filter: filterValue
		});
	});

	/* EVENTS */

	// Select a pokemon
	$('.pokemon').on('click', function(){
		console.log('Pokemon selected: '+ $(this).data('name'));
		$(document).trigger('pokemon-selected', $(this).data('id'));
	});

	// When selecting a pokemon
	$(document).on('pokemon-selected', function(e, pokemonID){
		if(mode == "shiny-tracking") {
			$('.pokemon-tracked').html('<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/'+pokemonID+'.png"/>');
			console.log(pokemonID);
      selectedPokemonID = pokemonID;
      if(myShinies.indexOf(selectedPokemonID) === -1) {
        // Shiny not captured
        $('.btn.caught-shiny').removeClass('hide');
        $('.btn.remove-shiny').addClass('hide');

      } else {
        // Shiny already captured
        $('.btn.remove-shiny').removeClass('hide');
        $('.btn.caught-shiny').addClass('hide');
      }
		}
	});

	// Change mode
	$(".modes :input").change(function() {
    mode = $(this).data('mode');
    $(document).trigger('mode-changed');
	});

	// Mode changed
	$(document).on('mode-changed', function(){
		if(mode == 'capture') {
			setCaptureMode();
		}
		else {
			setShinyTrackingMode();
    	$(document).trigger('shiny-params-changed');
		}
	});

  // Capture a shiny
  $(".caught-shiny").click(function() {
    if(selectedPokemonID != null) {
      if (myShinies.indexOf(selectedPokemonID) === -1) myShinies.push(selectedPokemonID); // Prevents duplicates
      $('#pokedex-pokemon-'+selectedPokemonID).addClass('shiny');
      console.log("My Shinies :", myShinies);
      savePokedex();
    }
  });

  // Remove a shiny
  $(".remove-shiny").click(function() {
    if(selectedPokemonID != null) {
      var index = myShinies.indexOf(selectedPokemonID);
      if (index > -1) {
        myShinies.splice(index, 1);
      }
      $('#pokedex-pokemon-'+selectedPokemonID).removeClass('shiny');
      console.log("My Shinies :", myShinies);
      savePokedex();
    }
  });

	// Tracking generation changed
	$(".tracking-generation :input").change(function() {
    trackingGeneration = $(this).data('generation');
		console.log('Tracking Generation: '+trackingGeneration);

		// Hide shinyCharm field according selected generation
		if(trackingGeneration <= 4) {
			$('.shiny-charm').hide();
		} else {
			$('.shiny-charm').show();
		}

    $(document).trigger('shiny-params-changed');
	});

	// Update Encounter Method
	$('select.encounter-method').change(function() {
		encounterMethod = $(this).find("option:selected").val();
		console.log('Encounter Method: '+encounterMethod);
    $(document).trigger('shiny-params-changed');
	});

	// Update Shiny Charm
	$('.shiny-charm :input').change(function() {
		shinyCharm = $(this).data('shiny-charm');
		console.log('Shiny charm: '+shinyCharm);
    $(document).trigger('shiny-params-changed');
	});

	// Update encounters
	$(".encounters-tracking button").on('click', function() {
    encounters = ($(this).data('encounters') == 'dec') ? Math.max(encounters-1,0) : encounters+1;
    $(document).trigger('shiny-params-changed');
	});
	
	$(".encounters").on('input', function() {
		encounters = parseInt($('.encounters').val());
    $(document).trigger('shiny-params-changed');
	});

	// Reset encounters
	$('.reset-encounters').on('click', function(e) {
		e.preventDefault();
		encounters = 0;
    $(document).trigger('shiny-params-changed');
	});

	// Update Shiny Params : Compute all values again
	$(document).on('shiny-params-changed', function(){
		var odds = computeOdds();
		$('.shiny-tracking .encounters').val(encounters);
		$('.shiny-tracking .probability').text(odds.toFraction());
		$('.shiny-tracking .binomial').text(binomialDistributionPercentage(odds.valueOf()));
		$('.shiny-tracking .remaining-encounters').text(remainingEncounters(odds.valueOf()));
	});

	function computeOdds() {
    var odds = 8192;

    // Random Encounters and Soft Resets
    if (trackingGeneration === 6 || trackingGeneration === 7) {
      odds = 4096;
    }
    if (shinyCharm === true && trackingGeneration === 5) {
      odds = 2731;
    }
    if (shinyCharm === true && (trackingGeneration === 6 || trackingGeneration === 7)) {
      odds = 1365;
    }

    // Masuda Method
    if (encounterMethod === "masuda") {
      if (trackingGeneration === 4) {
        odds = 1638;
      }
      if (trackingGeneration === 5) {
        if (shinyCharm === true) {
          odds = 1024;
        } else {
          odds = 1365;
        }
      }
      if (trackingGeneration === 6 || trackingGeneration === 7) {
        if (shinyCharm === true) {
          odds = 512;
        } else {
          odds = 683;
        }
      }
    }

    // Friend Safari
    if (encounterMethod === "safari") {
      odds = 512;
    }

    // Dex Nav -- unsure of the legitimacy of this
    if (encounterMethod === "dex_nav") {
      odds = 512;
    }

    // Radar chaining
    // Chain fishing is speculated to be the same
    if (encounterMethod === "radar" || encounterMethod === "fishing") {
      // Values for the formula:
      // Math.ceil(65535 / (8200 - nc * 200)) / 65536
      // where nc = number in the chain, up to 40

      var nc = encounters;
      if (nc < 0) {
        nc = 0;
      }
      if (nc > 40) {
        nc = 40;
      }
      var f = new Fraction(Math.ceil(65535 / (8200 - nc * 200)) / 65536);
      odds = Math.ceil(f.d/f.n);

      if (trackingGeneration === 6) {
        odds = odds/2;
      }

      if (shinyCharm === true) {
        f = new Fraction(3, odds);
        odds = Math.ceil(f.d/f.n);
      }
    }

    // S.O.S Battles
    if (encounterMethod === "sos") {
      var chained_encounter = encounters % 256;
      if (chained_encounter  >= 70) {
        if (shinyCharm === true) {
          odds = 683;
        } else {
          odds = 1024;
        }
      }
    }
    return new Fraction(1, Math.ceil(odds));
  }


  function binomialDistributionPercentage(oddsValue) {
    var p = oddsValue;
    var n = encounters;
    var p_to_n = Math.pow((1.0 - p), n);
    return (p_to_n * (Math.pow((-(1.0/(p-1.0))), n)) - p_to_n) * 100.0;
  }

  function remainingEncounters(oddsValue) {
    var p = oddsValue;
    var n = Math.ceil(Math.log(0.1) / Math.log(1-p));
    return n - encounters;
  }

});