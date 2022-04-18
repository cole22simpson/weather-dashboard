var apiKey = "a2b942e27473feb75c8e65a585e71ec4";
var cityInputEl = document.querySelector('#city-input');
var formEl = document.querySelector('#city-form');
var todaysEl = document.querySelector('#todays-group');
var forecastEl = document.querySelector('.five-day');
var recentsEl = document.querySelector('.recents');

var recentSearches = [];

var date = moment().format("(MM/DD/YYYY)");

var formSubmitHandler = function(event) {
    event.preventDefault();

    var cityName = cityInputEl.value.trim();

    if (cityName) {
        fetchApi(cityName);
    }
    else {
        alert('Please enter a city.');
    }
};

var fetchApi = function(city) {

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            console.log(response);
            response.json().then(function(data) {
                console.log(data);
                getCoordinates(data);
            });
        }
        else {
            alert('Error: ' + response.statusText);
        }
    })
    .catch(function(error) {
        alert('Unable to connect to OpenWeather');
    });
};

var getCoordinates = function(data) {
    var lon = data.coord.lon;
    var lat = data.coord.lat;
    var city = data.name;

    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;

    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            console.log(response);
            response.json().then(function(data) {
                console.log(data);
                recentSearches.push(city);
                displayWeather(data, city);
            });
        }
        else {
            alert('Error: ' + response.statusText);
        }
    })
    .catch(function(error) {
        alert('Unable to connect to OpenWeather');
    });
}


var displayWeather = function(data, city) {

    todaysEl.innerHTML = "";

    var temp = data.current.temp;
    var wind = data.current.wind_speed;
    var humidity = data.current.humidity;
    var uv = data.current.uvi;

    var cityNameEl = document.createElement("li");
    cityNameEl.classList = "today";
    cityNameEl.setAttribute("id", "city");
    cityNameEl.innerHTML = city + " " + date + "<span class='icon'></span>";
    todaysEl.appendChild(cityNameEl);

    var insertIconEl = document.querySelector('.icon');
    var icon = data.current.weather[0].icon;
    var getIcon = document.createElement("img");
    getIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");
    insertIconEl.appendChild(getIcon);

    var todaysTempEl = document.createElement("li");
    todaysTempEl.classList = "today";
    todaysTempEl.setAttribute("id", "temp");
    todaysTempEl.textContent = "Temp: " + temp;
    todaysEl.appendChild(todaysTempEl);

    var todaysWindEl = document.createElement("li");
    todaysWindEl.classList = "today";
    todaysWindEl.setAttribute("id", "wind");
    todaysWindEl.textContent = "Wind: " + wind;
    todaysEl.appendChild(todaysWindEl);

    var todaysHumidityEl = document.createElement("li");
    todaysHumidityEl.classList = "today";
    todaysHumidityEl.setAttribute("id", "humidity");
    todaysHumidityEl.textContent = "Humidity: " + humidity;
    todaysEl.appendChild(todaysHumidityEl);
    
    var todaysUvEl = document.createElement("li");
    todaysUvEl.classList = "today";
    todaysUvEl.setAttribute("id", "uv");

    if (uv <= 2) {
        todaysUvEl.innerHTML = "UV Index: <span class='btn low'>" + uv + "</span>";
    }
    else if (uv > 2 && uv <=5) {
        todaysUvEl.innerHTML = "UV Index: <span class='btn moderate'>" + uv + "</span>";
    }
    else if (uv > 5 && uv <= 7) {
        todaysUvEl.innerHTML = "UV Index: <span class='btn high'>" + uv + "</span>";
    }
    else if (uv > 7 && uv <= 10) {
        todaysUvEl.innerHTML = "UV Index: <span class='btn very-high'>" + uv + "</span>";
    }
    else {
        todaysUvEl.innerHTML = "UV Index: <span class='btn extreme'>" + uv + "</span>";
    }
    todaysEl.appendChild(todaysUvEl);

    displayForecast(data, city);
};

var displayForecast = function(data, city) {

    createRecent(city);
        
    forecastEl.innerHTML = "";
    
    for (var i = 0; i < 5; i++) {

        var forecastDate = moment().add(i + 1, 'days').format('MM/DD/YYYY');

        var id = i + 1;

        var forecastContainerEl = document.createElement("div");
        forecastContainerEl.classList = "forecast-boxes";
        forecastContainerEl.setAttribute("id", id);
        forecastEl.appendChild(forecastContainerEl);
        
        var ulEl = document.createElement("ul");
        ulEl.classList = "forecast-group";
        forecastContainerEl.appendChild(ulEl);

        var dateEl = document.createElement("li");
        dateEl.classList = "forecast-date";
        dateEl.textContent = (forecastDate);
        ulEl.appendChild(dateEl);

        var iconEl = document.createElement("img");
        iconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
        ulEl.appendChild(iconEl);

        var tempEl = document.createElement("li");
        tempEl.textContent = "Temp: " + data.daily[i].temp.day;
        ulEl.appendChild(tempEl);

        var windEl = document.createElement("li");
        windEl.textContent = "Wind: " + data.daily[i].wind_speed;
        ulEl.appendChild(windEl);

        var humidityEl = document.createElement("li");
        humidityEl.textContent = "Humidity: " + data.daily[i].humidity;
        ulEl.appendChild(humidityEl);

    }
};

var saveSearches = function() {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
};

var loadSearches = function() {
    var savedSearches = localStorage.getItem("recentSearches");

    if (!savedSearches) {
        return false;
    }
    console.log("Saved searches found!");

    savedSearches = JSON.parse(savedSearches);

    for (var i = 0; i < savedSearches.length; i++) {
        var searchIndex = savedSearches[i];
        loadRecents(searchIndex);
    }
};

var loadRecents = function(searchIndex) {
    var buttonEl = document.createElement("li");
    buttonEl.classList = ("past-search btn btn-secondary");
    buttonEl.textContent = (searchIndex);
    recentsEl.appendChild(buttonEl);
};

var createRecent = function(city) {
    var buttonEl = document.createElement("li");
    buttonEl.classList = ("past-search btn btn-secondary");
    buttonEl.textContent = (city);
    recentsEl.appendChild(buttonEl);
}

formEl.addEventListener('submit', formSubmitHandler);

loadSearches();