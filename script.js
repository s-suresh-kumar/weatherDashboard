function initPage() {
  const inputEl = $("#city-input");
  const searchEl = $("#search-button");
  const clearEl = $("#clear-history");
  const nameEl = $("#city-name");
  const currentPicEl = $("#current-pic");
  const currentTempEl = $("#temperature");
  const currentHumidityEl = $("#humidity");
  4;

  const currentWindEl = $("#wind-speed");
  const currentUVEl = $("#UV-index");
  const historyEl = $("#history");
  let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

  console.log(searchHistory);

  //const APIKey = "c9a9ed03a355403f4cb9a36e931c0b4a";
  const APIKey = "452691537bbf409c6544c02c76a1f6ad";
  //  When search button is clicked, read the city name typed by the user

  function getWeather(cityName) {
    //  Using saved city name, execute a current condition get request from open weather map api

    let queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=" +
      APIKey;
    console.log("QUERYURL-30:", queryURL);
    // axios
    //   .get(queryURL)
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      //  Parse response to display current conditions

      //  Method for using "date" objects obtained from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
      // response.data = response;
      const currentDate = new Date(response.dt * 1000);

      console.log(currentDate);

      const day = currentDate.getDate();

      const month = currentDate.getMonth() + 1;

      const year = currentDate.getFullYear();

      nameEl.text(response.name + " (" + month + "/" + day + "/" + year + ") ");

      let weatherPic = response.weather[0].icon;

      currentPicEl.attr(
        "src",
        "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png"
      );

      currentPicEl.attr("alt", response.weather[0].description);

      currentTempEl.text("Temperature: " + k2f(response.main.temp) + " &#176F");

      currentHumidityEl.text("Humidity: " + response.main.humidity + "%");

      currentWindEl.text("Wind Speed: " + response.wind.speed + " MPH");

      let lat = response.coord.lat;

      let lon = response.coord.lon;

      let UVQueryURL =
        "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        APIKey +
        "&cnt=1";
      console.log("UVQUERYURL-83:", UVQueryURL);
      //   axios
      //     .get(UVQueryURL)
      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (response) {
        let UVIndex = $("<span>");
        console.log("UVRESPONSE:", response);
        UVIndex.attr("class", "badge badge-danger");
        //response = response.data;
        UVIndex.text(response.value);

        currentUVEl.text("UV Index: ");

        currentUVEl.append(UVIndex);
      });

      //  Using saved city name, execute a 5-day forecast get request from open weather map api

      let cityID = response.id;

      let forecastQueryURL =
        "https://api.openweathermap.org/data/2.5/forecast?id=" +
        cityID +
        "&appid=" +
        APIKey;

      //   axios
      //     .get(forecastQueryURL)
      $.ajax({
        url: forecastQueryURL,
        method: "GET",
      })
        //After data comes back from the request
        .then(function (response) {
          //        .then(function(response) {

          //  Parse response to display forecast for next 5 days underneath current conditions

          console.log("5DAY forecast:", response);
          //response.data = response;
          const forecastEls = $(".forecast");
          console.log("FE_length", forecastEls.length);
          for (i = 0; i < forecastEls.length; i++) {
            jQuery(forecastEls[i]).html("");

            const forecastIndex = i * 8 + 4;

            const forecastDate = new Date(
              response.list[forecastIndex].dt * 1000
            );

            const forecastDay = forecastDate.getDate();
            console.log("TYPEOF:", typeof forecastDate.getDate());

            const forecastMonth = forecastDate.getMonth() + 1;

            const forecastYear = forecastDate.getFullYear();

            const forecastDateEl = $("<p>");

            forecastDateEl.attr("class", "mt-3 mb-0 forecast-date");
            console.log("forecastDay:", forecastDay);
            console.log(
              "entiredate:",
              forecastMonth.toString() +
                "/" +
                forecastDay.toString() +
                "/" +
                forecastYear.toString()
            );
            forecastDateEl.text(
              forecastMonth.toString() +
                "/" +
                forecastDay.toString() +
                "/" +
                forecastYear.toString()
            );
            forecastEls[i].append(forecastDateEl);

            const forecastWeatherEl = $("<img>");

            forecastWeatherEl.attr(
              "src",
              "https://openweathermap.org/img/wn/" +
                response.list[forecastIndex].weather[0].icon +
                "@2x.png"
            );

            forecastWeatherEl.attr(
              "alt",
              response.list[forecastIndex].weather[0].description
            );

            forecastEls[i].append(forecastWeatherEl);

            const forecastTempEl = $("<p>");

            forecastTempEl.html(
              "Temp: " + k2f(response.list[forecastIndex].main.temp) + " &#176F"
            );

            forecastEls[i].append(forecastTempEl);

            const forecastHumidityEl = $("<p>");

            forecastHumidityEl.html(
              "Humidity: " + response.list[forecastIndex].main.humidity + "%"
            );

            forecastEls[i].append(forecastHumidityEl);
          }
        });
    });
  }

  searchEl.on("click", function () {
    const searchTerm = inputEl.val().trim();

    getWeather(searchTerm);

    searchHistory.push(searchTerm);

    localStorage.setItem("search", JSON.stringify(searchHistory));

    renderSearchHistory();
  });

  clearEl.on("click", function () {
    searchHistory = [];

    renderSearchHistory();
  });

  function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
  }

  function renderSearchHistory() {
    historyEl.html("");

    for (let i = 0; i < searchHistory.length; i++) {
      const historyItem = $("<input>");

      // <input type="text" readonly class="form-control-plaintext" id="staticEmail" value="email@example.com"></input>

      historyItem.attr("type", "text");

      historyItem.attr("readonly", true);

      historyItem.attr("class", "form-control d-block bg-white");

      historyItem.attr("value", searchHistory[i]);

      historyItem.on("click", function () {
        getWeather(historyItem.val().trim());
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
