const apiKey = 'Your_API_Here'; // Replace with your OpenWeatherMap API key

// Search button click
document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    getWeather(city);
  }
});

async function getWeather(city) {
  try {
    // Current weather
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 200) {
      document.getElementById("cityName").textContent = data.name;
      document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
      document.getElementById("description").textContent = data.weather[0].description;

      // IMPORTANT: Use correct ID matching HTML
      document.getElementById("weather-icon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      setBackground(data.weather[0].main);
    } else {
      alert("City not found!");
    }

    // Forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();

    displayForecast(forecastData.list);
  } catch (error) {
    console.error(error);
    alert("Error fetching weather data!");
  }
}

function displayForecast(list) {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";

  // get one forecast every 24h (API gives every 3h → pick every 8th)
  for (let i = 0; i < list.length; i += 8) {
    const day = list[i];
    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <p>${new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}</p>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="">
      <p>${Math.round(day.main.temp)}°C</p>
    `;
    forecastDiv.appendChild(card);
  }
}

function setBackground(condition) {
  const body = document.body;
  body.className = ""; // reset

  if (condition.includes("Cloud")) {
    body.classList.add("cloudy");
  } else if (condition.includes("Rain")) {
    body.classList.add("rainy");
  } else if (condition.includes("Snow")) {
    body.classList.add("snowy");
  } else {
    body.classList.add("sunny");
  }
}
