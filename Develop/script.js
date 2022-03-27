// Retrieves the current date 
var currentDate = moment().format("l");
// Creating variables associated with the next 5 days 
var day1 = moment().add(1, "days").format("l");
var day2 = moment().add(2, "days").format("l");
var day3 = moment().add(3, "days").format("l");
var day4 = moment().add(4, "days").format("l");
var day5 = moment().add(5, "days").format("l");
// Empty global variables
var city;
var cities;
// Loads most recently searched CITY from local storage 
function loadRecentCity() {
    var lastSearch = localStorage.getItem("recentSearch");
    if (lastSearch === true) { // if there was a search, then set the most recently searched city to lastSearch 
        city = lastSearch;
        search();
    } else {
        city = "Sydney"; // else, set the default city to Sydney 
        search();
    }
}
// Call the function to load the most recently searched CITY 
loadRecentCity()
// Loads most recently searched CITies from local storage 
function loadRecentCities() {
var recentCities = JSON.parse(localStorage.getItem("cities"));
    if (recentCities === true) { // if other citiies have been searched, set cities to those recently searched citiies  
        cities = recentCities;
    } else {
        cities = []; // else, cities will be an empty array 
    }
}
// Call the function to load the most recently searched CITIES  
loadRecentCities()
    
// When the "Search" button is clicked on the screen 
$("#submit").on("click", (searchButton) => {
    searchButton.preventDefault(); 
    getCityInput(); 
    search();
    $("#input-city").val("");
    listCities();
});

// To save recently searched cities to local storage 
function storeSearch() {
    localStorage.setItem("recentSearch", city);
    cities.push(city); // push searched city to cities array 
    localStorage.setItem("cities", JSON.stringify(cities));
}

//function to retrieve user inputted city name
function getCityInput() {
    city = $("#input-city").val(); // get the value of the user input 
    if (city && cities.includes(city) === false) { // the city inputted is not already in the list of cities, store the city in local storage 
        storeSearch();
        return city;
    } else if (!city) { // if there is no entered city name and the search button is clicked, then a pop up appears 
        alert("Please enter a valid city before clicking on Search");
    }
}
// Main search function using the OpenWeather One Call API to retrieve weather data 
function search() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=42d98d76405f5b8038f2ad71187af430";
    var coords = [];
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        // save city name, temperature, humidity and wind speed 
        var cityName = response.name;
        var cityTemperature = response.main.temp;
        var cityHumidity = response.main.humidity;
        var cityWindSpeed = response.wind.speed;
        // icone for the type of weather it is in the city 
        var icon = response.weather[0].icon;
        $("#icon").html(
        `<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`
        );
        $("#city-name").html(cityName + " " + "(" + currentDate + ")");
        $("#city-temp").text("Temp: " + cityTemperature.toFixed(1));
        $("#city-wind-speed").text("Wind: " + cityWindSpeed + "mph");
        $("#city-hum").text("Humidity: " + cityHumidity + "%");
        $("#date1").text(day1);
        $("#date2").text(day2);
        $("#date3").text(day3);
        $("#date4").text(day4);
        $("#date5").text(day5);
        coords.push(response.coord.lat); // push latitude 
        coords.push(response.coord.lon); // push longitude 
        getDailyForcast(response.coord.lat, response.coord.lon); // get UV based on latitude and longitude 
    }).fail(function (){ // if the function fails, display alert 
        alert("Sorry, we had trouble processing your request. Please refresh the page and try again.")
});

