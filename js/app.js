// dom
const temperatureElement = document.querySelector(".temperature");
const descriptionElement = document.querySelector(".description");
const hourlyListElement = document.querySelector(".hourly-list");
const dailyListElement = document.querySelector(".daily-list");

// geolocalizacion
function getUserLocation() {
    if (!navigator.geolocation) {
        descriptionElement.textContent = "Geolocalización no soportada";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(latitude, longitude);
        },
        () => {
            descriptionElement.textContent = "Permiso de ubicación denegado";
        }
    );
}

// api open-meteo
async function fetchWeather(lat, lon) {
    const url =
        "https://api.open-meteo.com/v1/forecast" +
        `?latitude=${lat}` +
        `&longitude=${lon}` +
        "&current_weather=true" +
        "&hourly=temperature_2m,precipitation_probability" +
        "&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
        "&timezone=auto";

    try {
        const response = await fetch(url);
        const data = await response.json();

        renderCurrent(data);
        renderHourly(data);
        renderDaily(data);
    } catch (error) {
        descriptionElement.textContent = "Error al obtener el tiempo";
        console.error(error);
    }
}

// render ahora
function renderCurrent(data) {
    const temperature = data.current_weather?.temperature;
    temperatureElement.textContent =
        typeof temperature === "number" ? `${temperature} °C` : "-- °C";
    descriptionElement.textContent = "Temperatura actual";
}

// render proximas 12 horas
function renderHourly(data) {
    const times = data.hourly?.time || [];
    const temps = data.hourly?.temperature_2m || [];
    const pops = data.hourly?.precipitation_probability || [];

    // limpiar
    hourlyListElement.innerHTML = "";

    // coger desde la hora actual hacia delante
    const nowIsoHour = new Date().toISOString().slice(0, 13); // "YYYY-MM-DDTHH"
    let startIndex = times.findIndex((t) => t.startsWith(nowIsoHour));
    if (startIndex === -1) startIndex = 0;

    const endIndex = Math.min(startIndex + 12, times.length);

    for (let i = startIndex; i < endIndex; i++) {
        const hour = formatHour(times[i]);
        const temp = temps[i];
        const pop = pops[i];

        const item = document.createElement("div");
        item.className = "hour-item";
        item.innerHTML = `
        <p class="hour">${hour}</p>
        <p class="hour-temp">${temp}°</p>
        <p class="hour-pop">${pop}%</p>
        `;
        hourlyListElement.appendChild(item);
    }
}

// render proximos 7 dias
function renderDaily(data) {
    const dates = data.daily?.time || [];
    const max = data.daily?.temperature_2m_max || [];
    const min = data.daily?.temperature_2m_min || [];
    const popMax = data.daily?.precipitation_probability_max || [];

    // limpiar
    dailyListElement.innerHTML = "";

    const daysToShow = Math.min(7, dates.length);

    for (let i = 0; i < daysToShow; i++) {
        const day = formatDay(dates[i]);

        const row = document.createElement("div");
        row.className = "day-item";
        row.innerHTML = `
        <p class="day">${day}</p>
        <p class="day-temp">${Math.round(min[i])}° / ${Math.round(max[i])}°</p>
        <p class="day-pop">${popMax[i]}%</p>
        `;
        dailyListElement.appendChild(row);
    }
}

// helpers
function formatHour(isoString) {
    // isoString: "YYYY-MM-DDTHH:MM"
    return isoString.slice(11, 16); // "HH:MM"
}

function formatDay(dateString) {
    // dateString: "YYYY-MM-DD"
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("es-ES", { weekday: "short", day: "2-digit", month: "2-digit" });
}

// init
getUserLocation();
