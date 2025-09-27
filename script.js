
const UNSPLASH_ACCESS_KEY = 'M4xC0vA7pKIMtuJEi3RAT1EMmb74IhRys6wNvOn9ZN4'; 
const OPENWEATHERMAP_API_KEY = '7bcf27225c081536417b25102be9a77d';

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const destinationInfo = document.getElementById('destination-info');
const destinationName = document.getElementById('destination-name');
const galleryName = document.getElementById('gallery-name');
const weatherData = document.getElementById('weather-data');
const photoGrid = document.getElementById('photo-grid');
const heroSection = document.querySelector('.hero-section');
const loadingSpinner = document.getElementById('loading-spinner');
const socialButtons = document.querySelector('.social-buttons');

// Leaflet.js map global variable
let map;

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        showLoadingState();
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

function showLoadingState() {
    destinationInfo.style.display = 'none';
    loadingSpinner.style.display = 'flex';
}

function hideLoadingState() {
    loadingSpinner.style.display = 'none';
    destinationInfo.style.display = 'grid';
}

async function fetchData(city) {
    try {
        const [weather, forecast, photos] = await Promise.all([
            getWeatherData(city),
            getWeatherForecast(city),
            getUnsplashPhotos(city),
            getUnsplashHeroPhoto(city) // Hero photo is also fetched
        ]);
        
        // Update hero image dynamically
        if (photos && photos.length > 0) {
            heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${photos[0].urls.regular}')`;
        }

        destinationName.textContent = city;
        galleryName.textContent = city;
        
        displayMap(weather.coord);
        displayWeatherData(forecast);
        displayUnsplashPhotos(photos);
        updateSocialShareLinks(city);
        
        hideLoadingState();

    } catch (error) {
        console.error('Error fetching data:', error);
        hideLoadingState();
        destinationInfo.style.display = 'grid'; // Show the section to display errors
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

async function getWeatherForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Forecast data not found.');
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

async function getUnsplashHeroPhoto(city) {
    const url = `https://api.unsplash.com/search/photos?query=${city}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1&orientation=landscape`;
    const response = await fetch(url);
    if (!response.ok) {
        return null;
    }
    const data = await response.json();
    if (data.results && data.results.length > 0) {
        heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${data.results[0].urls.regular}')`;
    }
}

function displayMap(coords) {
    const { lat, lon } = coords;
    
    // Check if map already exists to prevent re-initialization
    if (map) {
        map.remove();
    }
    
    map = L.map('map-container').setView([lat, lon], 10);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([lat, lon]).addTo(map)
        .bindPopup('Destination')
        .openPopup();
}

function displayWeatherData(data) {
    weatherData.innerHTML = '';
    
    const days = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        if (!days[date]) {
            days[date] = item;
        }
    });

    for (const day in days) {
        const item = days[day];
        const temp = item.main.temp;
        const description = item.weather[0].description;
        const icon = item.weather[0].icon;

        const dayElement = document.createElement('div');
        dayElement.className = 'weather-day';
        dayElement.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
            <div>
                <p><strong>${day}</strong></p>
                <p>${temp.toFixed(1)}°C - ${description}</p>
            </div>
        `;
        weatherData.appendChild(dayElement);
    }
}

function displayUnsplashPhotos(photos) {
    photoGrid.innerHTML = '';
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

function updateSocialShareLinks(city) {
    const pageUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out the amazing photos and weather for ${city} on Travel Explorer!`);

    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${text}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${text}%20${pageUrl}`;

    document.querySelector('.facebook-btn').href = facebookUrl;
    document.querySelector('.twitter-btn').href = twitterUrl;
    document.querySelector('.whatsapp-btn').href = whatsappUrl;
}