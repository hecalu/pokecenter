var express = require('express');
var router  = express.Router();
var pokemons = require('../data/generated-pokemons.json');

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

/* GET Boxes page. */
router.get('/', function(req, res, next) {

  var nbPokemonsInRow = 38;
  pokemons.forEach(function(pokemon){
    pokemon.padId = pad(pokemon.id, 3);
    pokemon.backgroundPosition = '-'+((pokemon.id-1)%nbPokemonsInRow*40)+'px -'+(Math.floor((pokemon.id-1)/nbPokemonsInRow)*30)+'px';
  });
  
  res.render('boxes', { 
    title: "Boxes", 
    boxes_is_active: true,
    pokedex: pokemons
  });

});

module.exports = router;
