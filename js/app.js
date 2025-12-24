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
        "&hourly=temperature_2m,precipitation_probability,weathercode" +
        "&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode" +
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
    const code = data.current_weather?.weathercode;

    const label = getWeatherLabel(code);

    temperatureElement.textContent =
        typeof temperature === "number" ? `${temperature} °C` : "-- °C";

    descriptionElement.textContent = `${label.icon} ${label.text}`;
}

// render proximas 12 horas
function renderHourly(data) {
    const times = data.hourly?.time || [];
    const temps = data.hourly?.temperature_2m || [];
    const pops = data.hourly?.precipitation_probability || [];
    const codes = data.hourly?.weathercode || [];

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

        const label = getWeatherLabel(codes[i]);

        const item = document.createElement("div");
        item.className = "hour-item";
        item.innerHTML = `
        <p class="hour">${hour}</p>
        <p class="hour-icon">${label.icon}</p>
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
    const codes = data.daily?.weathercode || [];

    // limpiar
    dailyListElement.innerHTML = "";

    const daysToShow = Math.min(7, dates.length);

    for (let i = 0; i < daysToShow; i++) {
        const day = formatDay(dates[i]);
        const label = getWeatherLabel(codes[i]);

        const row = document.createElement("div");
        row.className = "day-item";
        row.innerHTML = `
        <p class="day">${day}</p>
        <p class="day-icon">${label.icon}</p>
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
    return date.toLocaleDateString("es-ES", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
    });
}

function getWeatherLabel(code) {
    if (code === 0) return { text: "Despejado", icon: "☀️" };
    if (code === 1 || code === 2) return { text: "Poco nuboso", icon: "🌤️" };
    if (code === 3) return { text: "Nublado", icon: "☁️" };

    if (code === 45 || code === 48) return { text: "Niebla", icon: "🌫️" };

    if ([51, 53, 55].includes(code)) return { text: "Llovizna", icon: "🌦️" };
    if ([61, 63, 65].includes(code)) return { text: "Lluvia", icon: "🌧️" };
    if ([66, 67].includes(code)) return { text: "Lluvia helada", icon: "🧊" };

    if ([71, 73, 75, 77].includes(code)) return { text: "Nieve", icon: "❄️" };
    if ([80, 81, 82].includes(code)) return { text: "Chubascos", icon: "🌧️" };

    if ([95, 96, 99].includes(code)) return { text: "Tormenta", icon: "⛈️" };

    return { text: "Tiempo variable", icon: "🌡️" };
}

// init
getUserLocation();
