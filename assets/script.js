var inputCity = '';
var currentDate = dayjs().format("(MM/DD/YYYY)");
$('#todaysDate').text(currentDate)
var previousCity = []

function getCords(url) {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var lon = data[0].lon;
            var lat = data[0].lat;
            var cords = [lat, lon]
            return cords
        })
        .then(function (data) {
            var weatherUrl = 'https://api.openweathermap.org/data/3.0/onecall?lat=' + data[0] + '&lon=' + data[1] + '&exclude=minutely,hourly&units=imperial&appid=fbbc0ff2ad4eb4bfe4580caab86f90b3'
            console.log(weatherUrl)
            fetch(weatherUrl)
                .then(function (response) {
                    return response.json()
                })
                .then(function (data) {
                    var weatherIcon = data.current.weather[0].icon;
                    var iconUrl = "http://openweathermap.org/img/w/" + weatherIcon + ".png";
                    $('#currentIcon').attr('src', iconUrl)
                    $('#cityName').text(inputCity + ' ' + currentDate)
                    $('#cityTemp').text('Temperature: ' + data.current.temp + '℉')
                    $('#cityWind').text('Wind: ' + data.current.wind_speed + 'MPH')
                    $('#cityHumidity').text('Humidity: ' + data.current.humidity + '%')
                    var forecastCards = $('.text-dark').length + 1
                    for (i = 1; i < forecastCards; i++) {
                        $('#day' + [i] + 'Date').text(dayjs.unix(data.daily[i].dt).format('MM/DD/YYYY'))
                        $('#day' + [i] + 'Temp').text('Temperature: ' + data.daily[i].temp.day + '℉')
                        $('#day' + [i] + 'Wind').text('Wind: ' + data.daily[i].wind_speed + 'MPH')
                        $('#day' + [i] + 'Humid').text('Humidity: ' + data.daily[i].humidity + '%')
                        var weatherIcon = data.daily[i].weather[0].icon;
                        var iconUrl = "http://openweathermap.org/img/w/" + weatherIcon + ".png";
                        $('#day' + [i] + 'icon').attr('src', iconUrl)
                    }
                })
        })
}

$('#searchBtn').on('click', function () {
    inputCity = $('#cityInput').val()
    var geoUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + inputCity + '&limit=1&appid=fbbc0ff2ad4eb4bfe4580caab86f90b3'
    getCords(geoUrl)
    if (previousCity.includes(inputCity)) {
        return
    } else {
        previousCity.push(inputCity)
        var number = previousCity.length - 1
        var btn = $('<button>', { class: 'history' + number + ' btn btn-secondary my-2 w-100', id: inputCity })
        btn.text(inputCity)
        $('#history').append(btn)
        localStorage.setItem("History", JSON.stringify(previousCity))
        $('#cityInput').val("")
        btn.on('click', function () {
            inputCity = $(this).attr('id')
            var geoUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + inputCity + '&limit=1&appid=fbbc0ff2ad4eb4bfe4580caab86f90b3'
            getCords(geoUrl)
        })
    }

})

function init() {
    var storedCities = JSON.parse(localStorage.getItem("History"));

    if (storedCities != null) {
        previousCity = storedCities;
    }

    for (i = 0; i < previousCity.length; i++) {
        var city = previousCity[i];

        var btn = $('<button>', { class: 'history' + [i] + ' btn btn-secondary my-2 w-100', id: city })
        btn.text(city)
        $('#history').append(btn)
    }
}

function watchHistory() {
    for (i = 0; i < previousCity.length; i++) {
        $('.history' + [i]).on('click', function () {
            inputCity = $(this).attr('id')
            var geoUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + inputCity + '&limit=1&appid=fbbc0ff2ad4eb4bfe4580caab86f90b3'
            getCords(geoUrl)
        })
    }
    return
}

init()
watchHistory() 