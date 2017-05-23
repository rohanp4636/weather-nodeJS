const axios = require('axios');

var express = require('express');

var app = express();


const port = process.env.PORT || 3000;



app.get('/', (req, res) => {

  var address = "42 harte place";

  var encodedAddress = encodeURIComponent(address);
  var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`
  axios.get(geocodeUrl).then( (response) => {
    if(response.data.status === 'ZERO_RESULTS'){
      throw new Error('Unable to find that address.');
    }

    var lat = response.data.results[0].geometry.location.lat;
    var long = response.data.results[0].geometry.location.lng;
    var weatherUrl = `https://api.darksky.net/forecast/e4f4de4ba5614a6a3f3b41177e1f818b/${lat},${long}`;

    return axios.get(weatherUrl).then( (response) => {
      var temperature = response.data.currently.temperature;
      var apparentTemperature = response.data.currently.apparentTemperature;
      res.send( {
        address: address,
        temperature: temperature,
        apparentTemperature: apparentTemperature
      });

    });

  }).catch( (error) => {
    console.log(error);
    res.send('Ooops. Something went wrong.');

  });

});

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
