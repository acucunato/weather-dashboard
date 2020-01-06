$(document).ready(function() {

  var apiKey = "fbf3f488e92dd780ee0ce2263cc539b5";
  var cityArr = [];

  getSearchHistory();


  $("#search-btn").on("click", function(event) {

    event.preventDefault();

    var searchedCity = $("#city-input").val();

    // checks to make sure city is valid
    if (!searchedCity) {
      return null;
    }


    //get data for current conditions first, then append and grab all other functions
    getCurrentConditions(searchedCity)
    .then(function(currentConditions) {

      clear();
      appendCurrentConditions(currentConditions);
    })
    .then(function() {

      saveCityToSearchHistory(searchedCity);
      getSearchHistory();
    })
    .then(function() {

      getFiveDayForecast(searchedCity)
      .then(function(forecast) {

        appendFiveDayForecast(forecast);
      });
    })

    //must be a valid city
    .catch(function() {

      return $("#error-message").text("Sorry, that city could not be found. Please enter a valid city.");
    });

  });

  // make ajax call for current conditions
  function getCurrentConditions(city) {

    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&APPID=" +
      apiKey;

    return $.ajax({
      url: queryURL,
      method: "GET"
    });

  }

  function appendCurrentConditions(currentConditions) {

      // Append response data
      // city name & date
      $(".city-name").html(
        "<h2>" +
          currentConditions.name +
          " " +
          "(" +
          moment().format("L") +
          ")" +
          "</h2>"
      );

      // icon image
      var iconImg = $("<img>");
      $(".icon-image").append(
        iconImg.attr(
          "src",
          "https://openweathermap.org/img/wn/" +
            currentConditions.weather[0].icon +
            "@2x.png"
        )
      );

      //temp
      var tempF = (currentConditions.main.temp - 273.15) * 1.8 + 32;
      $(".temp").text("Temperature: " + tempF.toFixed(1) + "°F");
      //humidity
      $(".humidity").text("Humidity: " + currentConditions.main.humidity + "%");
      //wind speed
      $(".wind-speed").text("Windspeed: " + currentConditions.wind.speed + " MPH");

      //uv index
      var lon = currentConditions.coord.lon;
      var lat = currentConditions.coord.lat;

      // Set UV index
      uvIndex(lat, lon);
  }

  // uv index
  function uvIndex(lat, lon) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/uvi?appid=" +
      apiKey +
      "&lat=" +
      lat +
      "&lon=" +
      lon;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      var uv = response.value;
      $(".uv-index").html(
        "UV Index: " + '<span class="uv-index-number">' + uv + "</span>"
      );

      // create if statement to color uv

      if (uv < 4) {
        $(".uv-index-number").css({
          "background-color": "lime",
          color: "white",
          padding: "3px"
        });
      } else if (uv >= 5 && uv <= 7) {
        $(".uv-index-number").css({
          "background-color": "yellow",
          color: "black",
          padding: "3px"
        });
      } else {
        $(".uv-index-number").css({
          "background-color": "red",
          color: "white",
          padding: "3px"
        });
      }
    });
  }

  //ajax 5 day call 
  function getFiveDayForecast(city) {

    var queryURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&APPID=" +
      apiKey;

    return $.ajax({
      url: queryURL,
      method: "GET"
    });
  }

  // append ajax call 5 day
  function appendFiveDayForecast(forecast) {
      for (var i = 0; i < forecast.list.length; i += 8) {
        var date = forecast.list[i].dt_txt;
        var formatDate = moment(date).format("L");
        var temp = (forecast.list[i].main.temp_max - 273.15) * 1.8 + 32;
        var humidity = forecast.list[i].main.humidity;
        var icon = forecast.list[i].weather[0].icon;
        var fiveDayIconURL =
          "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        var newCard = $(
          '<div class="card bg-light ml-0 mb-3 mr-3" style="min-width: 200px;">'
        ).html(
          '<div class="card-body">' +
            '<h5 class="card-title" id="date">' +
            formatDate +
            "</h5>" +
            '<img src="' +
            fiveDayIconURL +
            '"/>' +
            '<div class="card-text" id="temp-humidity">' +
            "Temperature: " +
            temp.toFixed(2) +
            "°F" +
            "<br>" +
            "Humidity: " +
            humidity +
            "%" +
            "</div>" +
            "</div>" +
            "</div>"
        );

        $("#5-day-forecast").append(newCard);
      }
  }


  function clear() {
    $(".icon-image").empty();
    $("#5-day-forecast").empty();
    $("#city-input").val("");
    $("#error-message").empty();
  }

  $("#clear-all").on("click", clear);

  // Saves a city into local storage
  function saveCityToSearchHistory(city) {

      cityArr.push(city.toLowerCase());


      localStorage.setItem("city", JSON.stringify(cityArr));
  }

  // get data from local storage, create buttons
  function getSearchHistory() {

    var searchHistory = JSON.parse(localStorage.getItem("city"));

    if (!searchHistory) {
      return null;
    }

    //most updated array from local storage
    cityArr = searchHistory;

    $("#cities-list").empty();


    //create buttons for citites
    for (var i = 0; i < searchHistory.length; i++) {
      var cityButton = $("<button>");
      cityButton.addClass("btn btn-light city-btn m-2 d-block");
      cityButton.attr("data-name", searchHistory[i]);
      cityButton.text(searchHistory[i]); 


      $("#cities-list").append(cityButton); 
    }
  }


  // when city from local storage is clicked

  $(document).on("click", ".city-btn", function(event) {

    event.preventDefault();

    clear();

    var clickedCity = $(this).attr('data-name');



    // get conditions then append and get 5 day
    getCurrentConditions(clickedCity)
    .then(function(currentConditions) {
      appendCurrentConditions(currentConditions);
    })
    .then(function() {

      getFiveDayForecast(clickedCity)
      .then(function(forecast) {
        appendFiveDayForecast(forecast);
      });
    })

    //if api fails will append
    .catch(function() {

      return $("#error-message").text("An error occurred. Please try again.");
    });

  });

});