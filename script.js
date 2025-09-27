
const UNSPLASH_ACCESS_KEY = "M4xC0vA7pKIMtuJEi3RAT1EMmb74IhRys6wNvOn9ZN4";
const OPENWEATHERMAP_API_KEY = "7bcf27225c081536417b25102be9a77d";

async function searchDestination() {
  const destination = document.getElementById("destinationInput").value.trim();
  if (!destination) {
    alert("Please enter a destination!");
    return;
  }

  if (UNSPLASH_ACCESS_KEY) {
    fetchPhotos(destination);
  } else {
    loadDemoPhotos();
  }

  if (OPENWEATHERMAP_API_KEY) {
    fetchWeather(destination);
  } else {
    loadDemoWeather(destination);
  }
}

// Demo photos (local fallback)
function loadDemoPhotos() {
  const photoContainer = document.getElementById("photoContainer");
  photoContainer.innerHTML = "";

  const demoUrls = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1",
    "https://images.unsplash.com/photo-1518684079-3c830dcef090"
  ];

  demoUrls.forEach(url => {
    const img = document.createElement("img");
    img.src = url + "?auto=format&fit=crop&w=800&q=60";
    img.alt = "Demo Travel Photo";
    photoContainer.appendChild(img);
  });
}

// Demo weather (local fallback)
function loadDemoWeather(city) {
  const weatherContainer = document.getElementById("weatherContainer");
  weatherContainer.innerHTML = `
    <h2>Weather in ${city}</h2>
    <p><strong>Temperature:</strong> 25°C</p>
    <p><strong>Condition:</strong> Sunny</p>
    <p><strong>Humidity:</strong> 40%</p>
    <p><strong>Wind Speed:</strong> 5 m/s</p>
    <p style="color:gray">(Demo data shown – add API key for live info)</p>
  `;
}

// Live Unsplash fetch
async function fetchPhotos(query) {
  const photoContainer = document.getElementById("photoContainer");
  photoContainer.innerHTML = "<p>Loading photos...</p>";

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=6`
    );
    const data = await response.json();
    photoContainer.innerHTML = "";

    if (!data.results || data.results.length === 0) {
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
    loadDemoPhotos();
  }
}

// Live weather fetch
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
    loadDemoWeather(city);
  }
}
