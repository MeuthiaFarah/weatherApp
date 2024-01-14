// script.js
var mapOptions = {
    center: [-6.40, 106.79],
    zoom: 13
}

var map = L.map('map', mapOptions);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


const apiKey = 'API_KEY_ADA_DI_DOKUMEN';

function searchLocation() {
    const locationInput = document.getElementById('location').value;

    if (locationInput) {
        document.getElementById('weather-info').innerHTML = '';
        geocodeLocation(locationInput)
            .then(coordinates => {
                addWeatherInfo(coordinates.lat, coordinates.lon);
                var marker = L.marker(coordinates);
                marker.bindPopup("Location: " + coordinates.lat, coordinates.lon);
                marker.addTo(map);
            })
            .catch(error => {
                console.error('Error fetching geocoding data:', error);
                // Handle error
            });
    }
}

function addWeatherInfo(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=id`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            const weatherInfoContainer = document.getElementById('weather-info');
            weatherInfoContainer.innerHTML = `
                <strong>${data.name}, ${data.sys.country}</strong><br>
                Latitude: ${lat} Longitude: ${lon}<br>
                Temperatur: ${data.main.temp} °C<br>
                Kelembaban: ${data.main.humidity}%<br>
                Cuaca: ${data.weather[ 0 ].description}<br>
                <br>
                <small><em>*perlu diingat bahwa data yang ditampilkan mungkin berbeda dengan input dikarenakan cakupan lokasi dari API yang terbatas :)</em></small>
            `;

            // Tambahkan marker pada peta dengan popup
            var marker = L.marker([lat, lon]).addTo(map);
            marker.bindPopup(`
                <strong>${data.name}, ${data.sys.country}</strong><br>
                Temperatur: ${data.main.temp} °C<br>
                Kelembaban: ${data.main.humidity}%<br>
                Cuaca: ${data.weather[0].description}
            `).openPopup();

            map.setView([lat, lon]);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            // Handle error (misalnya, tampilkan pesan kesalahan kepada pengguna)
        });
}

function geocodeLocation(locationName) {
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`;

    return fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                return { lat, lon };
            } else {
                throw new Error('Location not found');
            }
        })
        .catch(error => {
            console.error('Error fetching geocoding data:', error);
            throw error;
        });
}
