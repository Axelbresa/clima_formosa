const apiKey = '4a2a16afca706b0caca04c994f81284d';
        let city_name = 'formosa';

        async function getWeatherData() {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${apiKey}&units=metric`);
            const data = await response.json();
            return data;
        }

        async function fetchHourlyForecast() {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city_name}&appid=${apiKey}&units=metric`);
            const data = await response.json();
            return data;
        }

        function createDayStructure(date, imageUrl, description, temperature, humidity, windSpeed, rain) {
            const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()}`;
            const formattedTime = date.toLocaleTimeString('es-ES', { hour: 'numeric', minute: '2-digit' });

            return `
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
                            <p>Rain: ${rain} mm</p>
                        </div>
                    </div>
                </div>
            `;
        }

        function displayWeather(weather, hourlyData) {
            const weatherContainer = document.getElementById('weatherContainer');
            weatherContainer.innerHTML = '';

            const humidity = weather.main.humidity;
            const windSpeed = weather.wind.speed;
            const rain = weather.rain ? weather.rain['1h'] : 0;
            const temperature = weather.main.temp;
            const description = weather.weather[0].description;
            const imageUrl = `../images/${getImageFileName(description)}.png`;

            const currentWeatherInfo = createDayStructure(new Date(), imageUrl, description, temperature, humidity, windSpeed, rain);
            weatherContainer.innerHTML += currentWeatherInfo;

            hourlyData.forEach(hour => {
                const date = new Date(hour.dt * 1000);
                const formattedTime = date.toLocaleTimeString('es-ES', { hour: 'numeric', minute: '2-digit' });
                const temperature = hour.main.temp;
                const description = hour.weather[0].description;
                const humidity = hour.main.humidity;
                const windSpeed = hour.wind.speed;
                const rain = hour.rain ? hour.rain['3h'] : 0;
                const imageUrl = `../images/${getImageFileName(description)}.png`;

                const hourlyForecastInfo = createDayStructure(date, imageUrl, description, temperature, humidity, windSpeed, rain);
                weatherContainer.innerHTML += hourlyForecastInfo;
            });
        }

        function getImageFileName(description) {
            const lowercaseDescription = description.toLowerCase();
            if (lowercaseDescription.includes('clear')) return 'clear';
            if (lowercaseDescription.includes('clouds')) return 'cloud';
            if (lowercaseDescription.includes('mist')) return 'mist';
            if (lowercaseDescription.includes('rain')) return 'rain';
            if (lowercaseDescription.includes('snow')) return 'snow';
            if (lowercaseDescription.includes('storm')) return 'storm';
            return 'default'; // Imagen predeterminada
        }

        function getMonthName(monthIndex) {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return months[monthIndex];
        }

        window.addEventListener('load', () => {
            getWeatherData().then(weather => {
                fetchHourlyForecast().then(hourlyData => {
                    displayWeather(weather, hourlyData.list);
                }).catch(error => {
                    console.error('Error al obtener datos de pronóstico por horas:', error);
                });
            }).catch(error => {
                console.error('Error al obtener datos meteorológicos actuales:', error);
            });
        });