$(document).ready(function() {
  var apiKey = "324773921bd1cd43b3d09ecbadf929e8";

  $("#search-btn").on("click", function(event) {
    event.preventDefault();
    var city = $("#city-input").val();

    currentConditions(city);

    // make ajax call for current conditions

    function currentConditions(city) {
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
  });

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
    });
  }


  // local storage for search history/cities list

  // ajax call for 5 day forecast

  // 5 day forecast
  // search history
});
