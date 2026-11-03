
const cities = [
    {
        name: "Mumbai",
        latitude: 19.0728,
        longitude: 72.8826
    },
    {
        name: "Ahmedabad",
        latitude: 23.1596,
        longitude: 72.6845
    },
    {
        name: "Pune",
        latitude: 18.5196,
        longitude: 73.8554
    },
    {
        name: "Delhi",
        latitude: 28.6519,
        longitude: 77.2315
    }
];

async function getMultipleWeather() {

    try {

        const latitudes = cities.map(city => city.latitude).join(",");
        const longitudes = cities.map(city => city.longitude).join(",");

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitudes}&longitude=${longitudes}&current=temperature_2m,precipitation,weather_code&hourly=temperature_2m`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Weather API request failed");
        }

        const data = await response.json();
        console.log(data);

        // Multiple coordinates return multiple weather results
        // Each result corresponds to the same index in cities

        const results = Array.isArray(data) ? data : [data];

        displayCities(results);

    }

    catch (error) {

        console.error(error);
        document.getElementById("status").textContent =
            "Unable to fetch weather data.";

    }

}

function getWeatherInfo(code) {

    const weatherTypes = {
        0: ["Clear Sky", "☀️"],
        1: ["Mainly Clear", "🌤️"],
        2: ["Partly Cloudy", "⛅"],
        3: ["Overcast", "☁️"],
        45: ["Foggy", "🌫️"],
        48: ["Foggy", "🌫️"],
        51: ["Light Drizzle", "🌦️"],
        53: ["Drizzle", "🌦️"],
        55: ["Heavy Drizzle", "🌧️"],
        61: ["Light Rain", "🌧️"],
        63: ["Moderate Rain", "🌧️"],
        65: ["Heavy Rain", "🌧️"],
        71: ["Light Snow", "🌨️"],
        73: ["Snow", "❄️"],
        75: ["Heavy Snow", "❄️"],
        80: ["Rain Showers", "🌦️"],
        81: ["Heavy Showers", "🌧️"],
        82: ["Violent Showers", "⛈️"],
        95: ["Thunderstorm", "⛈️"],
        96: ["Thunderstorm with Hail", "⛈️"],
        99: ["Heavy Thunderstorm", "⛈️"]
    };

    return weatherTypes[code] || ["Unknown", "🌡️"];
}


function displayCities(weatherData) {

    const container = document.getElementById("weatherContainer");

    container.innerHTML = "";

    weatherData.forEach((weather, index) => {

        const city = cities[index];
        const current = weather.current;

        const [condition, icon] = getWeatherInfo(
    current.weather_code
);

const card = document.createElement("div");

        card.className = "weather-card";

        card.innerHTML = `
            <h2>${city.name}</h2>

            <div class="weather-icon">🌤️</div>

            <div class="temperature">
                ${current.temperature_2m}°C
            </div>

            <p class="condition">
                Weather Code: ${current.weather_code}
            </p>

            <div class="weather-details">
                <div>
                    🌧️ Precipitation:
                    ${current.precipitation} mm
                </div>
            </div>
        `;

        container.appendChild(card);

    });

    document.getElementById("status").textContent =
        "Weather data successfully loaded!";

}

getMultipleWeather();
