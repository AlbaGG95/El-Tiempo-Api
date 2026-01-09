const temperatureElement = document.querySelector(".temperature");
const descriptionElement = document.querySelector(".description");
const hourlyListElement = document.querySelector(".hourly-list");
const dailyListElement = document.querySelector(".daily-list");
const timelineListElement = document.querySelector(".timeline-list");
const windElement = document.querySelector("[data-wind]");
const updatedElement = document.querySelector("[data-updated]");
const locationNameElement = document.querySelector(".location-name");
const locationDetailElement = document.querySelector(".location-detail");
const statusElement = document.querySelector("[data-status]");
const currentIconElement = document.querySelector(".current-icon");
const insightElement = document.querySelector("[data-insight]");
const useGeoButton = document.querySelector("[data-use-geolocation]");
const loadDefaultButton = document.querySelector("[data-load-default]");

const DEFAULT_LOCATION = {
    name: "Lli\u00e7\u00e0 d'Amunt, Barcelona",
    detail: "CP 08186 \u00b7 Predeterminado",
    latitude: 41.61667,
    longitude: 2.23333,
};

document.addEventListener("DOMContentLoaded", () => {
    attachEvents();
    fetchWeather(
        DEFAULT_LOCATION.latitude,
        DEFAULT_LOCATION.longitude,
        DEFAULT_LOCATION.name,
        DEFAULT_LOCATION.detail
    );
});

function attachEvents() {
    loadDefaultButton?.addEventListener("click", () => {
        fetchWeather(
            DEFAULT_LOCATION.latitude,
            DEFAULT_LOCATION.longitude,
            DEFAULT_LOCATION.name,
            DEFAULT_LOCATION.detail
        );
    });

    useGeoButton?.addEventListener("click", getUserLocation);
}

function getUserLocation() {
    if (!navigator.geolocation) {
        showStatus("Geolocalizacion no disponible. Mostrando Lli\u00e7\u00e0 d'Amunt.");
        fetchWeather(
            DEFAULT_LOCATION.latitude,
            DEFAULT_LOCATION.longitude,
            DEFAULT_LOCATION.name,
            DEFAULT_LOCATION.detail
        );
        return;
    }

    showStatus("Buscando tu ubicacion...");

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(latitude, longitude, "Tu ubicacion", "Detectado por tu dispositivo");
        },
        () => {
            showStatus("No se pudo usar tu ubicacion. Mostrando Lli\u00e7\u00e0 d'Amunt.");
            fetchWeather(
                DEFAULT_LOCATION.latitude,
                DEFAULT_LOCATION.longitude,
                DEFAULT_LOCATION.name,
                DEFAULT_LOCATION.detail
            );
        }
    );
}

