var PokeBox = function(name, type, pokemons) {
	this.name = name;
	this.type = type || 'forest';
	this.pokemons = pokemons || new Array(30); // Pokemons collection

	/**
	 * Add a pokemon at a specified slot
	 * @param {Int} pokemonID
	 * @param {Int} slot
	 */
	this.addPokemon = function(pokemonID, slot) {
		this.pokemons.splice(slot, 1, pokemonID);
	}

	/**
	 * Remove the pokemon in the specified slot
	 * @param {Int} slot
	 */
	this.removePokemon = function(slot) {
		this.pokemons.splice(slot, 1, null);
	}
}