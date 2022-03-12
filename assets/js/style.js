var searchCity = document.querySelector("#search-city");
var cityInput = document.querySelector("#city")
var api = 'http://api.openweathermap.org/data/2.5/weather?q=';
var apiKey = '&appid=f5ff263eeaa16377d5dcae5e7d801763';
var units = '&units=metric';
var search = document.getElementById("search")
var cityContainerEl = document.querySelector("#city-weather-info");
var citySearchTerm = document.querySelector(".details");
var forecastContainerEl = document.querySelector(".days-container");
var weatherImage = document.querySelector("#image")
var searchListCity = document.getElementsByTagName("li")
// console.log(searchListCity)

function cityInputValue(event) {
    event.preventDefault();

    var city = cityInput.value.trim();
    if (city) {

        getCityWeather(city);
        cityInput.value = "";
    } else {
        window.alert("Please enter a City Name");
    }
    // console.log(city)

}

function getCityWeather(city) {
    var wheatherUrl = api + city + apiKey + units;
    // console.log(wheatherUrl);
    fetch(wheatherUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // console.log(data);
                var mainlongitude = data.coord.lon;
                var mainlatitude = data.coord.lat;
                url='https://api.openweathermap.org/data/2.5/onecall?lat='+mainlatitude+'&lon='+mainlongitude+'&exclude=hourly, minutely'+'&appid=f5ff263eeaa16377d5dcae5e7d801763'+'&units=metric';
                fetch(url).then(function (responseMain) {
                    if (responseMain.ok) {
                        responseMain.json().then(function (dataMain) {
            
                            console.log(dataMain);
                            weatherInfo(dataMain, city);
                    
                            // console.log(temp);
                        })
                    }
                    else {
                        alert("No Forecast Info");
                    }

                })
                // console.log(temp);
            })
        }
        else {
            alert("City Not Found");
        }
    })
    //  console.log(response);
    // console.log(city);
}

