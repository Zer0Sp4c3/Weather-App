// Global variables
const weatherDescriptions = {
    0: "Clear sky ☀️",
    1: "Mainly clear 🌤️",
    2: "Partly cloudy ⛅",
    3: "Overcast ☁️",
    45: "Fog 🌫️",
    48: "Depositing rime fog 🌫️❄️",
    51: "Drizzle: Light 🌧️",
    53: "Drizzle: Moderate 🌧️",
    55: "Drizzle: Dense 🌧️",
    61: "Rain: Slight 🌦️",
    63: "Rain: Moderate 🌧️",
    65: "Rain: Heavy 🌧️☔",
    66: "Freezing rain: Light ❄️🌧️",
    67: "Freezing rain: Heavy ❄️🌧️",
    71: "Snow: Slight ❄️",
    73: "Snow: Moderate ❄️❄️",
    75: "Snow: Heavy ❄️❄️❄️",
    77: "Snow grains ❄️🌨️",
    80: "Rain showers: Slight 🌦️",
    81: "Rain showers: Moderate 🌦️",
    82: "Rain showers: Violent ⛈️",
    85: "Snow showers: Slight 🌨️",
    86: "Snow showers: Heavy 🌨️❄️",
    95: "Thunderstorm ⛈️",
    96: "Thunderstorm with slight hail ⛈️🌨️",
    99: "Thunderstorm with heavy hail ⛈️🌨️❄️"
};


// This function will use vanilla JS to gain user's location and geolocation
async function getLocationByCoord() {
    if (navigator.geolocation) { // Vanilla JavaScript gains user's location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeather(latitude, longitude);
            },
)}}

// Function will obtain IP address to get geolocation
// async function getLocationByIP() {
//     fetch(`http://ip-api.com/json/`) // API that uses IP to get location
//         .then(objResponse => objResponse.json())
//         .then(objData => {
//             const { lat, lon } = objData;
//             fetchWeather(lat, lon);
//         })
//         .catch(error => console.error("Error fetching IP location:", error));
// }

// Function that allows users to input their city and state and obtain geolocation
// async function getCoordinatesFromCity() {
//     // Pulls input for city and state
//     const city = document.querySelector('#txtCity').value;
//     const state = document.querySelector('#cboState').value;
    
//     // if (!city || !state) {
//     //     alert("Please enter a city name and state.");
//     //     return;
//     // }

//     const geoUrl = `https://api.opencagedata.com/geocode/v1/json?q=${city},${state},USA&key=2df30d3ed3be46baa0415d5c48491068`;
//     console.log("Fetching geolocation for:", city, state);
//     console.log("Requesting:", geoUrl);
    
//     try {
//         const geoResponse = await fetch(geoUrl); // Fetch latitude and longitude from Open-Meteo Geocoding API
//         const geoData = await geoResponse.json(); // Turn the response into a JSON file
//         console.log(geoData)
//         // Check if geoData is a valid array before accessing properties
//         if (!Array.isArray(geoData) || geoData.length === 0) {
//             alert("Invalid city or state. Please enter a valid location.");
//             return;
//         }

//         const { latitude, longitude } = geoData.results[0];
        
//         if (!latitude || !longitude) {
//             console.error("Error: Latitude or Longitude not found in response.");
//             alert("Error retrieving location coordinates.");
//             return;
//         }

//         fetchWeather(latitude, longitude);
//         console.log(latitude, longitude)

//     }
//     catch (error) {
//         console.error("Error fetching weather data:", error);
//     }
// }


// Function fetches and makes API call to obtain weather info
async function fetchWeather(objLatitude, objLongitude) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${objLatitude}&longitude=${objLongitude}&current_weather=true&temperature_unit=fahrenheit&precipitation_unit=inch&hourly=precipitation&forecast_days=1`;

    console.log("Fetching weather for:", objLatitude, objLongitude);

    try {
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();
        
        console.log("Weather API Response:", weatherData); // ✅ Debugging

        if (weatherData.current_weather && weatherData.hourly) {
            // Extract latest precipitation value
            const precipitation = weatherData.hourly.precipitation[0] ?? "N/A";
            displayWeather(weatherData.current_weather, precipitation);
        } else {
            console.error("Error: Weather data is missing.");
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}


// Will display weather, plan to make it output to html
async function displayWeather(objWeatherData, precipitation) {
    const weatherContainer = document.getElementById("weather");

    // Convert wind speed to mph (if needed)
    const windSpeedMph = (objWeatherData.windspeed * 0.621371).toFixed(1);

     // Get weather description from weather code
     const weatherCondition = weatherDescriptions[objWeatherData.weathercode] || "Unknown";

    weatherContainer.innerHTML = `
        <p>🌡️ Temperature: ${objWeatherData.temperature}°F</p>
        <p>🌧️ Precipitation: ${precipitation} inches</p>
        <p>⛅ Condition: ${weatherCondition}</p>

    `;

    console.log("Displaying weather:", objWeatherData, "Precipitation:", precipitation); // Debugging
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker Registered"))
    .catch(error => console.log("Service Worker Registration Failed:", error));
}

// document.querySelector('#btnLocation').addEventListener('click', function(){
//     getLocationByCoord();
// })

// document.querySelector('#btnApproximation').addEventListener('click', function(){
//     getLocationByIP();
// })

document.querySelector('#btnSubmit').addEventListener('click', function(){
    getLocationByCoord();
    document.querySelector('#frmLocation').style.display = 'none'
    document.querySelector('#frmWeather').style.display = 'block'
})