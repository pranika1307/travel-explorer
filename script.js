
const UNSPLASH_ACCESS_KEY = "M4xC0vA7pKIMtuJEi3RAT1EMmb74IhRys6wNvOn9ZN4";
const OPENWEATHERMAP_API_KEY = "7bcf27225c081536417b25102be9a77d";

window.onload = function () {
  checkAPIKeys();
};

// ✅ Check API keys on page load
async function checkAPIKeys() {
  const statusBox = document.getElementById("apiStatus");

  let unsplashOk = false;
  let weatherOk = false;

  // Check Unsplash
  if (UNSPLASH_ACCESS_KEY) {
    try {
      const res = await fetch(`https://api.unsplash.com/search/photos?query=test&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`);
      unsplashOk = res.ok;
    } catch {
      unsplashOk = false;
    }
  }

  // Check OpenWeather
  if (OPENWEATHERMAP_API_KEY) {
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=${OPENWEATHERMAP_API_KEY}`);
      weatherOk = res.ok;
    } catch {
      weatherOk = false;
    }
  }

  // Update status
  if (unsplashOk && weatherOk) {
    statusBox.innerHTML = "✅ Both API keys are working!";
    statusBox.className = "api-status success";
  } else if (unsplashOk && !weatherOk) {
    statusBox.innerHTML = "✅ Unsplash key works | ❌ OpenWeather key invalid";
    statusBox.className = "api-status error";
  } else if (!unsplashOk && weatherOk) {
    statusBox.innerHTML = "❌ Unsplash key invalid | ✅ OpenWeather key works";
    statusBox.className = "api-status error";
  } else {
    statusBox.innerHTML = "❌ No valid API keys found (demo mode)";
    statusBox.className = "api-status error";
  }
}
