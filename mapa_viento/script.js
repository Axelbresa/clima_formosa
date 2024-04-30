const map = L.map('map').setView([-26.1855, -58.1752], 9);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

const API_KEY = '4a2a16afca706b0caca04c994f81284d'; // Reemplaza 'TU_API_KEY' con tu clave de API de OpenWeather

// Obtenemos los datos de viento para la provincia de Formosa
fetch(`https://api.openweathermap.org/data/2.5/box/city?bbox=-61.147,-26.424,-58.084,-22.091,10&units=metric&appid=${API_KEY}&op=WND`)
    .then(response => response.json())
    .then(data => {
        // Iteramos sobre las zonas de Formosa y pintamos el mapa según la velocidad del viento
        data.list.forEach(zone => {
            const velocidadViento = zone.wind.speed;
            const color = getColor(velocidadViento);
            
            // Agregamos un polígono en cada zona con el color correspondiente
            L.polygon(zone.coord, { color: color, fillColor: color, fillOpacity: 0.5 }).addTo(map);
        });
    })
    .catch(error => console.error('Error al obtener los datos:', error));

// Función para obtener el color según la velocidad del viento
function getColor(velocidad) {
    return velocidad > 10 ? '#FF0000' :
           velocidad > 8 ? '#FFA500' :
           velocidad > 6 ? '#FFFF00' :
           velocidad > 4 ? '#00FF00' :
           '#0000FF';
}
