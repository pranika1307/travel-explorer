const UNSPLASH_ACCESS_KEY = "M4xC0vA7pKIMtuJEi3RAT1EMmb74IhRys6wNvOn9ZN4";
const WEATHER_API_KEY = "9c8cf55024bb1e933869b6664bc0bdb4";

async function exploreDestination() {
  const query = document.getElementById("destination").value;
  if (!query) return alert("Please enter a destination");

  document.getElementById("results").innerHTML = "<p>Loading...</p>";

  try {
    // Fetch image from Unsplash
    const headers = {
      "Authorization": `Client-ID ${UNSPLASH_ACCESS_KEY}`
    };
    const imgRes = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=1`, { headers });
    const imgData = await imgRes.json();
    const imgUrl = imgData.results[0]?.urls?.regular || "https://via.placeholder.com/300x200";

    // Fetch weather from OpenWeatherMap
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${WEATHER_API_KEY}&units=metric`);
    const weatherData = await weatherRes.json();

    let weatherInfo = "Weather not found";
    if (weatherData.cod === 200) {
      weatherInfo = `${weatherData.weather[0].description}, ${weatherData.main.temp}°C`;
    }

    // Render result
    document.getElementById("results").innerHTML = `
      <div class="card">
        <img src="${imgUrl}" alt="${query}">
        <div class="card-content">
          <h2>${query}</h2>
          <p class="weather">🌤️ ${weatherInfo}</p>
        </div>
      </div>
    `;
  } catch (error) {
    console.error(error);
    document.getElementById("results").innerHTML = "<p>Error fetching data. Try again!</p>";
  }
}