async function fetchWeather(lat, lon, locationLabel = "Tu ubicacion", detail = "") {
    showStatus(`Actualizando pronostico para ${locationLabel}...`);

    const url =
        "https://api.open-meteo.com/v1/forecast" +
        `?latitude=${lat}` +
        `&longitude=${lon}` +
        "&current_weather=true" +
        "&hourly=temperature_2m,precipitation_probability,weathercode" +
        "&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode,sunrise,sunset" +
        "&timezone=auto";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Respuesta no valida: ${response.status}`);
        }

        const data = await response.json();

        if (locationNameElement) locationNameElement.textContent = locationLabel;
        setLocationDetail(detail || "Datos en tiempo real");

        renderCurrent(data);
        renderHourly(data);
        renderDaily(data);
        renderTimeline(data);

        showStatus(`Mostrando pronostico para ${locationLabel}.`);
    } catch (error) {
        if (descriptionElement) descriptionElement.textContent = "Error al obtener el tiempo";
        showStatus("No se pudo actualizar el tiempo. Revisa la conexion.");
        console.error(error);
    }
}

function renderCurrent(data) {
    const temperature = data.current_weather?.temperature;
    const code = data.current_weather?.weathercode;
    const windspeed = data.current_weather?.windspeed;
    const time = data.current_weather?.time;
    const precipProb = getCurrentPrecipProbability(data);

    const label = getWeatherLabel(code);
    const theme = getWeatherTheme(code);

    if (document.body) {
        document.body.setAttribute("data-theme", theme);
    }

    if (temperatureElement) {
        temperatureElement.textContent =
            typeof temperature === "number" ? `${temperature.toFixed(1)} \u00b0C` : "-- \u00b0C";
    }

    if (descriptionElement) {
        descriptionElement.textContent = `${label.icon} ${label.text}`;
    }
    if (currentIconElement) {
        currentIconElement.textContent = label.icon;
    }

    const windText =
        typeof windspeed === "number" ? `${Math.round(windspeed)} km/h` : "-- km/h";
    if (windElement) {
        windElement.textContent = `Viento ${windText}`;
    }

    if (updatedElement) {
        updatedElement.textContent = `Actualizado ${formatHour(time || new Date().toISOString())}`;
    }

    const insight = getWeatherInsight(temperature, windspeed, precipProb, code);
    if (insightElement) {
        insightElement.textContent = insight;
    }
}

function renderHourly(data) {
    const times = data.hourly?.time || [];
    const temps = data.hourly?.temperature_2m || [];
    const pops = data.hourly?.precipitation_probability || [];
    const codes = data.hourly?.weathercode || [];

    if (!hourlyListElement) return;
    hourlyListElement.innerHTML = "";

    const nowHourKey = getCurrentHourKey();
    let startIndex = times.findIndex((t) => t.startsWith(nowHourKey));
    if (startIndex === -1) startIndex = 0;

    const endIndex = Math.min(startIndex + 12, times.length);

    for (let i = startIndex; i < endIndex; i++) {
        const hour = formatHour(times[i]);
        const temp = temps[i];
        const pop = pops[i] ?? 0;
        const label = getWeatherLabel(codes[i]);

        const item = document.createElement("div");
        item.className = "hour-item";

        if (typeof times[i] === "string" && times[i].startsWith(nowHourKey)) {
            item.classList.add("is-current-hour");
        }

        item.innerHTML = `
            <p class="hour">${hour}</p>
            <p class="hour-icon">${label.icon}</p>
            <p class="hour-temp">${Number.isFinite(temp) ? `${Math.round(temp)}\u00b0` : "--"}</p>
            <p class="hour-pop">${Number.isFinite(pop) ? `${pop}%` : "--%"}</p>
        `;
        hourlyListElement.appendChild(item);
    }
}

function renderDaily(data) {
    const dates = data.daily?.time || [];
    const max = data.daily?.temperature_2m_max || [];
    const min = data.daily?.temperature_2m_min || [];
    const popMax = data.daily?.precipitation_probability_max || [];
    const codes = data.daily?.weathercode || [];

    if (!dailyListElement) return;
    dailyListElement.innerHTML = "";

    const daysToShow = Math.min(
        7,
        dates.length,
        max.length,
        min.length,
        popMax.length,
        codes.length
    );

    for (let i = 0; i < daysToShow; i++) {
        const day = formatDay(dates[i]);
        const numericCode = Number(codes[i]);
        const safeCode = Number.isFinite(numericCode) ? numericCode : -1;
        const label = getWeatherLabel(safeCode);

        const minTemp = Number.isFinite(min[i]) ? `${Math.round(min[i])}\u00b0` : "--\u00b0";
        const maxTemp = Number.isFinite(max[i]) ? `${Math.round(max[i])}\u00b0` : "--\u00b0";
        const rain = Number.isFinite(popMax[i]) ? `${popMax[i]}%` : "--%";

        const row = document.createElement("div");
        row.className = "day-item";
        row.innerHTML = `
            <p class="day">${day}</p>
            <p class="day-icon">${label.icon}</p>
            <p class="day-temp">${minTemp} / ${maxTemp}</p>
            <p class="day-pop">\ud83c\udf27\ufe0f ${rain}</p>
        `;
        dailyListElement.appendChild(row);
    }
}

function renderTimeline(data) {
    if (!timelineListElement) return;
    timelineListElement.innerHTML = "";

    const sunrise = data.daily?.sunrise?.[0];
    const sunset = data.daily?.sunset?.[0];
    const todayKey = data.daily?.time?.[0];
    const hourlyTimes = data.hourly?.time || [];
    const hourlyTemps = data.hourly?.temperature_2m || [];

    const todaysIndexes = [];
    if (todayKey) {
        for (let i = 0; i < hourlyTimes.length; i++) {
            const timeStr = hourlyTimes[i];
            if (typeof timeStr === "string" && timeStr.startsWith(todayKey)) {
                todaysIndexes.push(i);
            }
        }
    }

    let maxInfo = null;
    let minInfo = null;

    for (const idx of todaysIndexes) {
        const temp = hourlyTemps[idx];
        const timeStr = hourlyTimes[idx];
        if (!Number.isFinite(temp) || !timeStr) continue;

        if (!maxInfo || temp > maxInfo.temp) {
            maxInfo = { temp, time: timeStr };
        }
        if (!minInfo || temp < minInfo.temp) {
            minInfo = { temp, time: timeStr };
        }
    }

    const timelineItems = [];

    if (sunrise) {
        timelineItems.push({
            icon: "🌅",
            value: formatHour(sunrise),
            label: "Amanecer",
        });
    }

    if (maxInfo) {
        timelineItems.push({
            icon: "🔥",
            value: `${formatHour(maxInfo.time)} · ${Math.round(maxInfo.temp)}°`,
            label: "Hora más cálida",
        });
    }

    if (sunset) {
        timelineItems.push({
            icon: "🌇",
            value: formatHour(sunset),
            label: "Atardecer",
        });
    }

    if (minInfo) {
        timelineItems.push({
            icon: "❄️",
            value: `${formatHour(minInfo.time)} · ${Math.round(minInfo.temp)}°`,
            label: "Hora más fría",
        });
    }

    for (const item of timelineItems) {
        const node = document.createElement("div");
        node.className = "timeline-item";
        node.innerHTML = `
            <p class="timeline-value">${item.icon} ${item.value}</p>
            <p class="timeline-label">${item.label}</p>
        `;
        timelineListElement.appendChild(node);
    }
}

function formatHour(isoString) {
    if (!isoString) return "--:--";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return isoString.slice(11, 16);
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

function formatDay(dateString) {
    if (!dateString) return "--";
    const date = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("es-ES", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
    });
}

function getCurrentHourKey() {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(
        now.getHours()
    )}`;
}

