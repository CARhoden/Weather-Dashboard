let inputCity = '';
const currentDate = dayjs().format("(MM/DD/YYYY)");
const $todaysDate = $('#todaysDate');
const $history = $('#history');
const previousCity = JSON.parse(localStorage.getItem("History")) || [];

async function getLocationCoordinates(city) {
    try {
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=33419229afcf48474dbe9c7c3a1094ed`;
        const response = await fetch(geoUrl);
        const data = await response.json();
        if (data.length > 0) {
            const { lat, lon } = data[0];
            return [lat, lon];
        }
    } catch (error) {
        console.error('Error fetching location coordinates:', error);
    }
    return null;
}

function updateForecastCard(day, data) {
    $(`#d${day}Date`).text(dayjs.unix(data.daily[day - 1].dt).format('MM/DD/YYYY'));
    $(`#d${day}Temp`).text(`Temperature: ${data.daily[day - 1].temp.day}℉`);
    $(`#d${day}Wind`).text(`Wind: ${data.daily[day - 1].wind_speed}MPH`);
    $(`#d${day}Humid`).text(`Humidity: ${data.daily[day - 1].humidity}%`);
}

async function fetchWeatherAndRender(city) {
    try {
        const [lat, lon] = await getLocationCoordinates(city);
        if (lat && lon) {
            const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=33419229afcf48474dbe9c7c3a1094ed`;
            console.log("Weather URL:", weatherUrl);
            const response = await fetch(weatherUrl);
            const data = await response.json();
            console.log("Weather Data:", data);

            $('#cityName').text(city + ' ' + currentDate);
            $('#cityTemp').text(`Temperature: ${data.current.temp}℉`);
            $('#cityWind').text(`Wind: ${data.current.wind_speed}MPH`);
            $('#cityHumidity').text(`Humidity: ${data.current.humidity}%`);
            const weatherIcon = data.current.weather[0].icon;
            const iconUrl = "http://openweathermap.org/img/w/" + weatherIcon + ".png";
            $('#currentIcon').attr('src', iconUrl);

            for (let day = 1; day <= 5; day++) {
                updateForecastCard(day, data);
            }
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function initSearchHistory() {
    previousCity.forEach((city, index) => {
        const $btn = $('<button>', {
            class: 'history btn btn-secondary my-2 w-100',
            id: city
        }).text(city);

        $btn.on('click', () => {
            inputCity = city;
            fetchWeatherAndRender(inputCity);
        });

        $history.append($btn);
    });
}

function updateSearchHistory(city) {
    if (!previousCity.includes(city)) {
        previousCity.push(city);

        const $btn = $('<button>', {
            class: 'history btn btn-secondary my-2 w-100',
            id: city
        }).text(city);

        $btn.on('click', () => {
            inputCity = city;
            fetchWeatherAndRender(inputCity);
        });

        $history.append($btn);

        localStorage.setItem("History", JSON.stringify(previousCity));
    }
}

$('#searchBtn').on('click', () => {
    inputCity = $('#cityInput').val();
    fetchWeatherAndRender(inputCity);
    updateSearchHistory(inputCity);
    $('#cityInput').val('');
});

initSearchHistory();