// get UV index for the selected city 
function getUV(lat,lon){ 
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly" + "&units=imperial&appid=42d98d76405f5b8038f2ad71187af430",
        method: "GET",
        }).then(function (response) {
            
        // get UV index 
        var UVIndex = response.current.uvi;
        $("#uv-index").text("UV Index:" + " " + UVIndex);
        if (UVIndex >= 8) {
            $("#uv-index").css("color", "red"); // severe 
        } else if (UVIndex > 4 && UVIndex < 8) {
            $("#uv-index").css("color", "yellow"); // moderate 
        } else {
            $("#uv-index").css("color", "green"); // favourable 
        }
    }) 
}
// To get the forecast for the next 5 days 
function getDailyForcast(lat, lon) {
        
    $.ajax({
    url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly" + "&units=imperial&appid=42d98d76405f5b8038f2ad71187af430",
    method: "GET",
    }).then(function (response) {

        // Call the UV index function 
        getUV(lat,lon); 
        
        // Display temperature in each card for upcoming 5 days 
        var day1Temperature = response.daily[1].temp.max;
        var day2Temperature = response.daily[2].temp.max;
        var day3Temperature = response.daily[3].temp.max;
        var day4Temperature = response.daily[4].temp.max;
        var day5Temperature = response.daily[5].temp.max;
        $("#temp1").text("Temp:" + " " + day1Temperature.toFixed(1));
        $("#temp2").text("Temp:" + " " + day2Temperature.toFixed(1));
        $("#temp3").text("Temp:" + " " + day3Temperature.toFixed(1));
        $("#temp4").text("Temp:" + " " + day4Temperature.toFixed(1));
        $("#temp5").text("Temp:" + " " + day5Temperature.toFixed(1));

        // Display humidity in each card for upcoming 5 days 
        var day1Humidity = response.daily[1].humidity;
        var day2Humidity = response.daily[2].humidity;
        var day3Humidity = response.daily[3].humidity;
        var day4Humidity = response.daily[4].humidity;
        var day5Humidity = response.daily[5].humidity;
        $("#hum1").text("Humidity:" + " " + day1Humidity + "%");
        $("#hum2").text("Humidity:" + " " + day2Humidity + "%");
        $("#hum3").text("Humidity:" + " " + day3Humidity + "%");
        $("#hum4").text("Humidity:" + " " + day4Humidity + "%");
        $("#hum5").text("Humidity:" + " " + day5Humidity + "%");

        // Display wind speed in each card for upcoming 5 days 
        var day1Wind = response.daily[1].wind_speed;
        var day2Wind = response.daily[2].wind_speed;
        var day3Wind = response.daily[3].wind_speed;
        var day4Wind = response.daily[4].wind_speed;
        var day5Wind = response.daily[5].wind_speed;
        $("#wind1").text("Wind:" + " " + day1Wind + " " + "mph");
        $("#wind2").text("Wind:" + " " + day2Wind + " " + "mph");
        $("#wind3").text("Wind:" + " " + day3Wind + " " + "mph");
        $("#wind4").text("Wind:" + " " + day4Wind + " " + "mph");
        $("#wind5").text("Wind:" + " " + day5Wind + " " + "mph");

        // Icons for each of the 5 days 
        var icon1 = response.daily[1].weather[0].icon;
        var icon2 = response.daily[2].weather[0].icon;
        var icon3 = response.daily[3].weather[0].icon;
        var icon4 = response.daily[4].weather[0].icon;
        var icon5 = response.daily[5].weather[0].icon; 
        // Icons for each of the 5 days 
        $("#icon1").html(
            `<img src="http://openweathermap.org/img/wn/${icon1}@2x.png">`
        );
        $("#icon2").html(
            `<img src="http://openweathermap.org/img/wn/${icon2}@2x.png">`
        );
        $("#icon3").html(
            `<img src="http://openweathermap.org/img/wn/${icon3}@2x.png">`
        );
        $("#icon4").html(
            `<img src="http://openweathermap.org/img/wn/${icon4}@2x.png">`
        );
        $("#icon5").html(
            `<img src="http://openweathermap.org/img/wn/${icon5}@2x.png">`
        );
    });
    }
}
// Render and display searched cities to page
function listCities() {
    $("#city-list").text("");
    cities.forEach((city) => {
        $("#city-list").prepend("<tr><td>" + city + "</td></tr>"); // in a vertical list 
    });
}

listCities();
    // When someone clicks on the name of the city 
    $(document).on("click", "td", (e) => {
    e.preventDefault();
    var listedCity = $(e.target).text();
    city = listedCity;
    search();
});

// When the "Clear" button is clicked on the screen 
$("#clear-button").click(() => {
    localStorage.removeItem("cities"); //remove that city from the list 
    loadRecentCities();
    listCities(); //
});