function getCurrentPrecipProbability(data) {
    const times = data.hourly?.time || [];
    const pops = data.hourly?.precipitation_probability || [];
    const nowHourKey = getCurrentHourKey();
    const idx = times.findIndex((t) => typeof t === "string" && t.startsWith(nowHourKey));
    if (idx !== -1 && Number.isFinite(pops[idx])) {
        return pops[idx];
    }
    return 0;
}

function getWeatherLabel(code) {
    if (!Number.isFinite(code)) return { text: "Tiempo variable", icon: "\u2601\ufe0f" };

    if (code === 0) return { text: "Cielo despejado", icon: "\u2600\ufe0f" };
    if (code === 1 || code === 2) return { text: "Poco nuboso", icon: "\u26c5\ufe0f" };
    if (code === 3) return { text: "Nublado", icon: "\u2601\ufe0f" };
    if (code === 45 || code === 48) return { text: "Niebla", icon: "\u2601\ufe0f" };

    if (code >= 51 && code <= 67) return { text: "Lluvia", icon: "\ud83c\udf27\ufe0f" };
    if (code >= 71 && code <= 77) return { text: "Nieve", icon: "\u2744\ufe0f" };
    if (code >= 80 && code <= 82) return { text: "Chubascos", icon: "\ud83c\udf27\ufe0f" };
    if (code === 85 || code === 86) return { text: "Chubascos de nieve", icon: "\u2744\ufe0f" };
    if (code >= 95 && code <= 99) return { text: "Tormenta", icon: "\u26a1" };

    return { text: "Tiempo variable", icon: "\u2601\ufe0f" };
}

function getWeatherTheme(code) {
    if (code === 0) return "sunny";
    if ([1, 2, 3, 45, 48].includes(code)) return "cloudy";
    if (
        (code >= 51 && code <= 67) ||
        (code >= 80 && code <= 82) ||
        (code >= 95 && code <= 99)
    ) {
        return "rainy";
    }
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snowy";
    return "cloudy";
}

function getWeatherInsight(temperature, windspeed, precipProbability, code) {
    const temp = Number(temperature);
    const wind = Number(windspeed);
    const precip = Number(precipProbability);

    if (Number.isFinite(precip) && precip >= 60) {
        return "Posible lluvia · Lleva paraguas";
    }

    if ([95, 96, 99].includes(code)) {
        return "Tormenta en camino · Refúgiate";
    }

    if (Number.isFinite(wind) && wind >= 35) {
        return "Viento notable · Evita zonas expuestas";
    }

    if (Number.isFinite(temp) && temp >= 30) {
        return "Mucho calor · Hidrátate";
    }

    if (Number.isFinite(temp) && temp >= 22) {
        return "Temperatura suave · Buen momento para salir";
    }

    if (Number.isFinite(temp) && temp >= 14) {
        return "Agradable con brisa · Ideal para pasear";
    }

    if (Number.isFinite(temp) && temp >= 8) {
        return "Sensación fresca · Abrígate ligeramente";
    }

    if (Number.isFinite(temp)) {
        return "Frío notable · Lleva abrigo";
    }

    return "Condiciones cambiantes · Revísalo en minutos";
}

function showStatus(message) {
    if (statusElement) {
        statusElement.textContent = message;
    }
}

function setLocationDetail(detail) {
    if (locationDetailElement) {
        locationDetailElement.textContent = detail;
    }
}
