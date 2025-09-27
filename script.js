
const UNSPLASH_ACCESS_KEY = "M4xC0vA7pKIMtuJEi3RAT1EMmb74IhRys6wNvOn9ZN4";
const OPENWEATHERMAP_API_KEY = "7bcf27225c081536417b25102be9a77d";

// Init
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchBtn").addEventListener("click", searchDestination);
  checkAPIKeys();
});

function searchDestination() {
  const destination = document.getElementById("destinationInput").value.trim();
  if (!destination) {
    alert("Please enter a destination!");
    return;
  }
  loadDemoPhotos();
  loadDemoWeather(destination);
}

// Demo photos
function loadDemoPhotos() {
  const photoContainer = document.getElementById("photoContainer");
  photoContainer.innerHTML = "";

  const demoUrls = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d"
  ];

  demoUrls.forEach(url => {
    const img = document.createElement("img");
    img.src = url + "?auto=format&fit=crop&w=400&q=60";
    img.style.width = "200px";
    img.style.margin = "5px";
    photoContainer.appendChild(img);
  });
}

// Demo weather
function loadDemoWeather(city) {
  const weatherContainer = document.getElementById("weatherContainer");
  weatherContainer.innerHTML = `
    <p><strong>Weather in ${city}:</strong> 25°C, Sunny</p>
  `;
}

// API Key check
function checkAPIKeys() {
  const statusBox = document.getElementById("apiStatus");
  if (!UNSPLASH_ACCESS_KEY && !OPENWEATHERMAP_API_KEY) {
    statusBox.innerText = "❌ No API keys found. Demo mode enabled.";
  } else {
    statusBox.innerText = "✅ API keys present.";
  }
}
 (Demo mode enabled)";
    statusBox.className = "api-status error";
  }
}
