"use strict";

let properties = 0;

function validateInputs(){
    console.log("Validating");

}

function getListings(){
    properties = 0;
    let inputs = {
        city: $(".js-city").val(),
        state: $(".js-state").val(),
        price: $(".js-price").val(),
        beds: $(".js-beds").val(),
        baths: $(".js-baths").val(),
        sqft: $(".js-sqft").val(),
        results: $(".js-results").val()
    };
    getResponse(inputs);
}

function getResponse(inputs){
    console.log(inputs);
    $(".js-results").empty();    
    const url = `https://realtor.p.rapidapi.com/properties/v2/list-for-sale?beds_min=${inputs.beds}&sort=relevance&baths_min=${inputs.baths}&price_max=${inputs.price}&sqft_min=${inputs.sqft}&city=${inputs.city}&limit=${inputs.results}&offset=0&state_code=${inputs.state}`;
    fetch(url, {
        "method": "GET",
	    "headers": {
		    "x-rapidapi-host": "realtor.p.rapidapi.com",
        "x-rapidapi-key": "d517240f71mshd19d0dc2b65c0c2p11bd11jsna7a02e561795"
        }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => getRentalInfo(responseJson))
      .catch(err => {
        $('.js-error-msg').text(`Something went wrong: ${err.message}`);
      });
}

function getRentalInfo(responseJson){
    console.log(responseJson);
    console.log(responseJson.properties[0].address.line);
    let searchResults = responseJson;
    for (let i = 0; i < responseJson.properties.length; i++){
      const url = `https://realtymole-rental-estimate-v1.p.rapidapi.com/rentalPrice?address=${responseJson.properties[i].address.line.split(" ").join("%20")}%20${responseJson.properties[i].address.city.split(" ").join("%20")}%20${responseJson.properties[i].address.state_code}&bedrooms=${responseJson.properties[i].beds}&bathrooms=${responseJson.properties[i].baths}&squareFootage=${responseJson.properties[i].building_size.size}`;
      console.log(url);
      fetch(url, {
      "method": "GET",
    	"headers": {
	    	"x-rapidapi-host": "realtymole-rental-estimate-v1.p.rapidapi.com",
	  	  "x-rapidapi-key": "d517240f71mshd19d0dc2b65c0c2p11bd11jsna7a02e561795" 
	      }
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayRentalInfo(responseJson, searchResults))
      .catch(err => {
        $('.js-error-msg').text(`Something went wrong: ${err.message}`);
      });
    }
}

function displayRentalInfo(responseJson, searchResults){
    console.log(responseJson);
    console.log(searchResults);
    $(".js-results").append(`<h3>Result ${properties + 1}</h3>`);
    $(".js-results").append(`
      <section class="result js-result">
        <p>Address: ${searchResults.properties[properties].address.line}</p>
        <p>Price: ${searchResults.properties[properties].price}</p>
        <p>Projected Monthly Rental Income: ${responseJson.rent}</p>
        <p>Projected Rate of Return: ${calculateRate(searchResults.properties[properties].price, responseJson.rent)}%</p>    
      </section>`);
      properties++;  
        
}

function calculateRate(value, rent){
  const MONTHS_IN_YEAR = 12;
  return ((rent * MONTHS_IN_YEAR) / value);
}

function watch(){
    $(".js-form").submit(function(e){
      $(".js-results").empty();
      e.preventDefault();
      console.log("Watching");
      validateInputs();
      getListings();
    });
}

$(watch);