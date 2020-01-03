$(document).ready(function() {
  var apiKey = "fbf3f488e92dd780ee0ce2263cc539b5";
  var cityArr = [];

    getData();

  $("#search-btn").on("click", function(event) {
    event.preventDefault();
    clear()

    var city = $("#city-input").val();
    currentConditions(city);
    fiveDayForecast(city);

    cityArr.push(city)

    localStorage.setItem("city", cityArr);
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
      $(".uv-index").html("UV Index: " + '<span class="uv-index-number">' + uv + '</span>');

      // create if statement to color uv

        if (uv < 4) {
          $(".uv-index-number").css({ "background-color": "lime", color: "white", "padding": "3px" });
        } else if (uv >= 5 && uv <= 7) {
           $(".uv-index-number").css({ "background-color": "yellow", color: "black" });
        } else {
            $(".uv-index-number").css({ "background-color": "red", color: "white" });
        }
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

      for (var i = 0; i < response.list.length; i += 8) {

        var date = response.list[i].dt_txt;

        var formatDate = new Date(date);

        var temp = (response.list[i].main.temp - 273.15) * 1.8 + 32;
        var humidity = response.list[i].main.humidity;

        var icon = response.list[i].weather[0].icon;

        var fiveDayIconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"

        var newCard = $('<div class="card bg-light mb-3" style="max-width: 18rem;">').html(
            '<div class="card-body">' +
            '<h5 class="card-title" id="date">' +
            formatDate.toDateString() +
            "</h5>" +
            '<img src="' + fiveDayIconURL + '"/>' + 
            '<div class="card-text" id="temp-humidity">' +
            "Temperature: " +
            temp.toFixed(1) +
            "°F" +
            "<br>" +
            "Humidity: " +
            humidity +
            "%" +
            "</div>" +
            "</div>" + "</div>"
        );

        $("#5-day-forecast").append(newCard)

      }
    });
  }

  function clear() {
    $(".icon-image").empty();
    $("#5-day-forecast").empty();
  }

  $("#clear-all").on("click", clear);

  // local storage for search history/cities list
  // create buttons to click and append to city list


    function getData() {
      var searchHistory = localStorage.getItem("city");


      //loop through search history array, append each element in array as a button
    //   var b = $("<button>");
    //   b.addClass("btn btn-light");
    //   b.text(cityHistory);

      $("#cities-list").append(searchHistory)
    }

});
