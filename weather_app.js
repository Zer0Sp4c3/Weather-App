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
async function getCoordinatesFromCity() {
    // Pulls input for city and state
    // const city = document.querySelector('#txtCity').value;
    // const state = document.querySelector('#txtState').value;
    const address = document.querySelector('#txtAddress').value;
    const encodedAddress = encodeURIComponent(address + ' United States');
    
    // if (!city || !state) {
    //     alert("Please enter a city name and state.");
    //     return;
    // }

    const geoUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=127ec4374fe142b3a13be55b09a8a249`;
    console.log("Requesting:", geoUrl);
    
    try {
        fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry;
            console.log('Latitude:', lat);
            console.log('Longitude:', lng);

            // Call the weather function with the obtained coordinates
            fetchWeather(lat, lng);

            } else {
            console.error('No results found for that address.');
            }
        })
        .catch(error => {
            console.error('Error fetching geolocation:', error);
        });

    }
    catch (error) {
        console.error("Error fetching weather data:", error);
    }
}


// Function fetches and makes API call to obtain weather info
async function fetchWeather(objLatitude, objLongitude) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${objLatitude}&longitude=${objLongitude}&current_weather=true&temperature_unit=fahrenheit&precipitation_unit=inch&hourly=precipitation,precipitation_probability&forecast_days=1`;

    console.log("Fetching weather for:", objLatitude, objLongitude);

    try {
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();
        
        console.log("Weather API Response:", weatherData); // Debugging

        if (weatherData.current_weather && weatherData.hourly) {
            // Extract latest precipitation value
            const precipitation = weatherData.hourly.precipitation[0] ?? "N/A"; // Gets precipitation
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
        <h1 class="text-danger">🌡️ Temperature: ${objWeatherData.temperature}°F</h1>
        <h1 class="text-info">🌧️ Precipitation: ${precipitation}%</h1>
        <h1 class="text-secondary">⛅ Condition: ${weatherCondition}</h1>

    `;

    console.log("Displaying weather:", objWeatherData, "Precipitation:", precipitation); // Debugging
}

//Gets service_worker.js to work
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

document.querySelector('#btnGetLocation').addEventListener('click', function(){
    getCoordinatesFromCity();
    document.querySelector('#frmLocation').style.display = 'none'
    document.querySelector('#frmWeather').style.display = 'block'
})

document.querySelector('#btnSubmit').addEventListener('click', function(){
    getLocationByCoord();
    document.querySelector('#frmLocation').style.display = 'none'
    document.querySelector('#frmWeather').style.display = 'block'
})

document.querySelector('#btnBack').addEventListener('click', function(){
    document.querySelector('#frmLocation').style.display = 'block'
    document.querySelector('#frmWeather').style.display = 'none'
})