$(document).ready(function(){
  
  // Insert User data into hidden fields to store them in database during account creation
  var myPokemons = localStorage.getItem('myPokemons') || "[]";
  var myShinies = localStorage.getItem('myShinies') || "[]";
  
  $('input[name="myPokemons"]').val(myPokemons);
  $('input[name="myShinies"]').val(myShinies);
});