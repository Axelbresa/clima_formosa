const apiKey = '4a2a16afca706b0caca04c994f81284d';
let city_name = 'formosa';

// Función para obtener la fecha y hora actual formateada
function getFormattedDateTime() {
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
  return { formattedDate, formattedTime };
}

// Función para obtener el clima actual
async function getWeatherData() {
  const { formattedDate, formattedTime } = getFormattedDateTime();
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${apiKey}&units=metric`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const weather = {
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      rain: data.rain ? data.rain['1h'] : 0, // Si no hay datos de lluvia, se establece en 0
      temperature: data.main.temp,
      description: data.weather[0].description,
      formattedDate,
      formattedTime,
    };
    return weather;
  } catch (error) {
    console.error('Error al obtener datos meteorológicos:', error);
  }
}

// Uso de la función para obtener el clima actual
getWeatherData().then((weather) => {
  console.log('Datos meteorológicos:', weather);
});
