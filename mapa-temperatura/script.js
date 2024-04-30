const map = L.map('map').setView([-26.1855, -58.1752], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

const API_KEY = '4a2a16afca706b0caca04c994f81284d'; // Reemplaza 'TU_API_KEY' con tu clave de API de OpenWeather

// Hacemos la solicitud a la API de OpenWeather para obtener los datos de temperatura
fetch(`https://api.openweathermap.org/data/2.5/weather?q=Formosa,ar&units=metric&appid=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
        const temperatura = data.main.temp;

        // Creamos un marcador en el mapa para mostrar la temperatura
        L.marker([-26.1855, -58.1752]).addTo(map)
            .bindPopup(`Temperatura a 2 metros: ${temperatura}°C`).openPopup();

        // Creamos un objeto GeoJSON con un punto en la ubicación de Formosa
        const geojsonFeature = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-58.1752, -26.1855],
            },
            properties: {
                temperatura: temperatura,
            },
        };

        // Definimos la función para el estilo de los puntos en la capa GeoJSON
        function estiloPunto(feature) {
            let color;
            if (feature.properties.temperatura > 40) {
                color = 'red'; // Rojo si la temperatura es mayor a 40 grados
            } else if (feature.properties.temperatura > 35) {
                color = 'orange'; // Naranja si la temperatura está entre 35 y 40 grados
            } else if (feature.properties.temperatura > 30) {
                color = 'yellow'; // Amarillo si la temperatura está entre 30 y 35 grados
            } else {
                color = 'green'; // Verde para temperaturas menores o iguales a 30 grados
            }

            return {
                fillColor: color,
                color: 'black',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7,
            };
        }

        // Agregamos la capa GeoJSON al mapa con el estilo personalizado
        L.geoJSON(geojsonFeature, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, estiloPunto(feature));
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error al obtener los datos:', error));
