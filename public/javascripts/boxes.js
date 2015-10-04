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

	// Make pokemons draggable
	$('.pokemon').draggable({
      appendTo: "body",
      helper: "clone"
	});

	// Add a new box
	$('.add-box-form').on('submit', function(e){
		e.preventDefault();

		var boxName = $('.new-pokebox-name').val();
		var boxType = $('.new-pokebox-type').val();
		if(boxName.length > 0 && myBoxes.isBoxNameUnique(boxName)) {
			
			// Try to add box	
			var newBox = new PokeBox(boxName, boxType);
			if(myBoxes.addBox(newBox) != false) {
				self.addBox(newBox); // Build UI for new box
				// Empty box name input
				$('.new-pokebox-name').val('');
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

			// Set new added box as droppable container for pokemon.
			$slot.droppable({
		      hoverClass: "move-pokemon",
		      drop: function( event, ui ) {
		      	var $pokemon = $(ui.draggable).clone();
		      	
		      	// Update box pokemon list
		      	$slot.empty();
		      	self.addPokemon($pokemon, $slot);
						box.addPokemon($pokemon.data('id'), $slot.data('slot-id'));
						myBoxes.updateBox(box);
						$('[data-toggle="tooltip"]').tooltip();
						if($(ui.draggable).parents('.pokebox').length > 0) {
		      		self.removePokemon($(ui.draggable));
		      	}
						myBoxes.save();
		      }
		  });
		});

		// Delete box when clicking on the cross btn
		$box.find('.close').on('click', function(){
			// Prompt user before doing anything
			if(confirm('Are you sure you want to remove this box?')) { 
				// Remove selected box
				myBoxes.removeBox(box);
				myBoxes.save();
				$box.remove();
			}
		});
		
		// Fill slots with existing pokemons
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

	/**
	 * Graphically, add a pokemon in a box
	 * @param {jQueryElement} $pokemon Pokemon to add
	 * @param {jQueryElement} $slot Targeted slot of a pokebox
	 */
	this.addPokemon = function($pokemon, $slot) {
		var self = this;
		
		// Make sure PokemonID is not present in slot
		$pokemon.find('.pokemon-id').remove();
		$pokemon.css({
			'position': 'initial',
			'top': 0,
			'left': 0
		});
		
		// Add pokemon DOM element in slot
		$slot.append($pokemon);
		
		// Make pokemon draggable
		$pokemon.draggable({
			revert: function(valid){
				if (!valid) {
					// Remove pokemon from slot when dropped outside
					self.removePokemon($pokemon);
					myBoxes.save();
				}
				return true;
			},
      appendTo: "body"
		});
	}

	/**
	 * Graphically, delete the given Pokemon element
	 * @param  {jQueryElement} $pokemon Element to remove
	 */
	this.removePokemon = function($pokemon) {
		// Retrieve pokemon slot & pokemon box to delete references
		var $slot = $pokemon.parents('.pokebox-slot:first');
		var originSlot = $slot.data('slot-id');
		var originBox = $pokemon.parents('.pokebox:first').data('box');

		if(originBox) {
			// First remove pokemon from its box
			originBox.removePokemon(originSlot);
			// Then, update the changed box
			myBoxes.updateBox(originBox);
		}
		$slot.empty();
	}

	/**
	 * Show a boxes collection, by building corresponding DOM UI
	 * @param  {Boxes} boxes
	 */
	this.showMyBoxes = function(boxes) {
		$.each(boxes, function(i, myBox){
			self.addBox(myBox);
		});
	}

	// Show existing user's boxes
  self.showMyBoxes(myBoxes.getBoxes());

	// Display pokemon names in tooltip
	$('[data-toggle="tooltip"]').tooltip();
});