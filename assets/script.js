const cityForm = document.querySelector("#city-form");
const cityInput = document.querySelector("#city-input");
const cityNameEl = document.querySelector("#city-name");
const currentDateEl = document.querySelector("#date");
const weatherIconEl = document.querySelector("#weather-icon");
const tempEl = document.querySelector("#temp");
const windEl = document.querySelector("#wind");
const humidityEl = document.querySelector("#humidity");
const uvIndexEl = document.querySelector("#uv-index");
const currentDate = new Date();

function formSubmitHandler(event) {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (city) {
    getWeather(city);
    cityInput.value = "";
  } else {
    alert("Please enter a city");
  }
}

function getWeather(location) {
  const apiUrl =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    location +
    "&appid=f3abb8e7ac5dca95fb34c9719d493299&units=imperial";

  fetch(apiUrl).then(function (response) {
    // request was succesful
    if (response.ok) {
      response.json().then(function (data) {
        getLatLong(data, location);
        displayWeather(data, location);
        showDate();
      });
    }
  });
}

function getLatLong(data) {
  var locationLat = data.coord.lat;
  var locationLon = data.coord.lon;
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    locationLat +
    "&lon=" +
    locationLon +
    "&appid=f3abb8e7ac5dca95fb34c9719d493299&units=imperial";

  fetch(apiUrl).then(function (response) {
    // request was succesful
    if (response.ok) {
      response.json().then(function (data) {
        displayUV(data);
      });
    }
  });
}

function showDate() {
  const rightNow = moment().format("(M/D/YYYY)");
  currentDateEl.textContent = rightNow;
}

function displayWeather(data) {
  cityNameEl.textContext = data.name;
  tempEl.textContent = "Temp: " + data.main.temp + "°F";
  windEl.textContent = "Wind: " + data.wind.speed + " MPH";
  humidityEl.textContent = "Humidity: " + data.main.humidity + " %";
  const iconCode = data.weather[0].icon;
  const iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
  $("#wicon").attr("src", iconUrl);
  console.log(data.weather[0].icon);
}

function displayUV(data) {
  uvIndexEl.textContent = "UV Index: " + data.current.uvi;

  if (data.current.uvi <= 2) {
    uvIndexEl.classList = "uv-low";
  } else if (data.current.uvi >= 3 && data.current.uvi <= 5) {
    uvIndexEl.classList = "uv-med";
  } else if (data.current.uvi >= 6 && data.current.uvi <= 7) {
    uvIndexEl.classList = "uv-high";
  } else if (data.current.uvi >= 8 && data.current.uvi <= 11) {
    uvIndexEl.classList = "uv-extreme";
  }
}

cityForm.addEventListener("submit", formSubmitHandler);