var weatherInfo = function (retResult, cityInfo) {
    var currentlongitude = retResult.lon;
    var currentlatitude = retResult.lat;
    var indexUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + currentlatitude + '&lon' + currentlongitude + '&exclude=hourly, minutely' + apiKey + units;
    // console.log(indexUrl)
    cityContainerEl.textContent = cityInfo;
    citySearchTerm.textContent = "";


    // console.log(temp);
    // console.log(wind);
    // console.log(humidity);
    // console.log(cityInfo);
    // console.log(retResult);
    var tempInfo = retResult.current.temp;
    var windInfo = retResult.current.wind_speed;
    var humidityInfo = retResult.current.humidity;
    var longitude = retResult.lon;
    var latitude = retResult.lat;
    var currentDate = retResult.daily[0].dt;
    var d = new Date(currentDate * 1000);
    var formattedDate = ('0' + (d.getMonth() + 1)).slice(-2) + '/' + ('0' + d.getDate()).slice(-2) + '/' + d.getFullYear();
    var uvIndexInfo=retResult.current.uvi;
    //    console.log(formattedDate)

    // var text = d.toDateString();

    // console.log(text)
    // console.log(tempInfo);
    // console.log(windInfo);
    // console.log(humidityInfo);
    // console.log(longitude);
    // console.log(latitude);
    var infoEl = document.createElement("div");
    infoEl.classList = "details-whether-info";
    var tempD = document.createElement("p");
    var windD = document.createElement("p");
    var humidityD = document.createElement("p");
    var uvIndex = document.createElement("p");
    uvIndex.classList = "indexcolor";
    var todayDate = document.createElement("p");
    var imageTempD = document.createElement("img");
    imageTempD.classList = "weatherIcon";

    tempD.textContent = "Temp: " + Math.floor(tempInfo) + "°C";
    windD.textContent = "Wind: " + windInfo + " MPH";
    humidityD.textContent = "Humidity: " + humidityInfo + " %";
    uvIndex.textContent="UV Index: "+ uvIndexInfo;
    todayDate.textContent = formattedDate
    // console.log(currentDate*1000)

    if (uvIndexInfo<3){
        uvIndex.style.backgroundColor="green";
        uvIndex.style.width = "80px";
    }else if (5<uvIndexInfo<3)
    {
        uvIndex.style.backgroundColor="yellow";
        uvIndex.style.width = "80px";
    }
    else if (uvIndexInfo>6)
    {
        uvIndex.style.backgroundColor="red";
        uvIndex.style.width = "80px";
    }

    var id = retResult.current.weather[0].id;
    // console.log(id)
    if (id == 800) {
        imageTempD.src = "./assets/image/clear.svg";

    }
    else if (id >= 200 && id <= 232) {
        imageTempD.src = "./assets/image/storm.svg";

    }
    else if (id >= 600 && id <= 622) {
        imageTempD.src = "./assets/image/snow.svg";

    }
    else if (id >= 701 && id <= 781) {
        imageTempD.src = "./assets/image/haze.svg";

    }
    else if (id >= 801 && id <= 804) {
        imageTempD.src = "./assets/image/cloud.svg";

    }
    else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
        imageTempD.src = "./assets/image/rain.svg";
    }

    citySearchTerm.appendChild(infoEl);
    infoEl.appendChild(todayDate);
    infoEl.appendChild(imageTempD);
    infoEl.appendChild(tempD);
    infoEl.appendChild(windD);
    infoEl.appendChild(humidityD);
    infoEl.appendChild(uvIndex);
    weatherForecast(longitude, latitude)

}
var weatherForecast = function (long, lat) {
    var api = 'https://api.openweathermap.org/data/2.5/forecast?lat=';
    var apiKey = '&appid=f5ff263eeaa16377d5dcae5e7d801763';
    var units = '&units=metric';
    var forecastUrl = api + lat + '&lon=' + long + apiKey + units;
    // console.log(forecastUrl);

    fetch(forecastUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {

                // console.log(data);
                forecastContainerEl.textContent = "";
                displayForecast(data);
                // console.log(temp);
            })
        }
        else {
            alert("No Forecast Info");
        }

    })
}
var displayForecast = function (forecastDetails) {
    // console.log(forecastDetails);
    for (var i = 1; i < forecastDetails.list.length; i += 8) {

        var tempIn = forecastDetails.list[i].main.temp;
        var windIn = forecastDetails.list[i].wind.speed;
        var humidityIn = forecastDetails.list[i].main.humidity;
        var forecastDate = new Date(forecastDetails.list[i].dt * 1000);
        // var forecastDate = new Date(forecastDetails.list[i].dt * 1000).toDateString();
        forecastDate = ('0' + (forecastDate.getMonth() + 1)).slice(-2) + '/' + ('0' + forecastDate.getDate()).slice(-2) + '/' + forecastDate.getFullYear()
        // forecastDetails.list.weather[0].id.forEach(id=>{
        //     var weatherId = forecastDetails.list[i].weather[0].id;
        //     console.log(weatherId)
        // })
        // console.log(forecastDate)

        var weatherId = forecastDetails.list[i].weather[0].id;

        // console.log(tempIn);
        // console.log(windIn);
        // console.log(humidityIn);
        // console.log(forecastDate);

        var forecastInfoEl = document.createElement("div");
        forecastInfoEl.classList = "further-container";
        var forecastTempD = document.createElement("p");
        var forecastWindD = document.createElement("p");
        var forecastHumidityD = document.createElement("p");
        var futureDate = document.createElement("p");
        var imageIcon = document.createElement("img");
        imageIcon.classList = "weatherIcon";
        forecastTempD.textContent = "Temp: " + Math.floor(tempIn) + "°C";
        forecastWindD.textContent = "Wind: " + windIn + " MPH";
        forecastHumidityD.textContent = "Humidity: " + humidityIn + " %";
        futureDate.textContent = forecastDate

        // console.log(weatherId)

        if (weatherId == 800) {
            imageIcon.src = "./assets/image/clear.svg";

        }
        else if (weatherId >= 200 && weatherId <= 232) {
            imageIcon.src = "./assets/image/storm.svg";

        }
        else if (weatherId >= 600 && weatherId <= 622) {
            imageIcon.src = "./assets/image/snow.svg";

        }
        else if (weatherId >= 701 && weatherId <= 781) {
            imageIcon.src = "./assets/image/haze.svg";

        }
        else if (weatherId >= 801 && weatherId <= 804) {
            imageIcon.src = "./assets/image/cloud.svg";

        }
        else if ((weatherId >= 300 && weatherId <= 321) || (weatherId >= 500 && weatherId <= 531)) {
            imageIcon.src = "./assets/image/rain.svg";
        }

        forecastContainerEl.appendChild(forecastInfoEl);
        forecastInfoEl.appendChild(futureDate);
        forecastInfoEl.appendChild(imageIcon);
        forecastInfoEl.appendChild(forecastTempD);
        forecastInfoEl.appendChild(forecastWindD);
        forecastInfoEl.appendChild(forecastHumidityD);

    }
}

var searchCity = function (e) {
    var cityname = e.target.innerText;

    getCityWeather(cityname)

    // console.log(typeof cityName);
}

search.addEventListener("click", cityInputValue);

for (var i = 0; i < searchListCity.length; i++) {

    searchListCity[i].addEventListener("click", searchCity)
}



