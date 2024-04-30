function fetchWeatherData() {
    const apiKey = '4a2a16afca706b0caca04c994f81284d';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Formosa,ar&appid=4a2a16afca706b0caca04c994f81284d&cnt=40`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log(response)
            return response.json();
        })
        .then(data => {
            if (data.list && data.list.length > 0) {
                const filteredData = filterWeatherData(data.list);
                displayHourlyWeatherInfo(filteredData);
            } else {
                throw new Error('No se encontraron datos de pronóstico por horas');
            }
        })
        .catch(error => {
            console.error('Error al obtener datos de pronóstico por horas:', error.message);
        });
}

function filterWeatherData(hourlyData) {
    const currentDate = new Date();
    const nextWeekDate = new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // Obtener la fecha 7 días después

    // Filtrar datos desde la 12am hasta las 11am de cada día por 7 días
    return hourlyData.filter(hour => {
        const hourDate = new Date(hour.dt * 1000);
        const hourOfDay = hourDate.getHours();
        const isWithinTimeRange = hourOfDay >= 0 && hourOfDay <= 11; // Filtrar de 12am a 11am
        return hourDate >= currentDate && hourDate <= nextWeekDate && isWithinTimeRange;
    });
}

const descriptionImages = {
    'Clear': '../images/clear.png',
    'Clouds': '../images/cloud.png',
    'Mist': '../images/mist.png',
    'Rain': '../images/rain.png',
    'Snow': '../images/snow.png',
    'Storm': '../images/tormenta.png',
    'default': '../images/tormenta.png' // Imagen predeterminada
};

function getMatchingImage(description) {
    const lowercaseDescription = description.toLowerCase();
    for (const key in descriptionImages) {
        if (lowercaseDescription.includes(key.toLowerCase())) {
            return descriptionImages[key];
        }
    }
    return descriptionImages['default']; // Si no se encuentra una coincidencia, usar la imagen predeterminada
}

function displayHourlyWeatherInfo(hourlyData) {
    const weatherContainer = document.getElementById('weatherContainer');
    weatherContainer.innerHTML = ''; // Limpiar cualquier contenido previo

    hourlyData.forEach(hour => {
        const date = new Date(hour.dt * 1000);
        const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()}`;
        const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        const temperature = convertKelvinToCelsius(hour.main.temp);
        const description = hour.weather[0].description; // Obtener la descripción exacta
        const humidity = hour.main.humidity;
        const windSpeed = hour.wind.speed;
        const rain = hour.rain ? `${hour.rain['3h']} mm` : '0 mm'; // Obtener la cantidad de precipitación en las últimas 3 horas

        console.log('Descripción:', description); // Imprimir la descripción para ver qué valor toma exactamente

        const imageUrl = getMatchingImage(description);

        let weatherInfo = `
            <div class="day">
                <h4>${formattedDate} ${formattedTime}</h4>
                <img src="${imageUrl}" alt="${description}">
                <p>Description: ${description}</p>
                <div class="Temperatura">
                Temperature: ${temperature} °C
                </div>
                <div class="info-container">
                <div class="humedad">
                <p>Humidity: ${humidity}%</p>
                </div>
                <div class="viento">
                <p>Wind Speed: ${windSpeed} m/s</p>
                <p>Rain: ${rain}</p>
                </div>
                </div>
            </div>
        `;

        weatherContainer.innerHTML += weatherInfo;
    });
}

function convertKelvinToCelsius(tempKelvin) {
    return (tempKelvin - 273.15).toFixed(2);
}

function getMonthName(monthIndex) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthIndex];
}

window.addEventListener('load', fetchWeatherData);
