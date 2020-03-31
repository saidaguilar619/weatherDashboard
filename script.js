const apiKey = "e56a9eded7bce5b55a739696279fa85f";
let currentCity = "San Diego";
const currentWeatherURL = "HTTPS://api.openweathermap.org/data/2.5/weather?q=" + currentCity + "&units=imperial&APPID=" + apiKey;
const currentForecastURL = "HTTPS://api.openweathermap.org/data/2.5/forecast?q=" + currentCity + "&units=imperial&APPID=" + apiKey;
let searchArr = JSON.parse(localStorage.getItem('searchArray'));
if(searchArr == null){
    searchArr = [];
}
const currentDate = moment().format("ddd (M-D)");
//check
$(".date").text(currentDate);

$(".cbtn").on("click", function(){
    currentCity = $(this).text();
    getCurrentWeather(currentCity);
    getForecast(currentCity);
})

$(".sbtn").on("click", function(){
    currentCity = $(".search").val();
    getCurrentWeather(currentCity);
    let newBtn = $("<button>").addClass("btn btn-secondary cbtn").attr("type","button").text(currentCity);
    newBtn.on("click", function(){
        currentCity = $(this).text();
        getCurrentWeather(currentCity);
    })
    $(".btn-group-vertical").append(newBtn)
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
    let icon = "http://openweathermap.org/img/w/" + weatherData.weather[0].icon + ".png";
    $(".city").text(weatherData.name);
    $(".temp").text("Temp: " + weatherData.main.temp + " F");
    $(".humidity").text("Humidity: " + weatherData.main.humidity + "%");
    $(".windSpeed").text("Wind: " + weatherData.wind.speed + " MPH");
    $(".icon").attr("src", icon);
}

function getCurrentWeather(city){
        const currentWeatherURL = "HTTPS://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=" + apiKey;
        getForecast(city);
        $.get(currentWeatherURL)
        .then(function(response) {
             displayCurrentWeather(response);
             lon = response.coord.lon;
             lat = response.coord.lat;
             getUVIndex(lon, lat);
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
        if (response[0].value < 2){
            $(".UVIndex").css("background-color", "green");
        }else if(response[0].value >= 2 && response[0].value < 5 ){
            $(".UVIndex").css("background-color", "yellow");
        }else if(response[0].value >= 5 && response[0].value < 7 ){
            $(".UVIndex").css("background-color", "orange");
        }else{
            $(".UVIndex").css("background-color", "red");
        }
    });
}

function getForecast(city1){
    const currentForecastURL = "HTTPS://api.openweathermap.org/data/2.5/forecast?q=" + city1 + "&units=imperial&APPID=" + apiKey;
    $.get(currentForecastURL)
    .then(function(response) {  
        for(let i = 0; i< 5;i++){
            let iconURL = "http://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png";
            let temp = response.list[i].main.temp;
            let humid = response.list[i].main.humidity;
            let tempString = ".temp" + i;
            let humidString = ".humidity" + i;
            let dateString = ".date" + i;
            let icons = ".icon" + i;
            $(dateString).text(moment().add(i + 1, 'd').format("ddd(M-D)"));
            $(tempString ).text("Temp: " + temp + " F");
            $(humidString ).text("Humidity: " + humid + "%");
            $(icons).attr("src", iconURL);
        }
    });
}

setSearch(searchArr);
getCurrentWeather(currentCity);
getForecast(currentCity);