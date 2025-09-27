const UNSPLASH_ACCESS_KEY = 'M4xC0vA7pKIMtuJEi3RAT1EMmb74IhRys6wNvOn9ZN4';
const OPENWEATHERMAP_API_KEY = '7bcf27225c081536417b25102be9a77d';

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const destinationInfo = document.getElementById('destination-info');
const destinationName = document.getElementById('destination-name');
const galleryName = document.getElementById('gallery-name');
const weatherData = document.getElementById('weather-data');
const photoGrid = document.getElementById('photo-grid');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        destinationInfo.style.display = 'block';
        destinationName.textContent = city;
        galleryName.textContent = city;
        fetchData(city);
    } else {
        alert('Please enter a city name.');
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

async function fetchData(city) {
    try {
        weatherData.innerHTML = '<p>Fetching weather data...</p>';
        photoGrid.innerHTML = '<p>Fetching photos...</p>';

        const [weather, photos] = await Promise.all([
            getWeatherData(city),
            getUnsplashPhotos(city)
        ]);

        displayWeatherData(weather);
        displayUnsplashPhotos(photos);

    } catch (error) {
        console.error('Error fetching data:', error);
        weatherData.innerHTML = `<p class="error">Could not fetch weather data. Please try again.</p>`;
        photoGrid.innerHTML = `<p class="error">Could not fetch photos. Please try again.</p>`;
    }
}

async function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Weather data not found.');
    }
    const data = await response.json();
    return data;
}

async function getUnsplashPhotos(city) {
    const url = `https://api.unsplash.com/search/photos?query=${city}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=9`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Unsplash photos not found.');
    }
    const data = await response.json();
    return data.results;
}

function displayWeatherData(data) {
    const { main, weather, wind } = data;
    const temp = main.temp;
    const feelsLike = main.feels_like;
    const description = weather[0].description;
    const icon = weather[0].icon;

    weatherData.innerHTML = `
        <div class="weather-icon">
            <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        </div>
        <p><strong>Temperature:</strong> ${temp}°C</p>
        <p><strong>Feels like:</strong> ${feelsLike}°C</p>
        <p><strong>Condition:</strong> ${description}</p>
        <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
    `;
}

function displayUnsplashPhotos(photos) {
    photoGrid.innerHTML = ''; // Clear previous photos
    if (photos.length === 0) {
        photoGrid.innerHTML = '<p>No photos found for this destination.</p>';
        return;
    }
    
    photos.forEach(photo => {
        const img = document.createElement('img');
        img.src = photo.urls.small;
        img.alt = photo.alt_description || 'Travel photo';
        img.title = photo.alt_description || 'Travel photo';
        photoGrid.appendChild(img);
    });
}
