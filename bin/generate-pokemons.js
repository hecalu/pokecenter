// Lib file for manipulate data in pokedex file (french translation)
var fs = require('fs');

var pokemons = require('../data/pokemons.json');
var translation = require('../data/pokemon_names.json');

/**
 * Get corresponding generation for a given pokemon ID
 * @param  {Integer} pokemonId Pokemon ID
 * @return {Integer} Corresponding generation number. Return null otherwise.
 */
function getGenerationByPokemonId(pokemonId) {
	var generation = null;
	if(pokemonId >= 1 && pokemonId <= 151) {
		generation = 1;

	} else if(pokemonId >= 152 && pokemonId <= 251) {
		generation = 2;
		
	} else if(pokemonId >= 252 && pokemonId <= 386) {
		generation = 3;
		
	} else if(pokemonId >= 387 && pokemonId <= 493) {
		generation = 4;
		
	} else if(pokemonId >= 494 && pokemonId <= 649) {
		generation = 5;
		
	} else if(pokemonId >= 650 && pokemonId <= 719) {
		generation = 6;
		
	}
	return generation;
}

pokemons.forEach(function(pokemon){
	var enName = pokemon.identifier.charAt(0).toUpperCase() + pokemon.identifier.slice(1);
	// Translate pokemon name in french
	if(translation[enName]) {
		pokemon.identifier = translation[enName];
	} else {
		console.log(pokemon+" is not translated in french");
	}
	// Set Pokemon generation
	pokemon.generation = getGenerationByPokemonId(pokemon.id);

});

var outputFilename = './data/generated-pokemons.json';

// Save built pokedex to a new file
fs.writeFile(outputFilename, JSON.stringify(pokemons, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + outputFilename);
    }
}); 