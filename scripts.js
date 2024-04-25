window.addEventListener("DOMContentLoaded", () => {
  const apiKey = "a987af9b8821469fce7c51e760858a2d"; // Replace "YOUR_API_KEY" with your OpenWeatherMap API key

  const cityInput = document.getElementById("cityInput");
  const cityName = document.getElementById("cityName");
  const temperature = document.querySelector(".temperature span");
  const forecastList = document.querySelector(".forecast");

  // Get weather information for user's current location
  getLocation();

  // Event listener for input change
  cityInput.addEventListener("change", () => {
    const cityNameValue = cityInput.value.trim();
    fetchWeather(cityNameValue);
  });

  // Event listener for button click to get user's location
  const getLocationBtn = document.getElementById("getLocationBtn");
  getLocationBtn.addEventListener("click", getLocation);

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        fetchWeatherByCoords(latitude, longitude);
      }, (error) => {
        console.error("Error getting user's location:", error);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  function fetchWeatherByCoords(latitude, longitude) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    fetchWeatherData(apiUrl);
  }

  function fetchWeather(cityName) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
    fetchWeatherData(apiUrl);
  }

  function fetchWeatherData(apiUrl) {
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("City not found");
        }
        return response.json();
      })
      .then((data) => {
        updateWeather(data);
        updateForecast(data.list);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        clearWeather();
      });
  }

  function updateWeather(data) {
    const city = data.city.name;
    const currentTemperature = data.list[0].main.temp;
    const weatherDescription = data.list[0].weather[0].description;
    const iconCode = data.list[0].weather[0].icon;

    cityName.textContent = city;
    temperature.textContent = `${currentTemperature.toFixed(1)}°C`;
  }

  function updateForecast(forecastData) {
    forecastList.innerHTML = ""; // Clear previous forecast items

    // Iterate through forecast data for the next 5 days
    for (let i = 0; i < 5; i++) {
      const forecast = forecastData[i * 8]; // Weather forecast for every 3 hours, so we skip 8 entries to get data for each day
      const date = new Date(forecast.dt * 1000);
      const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
      const temperatureMin = forecast.main.temp_min.toFixed(1);
      const temperatureMax = forecast.main.temp_max.toFixed(1);
      const weatherDescription = forecast.weather[0].description;
      const iconCode = forecast.weather[0].icon;

      const forecastItem = document.createElement("li");
      forecastItem.innerHTML = `
        <h3 class="h5">${weekday}</h3>
        <p><i class="mi mi-fw mi-2x mi-${getIconName(iconCode)}"></i><br>${temperatureMin}°/${temperatureMax}°</p>
        <p>${getWeatherDescription(weatherDescription)}</p>
      `;
      forecastList.appendChild(forecastItem);
    }
  }

  function clearWeather() {
    cityName.textContent = "";
    temperature.textContent = "";
    forecastList.innerHTML = "";
  }

  function getIconName(iconCode) {
    // Mapping of OpenWeatherMap icon codes to Meteocons icon names
    const iconMap = {
      "01d": "sun",
      "02d": "cloud-sun",
      "03d": "cloud",
      "04d": "clouds",
      "09d": "rain",
      "10d": "rain",
      "11d": "lightning",
      "13d": "snow",
      "50d": "mist",
      "01n": "moon",
      "02n": "cloud-moon",
      "03n": "cloud",
      "04n": "clouds",
      "09n": "rain",
      "10n": "rain",
      "11n": "lightning",
      "13n": "snow",
      "50n": "mist"
    };
    return iconMap[iconCode];
  }

  function getWeatherDescription(description) {
    // Mapping of OpenWeatherMap weather descriptions to simpler descriptions
    const descriptionMap = {
      "clear sky": "Clear sky",
      "few clouds": "Partly cloudy",
      "scattered clouds": "Scattered clouds",
      "broken clouds": "Broken clouds",
      "overcast clouds": "Overcast",
      "light rain": "Light rain",
      "moderate rain": "Rain",
      "heavy intensity rain": "Heavy rain",
      "light snow": "Light snow",
      "snow": "Snow",
      "light shower snow": "Light snow showers",
      "shower snow": "Snow showers",
      "heavy snow": "Heavy snow",
      "mist": "Mist"
    };
    return descriptionMap[description.toLowerCase()] || description;
  }
});
