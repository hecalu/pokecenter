$(document).ready(function(){
	$.fn.editable.defaults.mode = 'inline';

	var self = this;

	var myBoxes = new PokeBoxes();
	myBoxes.load(); // Load user boxes from local storage

	var $pokedex = $('.pokedex');
	try {
		var myPokemons = JSON.parse(localStorage.getItem('myPokemons')) || [];
	} catch(e) {
		var myPokemons = [];
	}

	// Add style on captured pokemon
	if(myPokemons.length > 0) {
		$.map($('.pokemon'), function(pokemon){
			if($.inArray($(pokemon).data('id'), myPokemons) > -1) {
				$(pokemon).addClass('ui-selected');
			}
		});
	}

	// Filter by Name
	$('.search-pokemon').on('keyup', function(){
		var searchValue = $(this).val().toLowerCase();
		$pokedex.isotope({
			resizable: false,
			resizesContainer : false,
			filter: function() {
		    var name = $(this).data('id') + $(this).data('name').toLowerCase();
		    return name.match( searchValue );
  		}
		});
		// Reset label filters
		$('.pokemon-filters label').removeClass('active');
	});


	// Make pokemons draggable
	$('.pokemon').draggable({
      appendTo: "body",
      helper: "clone"
	});

	// Add a new box
	$('form.add-box').on('submit', function(e){
		e.preventDefault();

		var boxName = $(this).find('.new-pokebox-name').val();
		var boxType = $(this).find('.new-pokebox-type').val();
		if(boxName.length > 0 && myBoxes.isBoxNameUnique(boxName)) {
			
			// Try to add box	
			var newBox = new PokeBox(boxName, boxType);
			if(myBoxes.addBox(newBox) != false) {
				myBoxes.save(); // Save my boxes
				self.addBox(newBox); // Build UI for new box
				// Empty box name input
				$(this).find('.new-pokebox-name').val('');
			}
		}
	});

	/**
	 * Build UI to add a new box
	 * @param {Box} box
	 */
	this.addBox = function(box) {
		var $boxes = $('.boxes');
		var $box = $('.template.pokebox').clone().removeClass('template').appendTo($boxes);
		$box.addClass(box.type);
		$box.find('.pokebox-name').text(box.name).editable({
			success: function(response, newValue){
				box.name = newValue;
				myBoxes.updateBox(box);
				myBoxes.save();
			}
		});

		$box.data('box', box);
		$box.find('.pokebox-slot').each(function(i, slot){
			var $slot = $(slot);
			$slot.bind('mousedown', function(event) { event.preventDefault() });
			$slot.droppable({
		      hoverClass: "move-pokemon",
		      drop: function( event, ui ) {
		      	var $pokemon = $(ui.draggable);
		      	if($pokemon.parents('.pokebox').length > 0) {
		      		self.removePokemon($(ui.draggable));
		      	} else {
		      		var $pokemon = $pokemon.clone();
		      	}
		      	
		      	// Update box pokemon list
		      	$slot.empty();
		      	self.addPokemon($pokemon, $slot);
						box.addPokemon($pokemon.data('id'), $slot.data('slot-id'));
						myBoxes.updateBox(box);
						myBoxes.save();
						$('[data-toggle="tooltip"]').tooltip();
		      }
		  });
		});

		$box.find('.close').on('click', function(){
			myBoxes.removeBox(box);
			myBoxes.save();
			$box.remove();
		});
		
		// Fill slots with existing pokemon
		$.each(box.pokemons, function(slot, pokemonID){
			if(pokemonID != undefined) {
				var $pokemon = $('.pokemon-'+pokemonID).clone();
				var $slot = $box.find('.pokebox-slot:eq('+slot+')');
				if($slot) {
					self.addPokemon($pokemon, $slot);
				}
			}
		});
		return $box;
	}

	this.addPokemon = function($pokemon, $slot) {
		var self = this;
		$pokemon.find('.pokemon-id').remove();
		$pokemon.css({
			'position': 'initial',
			'top': 0,
			'left': 0
		});
		
		$slot.append($pokemon);
		
		// Make pokemon draggable
		$pokemon.draggable({
			revert:true
		});

		// Remove pokemon from slot on double click
		$pokemon.off('dblclick').on('dblclick', function(){
			self.removePokemon($pokemon);
			myBoxes.save();
		});

	}

	this.removePokemon = function($pokemon) {
		var $slot = $pokemon.parents('.pokebox-slot:first');
		var originSlot = $slot.data('slot-id');
		var originBox = $pokemon.parents('.pokebox:first').data('box');
		if(originBox) {
			originBox.removePokemon(originSlot);
			myBoxes.updateBox(originBox);
		}
		$slot.empty();
	}

	this.showMyBoxes = function(boxes) {
		$.each(boxes, function(i, myBox){
			self.addBox(myBox);
		});
	}

  self.showMyBoxes(myBoxes.getBoxes());

	// Display pokemon names in tooltip
	$('[data-toggle="tooltip"]').tooltip();
});