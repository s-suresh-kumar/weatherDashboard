function initPage() {
  const inputEl = document.getElementById("city-input");
  const searchEl = document.getElementById("search-button");
  const clearEl = document.getElementById("clear-history");
  const nameEl = document.getElementById("city-name");
  const currentPicEl = document.getElementById("current-pic");
  const currentTempEl = document.getElementById("temperature");
  const currentHumidityEl = document.getElementById("humidity");
  const currentWindEl = document.getElementById("wind-speed");
  const currentUVEl = document.getElementById("UV-index");
  const historyEl = document.getElementById("history");
  let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

  console.log(searchHistory);

  const APIKey = "452691537bbf409c6544c02c76a1f6ad";
  //  When search button is clicked, read the city name typed by the user

  function getWeather(cityName) {
    //  Using saved city name, execute a current condition get request from open weather map api

    let queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=" +
      APIKey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      //  Parse response to display current conditions

      //  Method for using "date" objects obtained from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
      response.data = response;
      const currentDate = new Date(response.data.dt * 1000);
      //const currentDate = new Date(response.daily[0].dt * 1000);
      console.log(currentDate);
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      nameEl.innerHTML =
        response.data.name + " (" + month + "/" + day + "/" + year + ") ";

      let weatherPic = response.data.weather[0].icon;
      //    let weatherPic = response.daily[0].weather[0].icon;
      currentPicEl.setAttribute(
        "src",
        "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png"
      );

      currentPicEl.setAttribute("alt", response.data.weather[0].description);

      currentTempEl.innerHTML =
        "Temperature: " + k2f(response.data.main.temp) + " &#176F";

      currentHumidityEl.innerHTML =
        "Humidity: " + response.data.main.humidity + "%";

      currentWindEl.innerHTML =
        "Wind Speed: " + response.data.wind.speed + " MPH";

      let lat = response.data.coord.lat;

      let lon = response.data.coord.lon;

      // let UVQueryURL =
      //   "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" +
      //   lat +
      //   "&lon=" +
      //   lon +
      //   "&appid=" +
      //   APIKey +
      //   "&cnt=1";

      let UVQueryURL =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&exclude=current,minutely,hourly&appid=" +
        APIKey;

      // let UVQueryURL = "http://api.openweathermap.org/v3/uvi/" + lat + ",";
      // lon + "current.json?appid=" + APIKey;
      // http://api.openweathermap.org/v3/uvi/{lat},{lon}/current.json?appid={your-api-key

      //let response;
      $.ajax({
        url: UVQueryURL,
        method: "GET",
      }).then(function (response) {
        const currentDateUV = new Date(response.daily[0].dt * 1000);
        let UVIndex = document.createElement("span");
        console.log("UVRESPONSE:", response);
        //The following provide appropriate color coding for the UV-index field,
        //based on fetched UVI values from response.
        const uvi = Math.round(response.daily[0].uvi);
        if (uvi <= 2) {
          UVIndex.setAttribute("style", "background-color:green");
        } else if (uvi >= 3 && uvi <= 5) {
          UVIndex.setAttribute("style", "background-color:yellow");
        } else if (uvi >= 6 && uvi <= 7) {
          UVIndex.setAttribute("style", "background-color:orange");
        } else if (uvi >= 8 && uvi <= 10) {
          UVIndex.setAttribute("style", "background-color:red");
        } else if (uvi >= 11) {
          UVIndex.setAttribute("style", "background-color:indigo");
        }

        UVIndex.innerHTML = response.daily[0].uvi;
        currentUVEl.innerHTML = "UV Index: ";
        currentUVEl.append(UVIndex);
        //      });

        //  Using saved city name, execute a 5-day forecast get request from open weather map api
        // console.log("BFRE-CITIID", response);
        // let cityID = response.data.id;

        // let forecastQueryURL =
        //   "https://api.openweathermap.org/data/2.5/forecast?id=" +
        //   cityID +
        //   "&appid=" +
        //   APIKey;

        // $.ajax({
        //   url: forecastQueryURL,
        //   method: "GET",
        // })
        //   //After data comes back from the request
        //   .then(function (response) {
        //        .then(function(response) {

        //  Parse response to display forecast for next 5 days underneath current conditions

        console.log("raw response 5 day:", response);
        // response.data = response;
        // console.log("response.data:", response.data);
        const forecastEls = document.querySelectorAll(".forecast");

        // for (i = 0; i < forecastEls.length; i++) {
        //   forecastEls[i].innerHTML = "";

        //   const forecastIndex = i * 8 + 4;

        //   const forecastDate = new Date(
        //     response.data.list[forecastIndex].dt * 1000
        //   );
        // Get five day forecast
        for (i = 0; i < 5; i++) {
          forecastEls[i].innerHTML = "";
          const forecastIndex = i;
          const forecastDate = new Date(
            response.daily[forecastIndex].dt * 1000
          );
          const forecastDay = forecastDate.getDate();
          const forecastMonth = forecastDate.getMonth() + 1;
          const forecastYear = forecastDate.getFullYear();
          const forecastDateEl = document.createElement("p");

          forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");

          forecastDateEl.innerHTML =
            forecastMonth + "/" + forecastDay + "/" + forecastYear;

          forecastEls[i].append(forecastDateEl);

          const forecastWeatherEl = document.createElement("img");

          // forecastWeatherEl.setAttribute(
          //   "src",
          //   "https://openweathermap.org/img/wn/" +
          //     response.data.list[forecastIndex].weather[0].icon +
          //     "@2x.png"
          // );

          forecastWeatherEl.setAttribute(
            "src",
            "https://openweathermap.org/img/wn/" +
              response.daily[forecastIndex].weather[0].icon +
              "@2x.png"
          );
          forecastWeatherEl.setAttribute(
            "alt",
            response.daily[forecastIndex].weather[0].description
          );

          forecastEls[i].append(forecastWeatherEl);

          const forecastTempEl = document.createElement("p");
          //console.log("TEMP = ", response.data.list[forecastIndex].main.temp);
          console.log("TEMP = ", response.daily[forecastIndex].temp.max);
          forecastTempEl.innerHTML =
            "Temp: " + k2f(response.daily[forecastIndex].temp.max) + " &#176F";

          forecastEls[i].append(forecastTempEl);

          const forecastHumidityEl = document.createElement("p");

          // forecastHumidityEl.innerHTML =
          //   "Humidity: " +
          //   response.data.list[forecastIndex].main.humidity +
          //   "%";
          forecastHumidityEl.innerHTML =
            "Humidity: " + response.daily[forecastIndex].humidity + "%";

          forecastEls[i].append(forecastHumidityEl);
        }
      });
    });
  }

  searchEl.addEventListener("click", function () {
    const searchTerm = inputEl.value;

    getWeather(searchTerm);

    searchHistory.push(searchTerm);

    localStorage.setItem("search", JSON.stringify(searchHistory));

    renderSearchHistory();
  });

  clearEl.addEventListener("click", function () {
    searchHistory = [];

    renderSearchHistory();
  });

  function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
  }

  function renderSearchHistory() {
    historyEl.innerHTML = "";

    for (let i = 0; i < searchHistory.length; i++) {
      const historyItem = document.createElement("input");

      // <input type="text" readonly class="form-control-plaintext" id="staticEmail" value="email@example.com"></input>

      historyItem.setAttribute("type", "text");

      historyItem.setAttribute("readonly", true);

      historyItem.setAttribute("class", "form-control d-block bg-white");

      historyItem.setAttribute("value", searchHistory[i]);

      historyItem.addEventListener("click", function () {
        getWeather(historyItem.value);
      });

      historyEl.append(historyItem);
    }
  }

  renderSearchHistory();

  if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
  }

  //  Save user's search requests and display them underneath search form

  //  When page loads, automatically generate current conditions and 5-day forecast for the last city the user searched for
}

initPage();
