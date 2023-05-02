dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

const cityForm = document.querySelector("#city-form");
const cityInput = document.querySelector("#city-input");
const cityNameEl = document.querySelector("#city-name");
const currentDateEl = document.querySelector("#date");
const weatherIconEl = document.querySelector("#weather-icon");
const tempEl = document.querySelector("#temp");
const windEl = document.querySelector("#wind");
const humidityEl = document.querySelector("#humidity");
const uvIndexEl = document.querySelector("#uv-index");
const dailyWeatherEl = document.querySelector("#daily-weather");
const cityHistoryEl = document.querySelector("#city-history");

function formSubmitHandler(event) {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (city) {
    saveCityHistory(city);
    getWeather(city);
    cityInput.value = "";
    dailyWeatherEl.textContent = "";
    loadCityHistory();
  } else {
    alert("Please enter a city");
  }
}

function saveCityHistory(city) {
  if (typeof cityArray === "undefined") {
    cityArray = [];
  }
  cityArray.push(city);
  console.log(cityArray);
  localStorage.setItem("cityArray", JSON.stringify(cityArray));
}

function loadCityHistory() {
  const savedCityHistory = JSON.parse(localStorage.getItem("cityArray"));
  // console.log(savedCityHistory)

  if (savedCityHistory !== null) {
    cityArray = savedCityHistory;
  }
  if (typeof cityArray === "undefined") {
    cityArray = [];
  } else {
    for (let i = 0; i < cityArray.length; i++) {
      const button = document.createElement("button");
      button.classList = "btn btn-history w-100";
      button.textContent = cityArray[i];
      button.addEventListener("click", function () {
        getLatLong(cityArray[i]);
      });
      cityHistoryEl.appendChild(button);
    }
  }
}

function getWeather(location) {
  const apiUrl =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    location +
    "&appid=f3abb8e7ac5dca95fb34c9719d493299&units=imperial";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        getLatLong(data);
        displayWeather(data, location);
      });
    }
  });
}

function getLatLong(data) {
  const locationLat = data.coord.lat;
  const locationLon = data.coord.lon;
  const apiUrl =
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
        displayDailyWeather(data.daily, data.timezone);
      });
    }
  });
}

function displayWeather(data) {
  cityNameEl.textContent = data.name;
  tempEl.textContent = "Temp: " + data.main.temp + "°F";
  windEl.textContent = "Wind: " + data.wind.speed + " MPH";
  humidityEl.textContent = "Humidity: " + data.main.humidity + " %";

  const timezone = data.timezon;

  const rightNow = dayjs()
    .tz(timezone)
    .add(0, "day")
    .startOf("day")
    .format("M/D/YYYY");
  currentDateEl.textContent = rightNow;
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

function displayDailyWeather(dailyWeather, timezone) {
  for (let i = 1; i < 6; i++) {
    const card = document.createElement("div");
    const dateDailyEl = document.createElement("h5");
    const humidityDailyEl = document.createElement("p");
    const rightNow1 = dayjs()
      .tz(timezone)
      .add(i, "day")
      .startOf("day")
      .format("M/D/YYYY");
    const tempDailyEl = document.createElement("p");
    const windDailyEl = document.createElement("p");

    dateDailyEl.textContent = rightNow1;
    tempDailyEl.textContent = "Temp: " + dailyWeather[i].temp.day + "°F";
    windDailyEl.textContent = "Wind: " + dailyWeather[i].wind_speed + " MPH";
    humidityDailyEl.textContent =
      "Humidity: " + dailyWeather[i].humidity + " %";

    card.appendChild(dateDailyEl);
    card.appendChild(tempDailyEl);
    card.appendChild(windDailyEl);
    card.appendChild(humidityDailyEl);
    card.setAttribute("class", "col-md card");
    dailyWeatherEl.appendChild(card);
  }
}

loadCityHistory();
cityForm.addEventListener("submit", formSubmitHandler);
