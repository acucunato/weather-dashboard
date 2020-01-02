$(document).ready(function() {
  var apiKey = "fbf3f488e92dd780ee0ce2263cc539b5";

    getData();

  $("#search-btn").on("click", function(event) {
    event.preventDefault();
    // clear();

    var city = $("#city-input").val();
    currentConditions(city);
    fiveDayForecast(city);

    localStorage.setItem("city", city);
  });

  // make ajax call for current conditions

  function currentConditions(city) {
    var city = $("#city-input").val();

    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&APPID=" +
      apiKey;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      // city name & date
      $(".city-name").html(
        "<h2>" +
          response.name +
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
          "http://openweathermap.org/img/wn/" +
            response.weather[0].icon +
            "@2x.png"
        )
      );

      //temp
      var tempF = (response.main.temp - 273.15) * 1.8 + 32;
      $(".temp").text("Temperature: " + tempF.toFixed(1) + "°F");
      //humidity
      $(".humidity").text("Humidity: " + response.main.humidity + "%");
      //wind speed
      $(".wind-speed").text("Windspeed: " + response.wind.speed + " MPH");

      //uv index
      var lon = response.coord.lon;
      var lat = response.coord.lat;

      uvIndex(lat, lon);
    });
  }

  // uv index
  function uvIndex(lat, lon) {
    var queryURL =
      "http://api.openweathermap.org/data/2.5/uvi?appid=" +
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
      $(".uv-index").text("UV Index: " + uv);
      // create if statement to color uv

      //   if (uv < 4) {
      //     $(uv).css({ "background-color": "lime", color: "white" });
      //   } else if (uv >= 5 && uv <= 7) {
      //     $(uv).removeClass("low");
      //     $(uv).addClass("medium");
      //   } else {
      //     $(uv).removeClass("low");
      //     $(uv).removeClass("medium");
      //     $(uv).addClass("high");
      //   }
    });
  }

  function fiveDayForecast(city) {
    var city = $("#city-input").val();
    var queryURL =
      "http://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&APPID=" +
      apiKey;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);

      for (var i = 0; i < response.list.length; i += 8) {

        var date = response.list[i].dt_txt;
        //format date
        var temp = (response.list[i].main.temp - 273.15) * 1.8 + 32;
        var humidity = response.list[i].main.humidity;


        $("#5-day-forecast").html(
          '<div class= "card-deck">' +
            '<div class="card bg-light mb-3" style="max-width: 18rem;">' +
            '<div class="card-body">' +
            '<h5 class="card-title" id="date">' +
            date +
            "</h5>" +
            '<div class="icon"></div>' +
            '<div class="card-text" id="temp-humidity">' +
            "Temperature: " +
            temp.toFixed(1) +
            "°F" +
            "<br>" +
            "Humidity: " +
            humidity +
            "%" +
            "</div>" +
            "</div></div></div>"
        );

        var icon = response.list[i].weather[0].icon;

        var fivedayicon = $("<img>");
        $(".icon").append(
          fivedayicon.attr(
            "src",
            "http://openweathermap.org/img/wn/" + icon + "@2x.png"
          )
        );

        // $("#date").append(date);

        // var temp = (response.list[i].main.temp - 273.15) * 1.8 + 32;
        // $("#temp-humidity").append("Temperature: " + temp.toFixed(1) + "°F")

        // var humidity = response.list[i].main.humidity;
        // $("#temp-humidity").append("Humidity: " + humidity + "%")
      }
    });
  }

  function clear() {
    $("#current-conditions").empty();
    $("#5-day-forecast").empty();
  }

  $("#clear-all").on("click", clear);

  // local storage for search history/cities list

    function getData() {
      var searchHistory = localStorage.getItem("city");
      var b = $("<button>");
      b.

      $("#cities-list")
    }

  // ajax call for 5 day forecast

  // 5 day forecast
  // search history
});
