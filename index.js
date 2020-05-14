"use strict";

let properties = 0;

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
    let searchResults = responseJson;
    for (let i = 0; i < responseJson.properties.length; i++){
      const url = `https://realtymole-rental-estimate-v1.p.rapidapi.com/rentalPrice?address=${responseJson.properties[i].address.line.split(" ").join("%20")}%20${responseJson.properties[i].address.city.split(" ").join("%20")}%20${responseJson.properties[i].address.state_code}&bedrooms=${responseJson.properties[i].beds}&bathrooms=${responseJson.properties[i].baths}&squareFootage=${responseJson.properties[i].building_size.size}`;
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
        $(".js-error-msg").show();
        $('.js-error-msg').text(`Something went wrong: ${err.message}`);
      });
    }
}

function displayRentalInfo(responseJson, searchResults){
    $("#wrapper-start").hide();
    $("#wrapper-results").show();
    $(".js-results").append(`<h3>Result ${properties + 1}</h3>`);
    $(".js-results").append(`
      <section class="result js-result">
        <img src="${searchResults.properties[properties].thumbnail}" alt="${searchResults.properties[properties].address.line}">
        <p>Address: ${searchResults.properties[properties].address.line}</p>
        <p>Price: $${searchResults.properties[properties].price}</p>
        <p>Projected Monthly Rental Income: $${responseJson.rent}</p>
        <p>Projected Rate of Return: ${calculateRate(searchResults.properties[properties].price, responseJson.rent)}%</p>    
        <p><a href="${searchResults.properties[properties].rdc_web_url}">Learn more.</a></p>
      </section>`);
      properties++;
      $("#wrapper-results").on("click", ".js-new-search", function(){
        newSearch();
      });  
        
}

function newSearch(){
  $("#wrapper-start").show();
  properties = 0;
  watch();
}

function calculateRate(value, rent){
  const MONTHS_IN_YEAR = 12;
  return (((rent * MONTHS_IN_YEAR) / value)*100);
}

function clearInputs(){
  $(".js-city").val("");
  $(".js-state").val("");
  $(".js-price").val("");
  $(".js-beds").val("");
  $(".js-baths").val("");
  $(".js-sqft").val("");
  $(".js-results").val("");
  $(".js-error-message").html("");
}

function watch(){
    $(".js-error-msg").hide();
    $("#wrapper-results").hide();
    clearInputs();
    $(".js-form").submit(function(e){
      e.preventDefault();
      console.log("Watching");
      getListings();
    });
}

$(watch);