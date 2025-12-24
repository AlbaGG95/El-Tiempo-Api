// obtener elementos del dom
const temperatureElement = document.querySelector(".temperature");
const descriptionElement = document.querySelector(".description");

// obtener localizacion del usuario
function getUserLocation() {
    if (!navigator.geolocation) {
        descriptionElement.textContent = "Geolocalización no soportada";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            fetchWeather(latitude, longitude);
        },
        () => {
            descriptionElement.textContent = "Permiso de ubicación denegado";
        }
    );
}

// llamada a la api open-meteo
async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const temperature = data.current_weather.temperature;

        temperatureElement.textContent = `${temperature} °C`;
        descriptionElement.textContent = "Temperatura actual";
    } catch (error) {
        descriptionElement.textContent = "Error al obtener el tiempo";
        console.error(error);
    }
}

// iniciar app
getUserLocation();
