var fs = require('fs');

var pokemons = require('../data/pokemons.json');
var translation = require('../data/pokemon_names.json');
pokemons.forEach(function(pokemon){
	var enName = pokemon.identifier.charAt(0).toUpperCase() + pokemon.identifier.slice(1);
	if(translation[enName]) {
		pokemon.identifier = translation[enName];
	} else {
		console.log(pokemon);
	}
});

var outputFilename = './data/generated-pokemons.json';

fs.writeFile(outputFilename, JSON.stringify(pokemons, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + outputFilename);
    }
}); 