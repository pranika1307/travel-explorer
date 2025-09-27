const UNSPLASH_ACCESS_KEY = "M4xC0vA7pKIMtuJEi3RAT1EMmb74IhRys6wNvOn9ZN4";
const OPENWEATHERMAP_API_KEY = "9c8cf55024bb1e933869b6664bc0bdb4";

async function searchDestination() {
  const destination = document.getElementById("destinationInput").value.trim();
  if (!destination) {
    alert("Please enter a destination!");
    return;
  }

  fetchPhotos(destination);
  fetchWeather(destination);
}

// Fetch destination photos from Unsplash
async function fetchPhotos(query) {
  const photoContainer = document.getElementById("photoContainer");
  photoContainer.innerHTML = "<p>Loading photos...</p>";

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=6`
    );
    const data = await response.json();
    photoContainer.innerHTML = "";

    if (data.results.length === 0) {
      photoContainer.innerHTML = "<p>No photos found.</p>";
      return;
    }

    data.results.forEach(photo => {
      const img = document.createElement("img");
      img.src = photo.urls.small;
      img.alt = photo.alt_description || "Travel photo";
      photoContainer.appendChild(img);
    });
  } catch (error) {
    console.error("Error fetching photos:", error);
    photoContainer.innerHTML = "<p>Failed to load photos.</p>";
  }
}

// Fetch weather info from OpenWeatherMap
async function fetchWeather(city) {
  const weatherContainer = document.getElementById("weatherContainer");
  weatherContainer.innerHTML = "<p>Loading weather...</p>";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      weatherContainer.innerHTML = `<p>Weather info not found.</p>`;
      return;
    }

    weatherContainer.innerHTML = `
      <h2>Weather in ${data.name}, ${data.sys.country}</h2>
      <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
      <p><strong>Condition:</strong> ${data.weather[0].description}</p>
      <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
    `;
  } catch (error) {
    console.error("Error fetching weather:", error);
    weatherContainer.innerHTML = "<p>Failed to load weather.</p>";
  }
}
