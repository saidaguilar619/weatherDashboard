const apiKey = "e56a9eded7bce5b55a739696279fa85f";
let currentCity = "San Diego";
const currentWeatherURL = "HTTPS://api.openweathermap.org/data/2.5/weather?q=" + currentCity + "&units=imperial&APPID=" + apiKey;
const currentForecastURL = "HTTPS://api.openweathermap.org/data/2.5/forecast?q=" + currentCity + "&units=imperial&APPID=" + apiKey;
let searchArr = JSON.parse(localStorage.getItem('searchArray'));
if(searchArr == null){
    searchArr = [];
}
console.log(searchArr);
// const currentDate = moment().format("MMMM Do, YYYY");
$(".cbtn").on("click", function(){
    currentCity = $(this).text();
    getCurrentWeather(currentCity);
   
})
$(".sbtn").on("click", function(){
    currentCity = $(".search").val();
    getCurrentWeather(currentCity);
    let newBtn = $("<button>").addClass("btn btn-secondary cbtn").attr("type","button").text(currentCity);
    newBtn.on("click", function(){
        currentCity = $(this).text();
        getCurrentWeather(currentCity);
    })
    $(".btn-group-vertical").append(newBtn);
    console.log(searchArr);
    searchArr.push(currentCity); 
    localStorage.setItem("searchArray",JSON.stringify(searchArr));
})
function setSearch(searchHistory){
    if(searchHistory.length !== 0){
        $(".btn-group-vertical").append("Search History:");
        for(let i = 0 ; i < searchHistory.length;i++){
            let newBtn = $("<button>").addClass("btn btn-secondary cbtn").attr("type","button").text(searchHistory[i]);
            newBtn.on("click", function(){
                currentCity = $(this).text();
                getCurrentWeather(currentCity);
            })
            $(".btn-group-vertical").append(newBtn);   
        } 
    }
}
function displayCurrentWeather(weatherData) {
    $(".city").text(weatherData.name);
    $(".temp").text("Temp: " + weatherData.main.temp);
    $(".humidity").text("Humidity: " + weatherData.main.humidity + "%");
    $(".windSpeed").text("Wind: " + weatherData.wind.speed + " MPH");
}
function getCurrentWeather(city){
        const currentWeatherURL = "HTTPS://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=" + apiKey;
        $.get(currentWeatherURL)
        .then(function(response) {
             displayCurrentWeather(response);
             lon = response.coord.lon;
             lat = response.coord.lat;
             getUVIndex(lon, lat);
            // const icon = "http://openweathermap.org/img/wn/" + res.weather[0].icon + "@2x.png"
            // $(".current-weather-icon").attr("src", icon)
            // console.log(icon)
        });
}
function getUVIndex(longitude, latitude) {
    lon = longitude;
    lat = latitude;
    const currentUVIURL = "HTTPS://api.openweathermap.org/data/2.5/uvi/forecast?appid=" +apiKey+ "&lat=" + lat + "&lon=" + lon+ "&cnt=1";
    $.get(currentUVIURL)
    .then(function(response) {  
        const uvIndex = response[0].value;
        $(".UVIndex").text("UV Index: " +uvIndex);
    });
}
// function getForecast(){
//     $.get(currentForecastURL)
//     .then(function(response) {  
//         for(let i = 0; i< 5;i++){
//             let temp = response[0].value;
//             let humid = response[0].value;
//             let tempString = "temp" + i;
//             let humidString = "humidity" + i;
//             // console.log(response);
//             // $(".UVIndex").text("UV Index: " +uvIndex);
//         }
//     });
// }

setSearch(searchArr);
getCurrentWeather(currentCity);
// getForecast();