var apiKey = "a2b942e27473feb75c8e65a585e71ec4";
var cityInputEl = document.querySelector('#city-input');
var formEl = document.querySelector('#city-form');
var todaysEl = document.querySelector('#todays-group');
var forecastEl = document.querySelector('#forescast-group');
var insertIconEl = document.querySelector('.icon');

var date = moment().format('(L)');

var formSubmitHandler = function(event) {
    event.preventDefault();

    var cityName = cityInputEl.value.trim();

    if (cityName) {
        fetchApi(cityName);
    }
    else {
        alert('Please enter a valid city.');
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

    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=daily&appid=" + apiKey;

    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            console.log(response);
            response.json().then(function(data) {
                console.log(data);
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

// var getWeather = function(lon, lat, city) {

//     var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=daily&appid=" + apiKey;

//     fetch(apiUrl)
//     .then(function(response) {
//         if (response.ok) {
//             console.log(response);
//             response.json().then(function(data) {
//                 console.log(data);

//                 icon = data.current.weather[0];
//                 icon.src = "http://openweathermap.org/img/wn/" + icon + ".png";

//                 var cityNameEl = document.createElement("li");
//                 cityNameEl.classList = "today";
//                 cityNameEl.setAttribute("id", "city");
//                 cityNameEl.textContent = city + " " + date + " " + data.current.weather[0].icon;
//                 todaysEl.appendChild(cityNameEl)

//                 displayWeather(data);
//             });
//         }
//         else {
//             alert('Error: ' + response.statusText);
//         }
//     })
//     .catch(function(error) {
//         alert('Unable to connect to OpenWeather');
//     });
// };

var displayWeather = function(data, city) {

    var cityNameEl = document.createElement("li");
    cityNameEl.classList = "today";
    cityNameEl.setAttribute("id", "city");
    cityNameEl.textContent = city + " " + date + " ";
    todaysEl.appendChild(cityNameEl);

    var icon = data.current.weather[0];
    var getIcon = document.createElement("img")
    getIcon.setAttribute("src", 'http://openweathermap.org/img/wn/' + icon + '.png');
    insertIconEl.appendChild(getIcon);


    var todaysTempEl = document.createElement("li");
    todaysTempEl.classList = "today";
    todaysTempEl.setAttribute("id", "temp");

    var todaysWindEl = document.createElement("li");
    todaysWindEl.classList = "today";
    todaysWindEl.setAttribute("id", "wind");

    var todaysHumidityEl = document.createElement("li");
    todaysHumidityEl.classList = "today";
    todaysHumidityEl.setAttribute("id", "humidity");
    
    var todaysUvEl = document.createElement("li");
    todaysUvEl.classList = "today";
    todaysUvEl.setAttribute("id", "uv");
}












formEl.addEventListener('submit', formSubmitHandler);