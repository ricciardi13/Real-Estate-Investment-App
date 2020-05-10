"use strict";

const zwsid = "X1-ZWz1hrt9sud7gr_4lr3d";

function validateInputs(){
    console.log("Validating");

}

function getListings(){
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
    let lineAddress = [];
    let zipcode = [];
    for (let i = 0; i < responseJson.properties.length; i++){
        lineAddress.push(responseJson.properties[i].address.line);
        lineAddress[i] = lineAddress[i].split(" ").join("+");
        zipcode.push(responseJson.properties[i].address.postal_code);
    }
    console.log(lineAddress);
    console.log(zipcode);
    for (let i = 0; i < responseJson.properties.length; i++){
        const url = `https://cors-anywhere.herokuapp.com/http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=${zwsid}&address=${lineAddress[i]}&citystatezip=${zipcode[i]}`;
        console.log(url);
        fetch(url)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then(responseJson => displayRentalInfo(responseJson))
        .catch(err => {
          $('.js-error-msg').text(`Something went wrong: ${err.message}`);
        });
    }
}

function displayRentalInfo(responseJson){
    console.log(responseJson);
}

function watch(){
    $(".js-form").submit(function(e){
        e.preventDefault();
        console.log("Watching");
        validateInputs();
        getListings();

    });
}

$(watch);