$(document).ready(function(){
  
  // Insert User data into hidden fields to store them in database during account creation
  var myPokemons = localStorage.getItem('myPokemons') || "[]";
  var myBoxes = localStorage.getItem('myBoxes') || "[]";
  
  $('input[name="myPokemons"]').val(myPokemons);
  $('input[name="myBoxes"]').val(myBoxes);
});