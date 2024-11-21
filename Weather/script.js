// Unsplash API integration
let unsplash = {
  photoApiKey: "Unsplash_API_key", // Replace with your Unsplash API key
  fetchPhoto: function (query) {
      const unsplashURL = `https://api.unsplash.com/photos/random?query=${query}&client_id=${this.photoApiKey}`;
      fetch(unsplashURL)
          .then((response) => {
              if (!response.ok) throw new Error("Unable to fetch photo");
              return response.json();
          })
          .then((data) => this.displayPhoto(data))
          .catch((error) => console.error("Photo fetch error: ", error));
  },
  displayPhoto: function (data) {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);
    const imageUrl = `${data.urls.raw}&w=1920&h=1080&fit=crop`; // Resized image URL
    setTimeout(() => {
        document.body.style.backgroundImage = `url('${imageUrl}')`;
    }, 100);
},

};

// Weather and DOM integration
const weather = {
  apiKey: "Open Weather API key", // Replace with your OpenWeather API key
  weatherDiv: document.querySelector(".weather"),
  cityName: document.querySelector(".city"),
  temp: document.querySelector(".temp"),
  description: document.querySelector(".description"),
  humidity: document.querySelector(".humidity"),
  wind: document.querySelector(".wind"),
  searchBar: document.querySelector(".search-bar"),
  searchButton: document.querySelector(".search-btn"),
  icon: document.querySelector(".icon"),

  fetchWeather: async function (location) {
      let apiUrl;
      if (typeof location === "string") {
          apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${this.apiKey}`;
      } else {
          const { latitude, longitude } = location;
          apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.apiKey}`;
      }

      try {
          const response = await fetch(apiUrl);
          if (!response.ok) throw new Error("Location not found");
          const data = await response.json();

          // Update the DOM with weather details
          this.cityName.innerText = `Weather in ${data.name}`;
          this.temp.innerText = `${data.main.temp}°C`;
          this.description.innerText = data.weather[0].description;
          this.humidity.innerText = `Humidity: ${data.main.humidity}%`;
          this.wind.innerText = `Wind speed: ${data.wind.speed} km/h`;
          this.icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

          // Fetch and apply Unsplash background
          unsplash.fetchPhoto(data.name);

          this.weatherDiv.classList.remove("loading");
      } catch (error) {
          alert(error.message);
      }
  },

  getUserLocation: function () {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  const location = {
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                  };
                  this.fetchWeather(location);
              },
              () => {
                  alert("Unable to access location. Please enter your city manually.");
              }
          );
      } else {
          alert("Geolocation is not supported by your browser.");
      }
  },
};

// Event listeners
weather.searchButton.addEventListener("click", () => {
  const location = weather.searchBar.value;
  if (location) weather.fetchWeather(location);
});

window.addEventListener("load", () => {
  weather.getUserLocation();
});
