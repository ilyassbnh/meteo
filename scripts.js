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
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    fetchWeatherData(apiUrl);
  }

  function fetchWeather(cityName) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
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
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        clearWeather();
      });
  }

  function updateWeather(data) {
    const city = data.name;
    const currentTemperature = data.main.temp;
    const weatherDescription = data.weather[0].description;
    const iconCode = data.weather[0].icon;

    cityName.textContent = city;
    temperature.textContent = `${currentTemperature.toFixed(1)}°C`;

    const iconElement = document.createElement("i");
    iconElement.classList.add("mi", "mi-fw", "mi-lg", `mi-${getIconName(iconCode)}`);
    const descriptionElement = document.createElement("p");
    descriptionElement.classList.add("h3");
    descriptionElement.innerHTML = `${getWeatherDescription(weatherDescription)}`;

    cityName.appendChild(descriptionElement);
    cityName.appendChild(iconElement);
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
