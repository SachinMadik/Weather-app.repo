const apiKey = 'bdcd5be8f9884ffdaa391408250506'; // Replace with your actual WeatherAPI key

const submitButton = document.getElementById('submit-btn');
const locationInput = document.getElementById('location-input');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastWeatherDiv = document.getElementById('forecast-weather');

submitButton.addEventListener('click', () => {
  const location = locationInput.value;
  if (location.trim() === '') {
    alert('Please enter a location');
    return;
  }
  fetchWeather(location);
});

async function fetchWeather(location) {
  try {
    const currentWeatherURL = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;
    const forecastWeatherURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`;

    const [currentWeatherResponse, forecastWeatherResponse] = await Promise.all([
      fetch(currentWeatherURL),
      fetch(forecastWeatherURL)
    ]);

    const currentData = await currentWeatherResponse.json();
    const forecastData = await forecastWeatherResponse.json();

    displayCurrentWeather(currentData);
    displayForecastWeather(forecastData);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to fetch weather data. Please check your location or API key.');
  }
}

function displayCurrentWeather(data) {
  const location = data.location.name;
  const tempC = data.current.temp_c;
  const condition = data.current.condition.text;
  const icon = data.current.condition.icon;

  currentWeatherDiv.innerHTML = `
    <h3>Current Weather</h3>
    <p><strong>${location}</strong></p>
    <img src="https:${icon}" alt="${condition}" />
    <p>${condition}</p>
    <p>Temperature: ${tempC}°C</p>
  `;
}

function displayForecastWeather(data) {
  const forecast = data.forecast.forecastday;
  let html = '<h3>3-Day Forecast</h3>';

  forecast.forEach(day => {
    const date = day.date;
    const max = day.day.maxtemp_c;
    const min = day.day.mintemp_c;
    const condition = day.day.condition.text;
    const icon = day.day.condition.icon;

    html += `
      <div style="margin-bottom: 10px;">
        <strong>${date}</strong><br>
        <img src="https:${icon}" alt="${condition}" />
        <p>${condition}</p>
        <p>Max: ${max}°C, Min: ${min}°C</p>
      </div>
    `;
  });

  forecastWeatherDiv.innerHTML = html;
}
