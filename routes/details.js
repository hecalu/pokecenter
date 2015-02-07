var express = require('express');
var router = express.Router();
var request = require('request');
var apiURL = 'http://pokeapi.co';

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

/* GET Details page. */
router.get('/', function(req, res, next) {

  res.render('details', { 
  	title: "Details", 
  	details_is_active: true
  });

});

// Pokemon details page
router.get('/:pokemon_id/', function(req, res, next) {
	var pokemonID = req.params.pokemon_id;
	request({ url: apiURL+'/api/v1/pokemon/'+pokemonID, json: true}, function (error, response, pokemon) {
	  if (!error && response.statusCode == 200) {
	  	var spriteURI = pokemon.sprites[0].resource_uri;
	    request({ url: apiURL+spriteURI, json: true}, function (error, response, sprite) {
	    	if (!error && response.statusCode == 200) {
	    		var descriptionURI = pokemon.descriptions[0].resource_uri;
	    		request({ url: apiURL+descriptionURI, json: true}, function (error, response, description) {
	    			if (!error && response.statusCode == 200) {
	    				res.render('details_pokemon', { 
						  	title: "Details",
						  	image: apiURL+sprite.image,
						  	pokemon: pokemon,
						  	description: description.description,
						  	details_is_active: true
						});
	    			}
	    		});
	    	}
	    });
	  }
	})
	
});

module.exports = router;
