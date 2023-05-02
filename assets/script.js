const cityFormEl = document.querySelector("#city-form");
const cityInputEl = document.querySelector("#city-input");


function formSubmitHandler(event) {
  event.preventDefault();
  const city = cityInputEl.value.trim();

  if (city) {
    getLatLong(city);
    cityInputEl.value = "";
  } else {
    alert("Please enter a city");
  }
};

function getWeather(location) {
  var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=f3abb8e7ac5dca95fb34c9719d493299";

  fetch(apiUrl).then(function(response) {
    // request was succesful
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data, location)
      });
    }
  })
};

function displayWeather(city) {

}


cityFormEl.addEventListener("submit", formSubmitHandler);