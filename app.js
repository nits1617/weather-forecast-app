window.onload = () => {
const API_KEY = "2374653599782b516174921fd18e2852";
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherDisplay = document.getElementById("weatherDisplay");
const locationName = document.getElementById("locationName");
const currentWeather = document.getElementById("currentWeather");
const errorMsg = document.getElementById("errorMsg");
const recentCities = document.getElementById("recentCities");
const extendedForecast = document.getElementById("extendedForecast");

searchBtn.addEventListener("click", () =>{
    const city = cityInput.value.trim();
    if (!city) {
        showError("Please enter a city name.");
        return;
    }
    fetchWeather(city);
    updateRecentCities(city);
});

recentCities.addEventListener("change",(e) =>{
    if (e.target.value !== "Select recent city"){
        fetchWeather(e.target.value);
    }
});

function updateRecentCities(city){
    let cities = JSON.parse(localStorage.getItem("recentCities")) || [];
    if (!cities.includes(city)){
        cities.push(city);
        localStorage.setItem("recentCities", JSON.stringify(cities));
        renderRecentCities();
    }
}

function renderRecentCities(){
     let cities = JSON.parse(localStorage.getItem("recentCities")) || [];
     if (cities.length){
        recentCities.classList.remove("hidden");
        recentCities.innerHTML=`<option>Select recent city</option>`;
        cities.forEach(c => {
            recentCities.innerHTML += `<option>${c}</option>;`
        });
     }
}

function fetchWeather(city){
    errorMsg.textContent="";
     fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2374653599782b516174921fd18e2852
&units=metric`)
.then(res => {
    if(!res.ok) throw new Error("City not found.");
    return res.json();
})
.then(data => {
    displayCurrentWeather(data);
    return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=2374653599782b516174921fd18e2852
&units=metric`)
})
.then(res => res.json())
.then(data => displayExtendedForecast(data))
.catch(err => showError(err.message));
}

function displayCurrentWeather(data){
    weatherDisplay.classList.remove("hidden");
    locationName.textContent = `${data.name}, ${data.sys.country}`;
    currentWeather.innerHTML=`
    <p>🌡️ Temp: ${data.main.temp}°C</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>💨 Wind: ${data.wind.speed} m/s</p>
    <p>${data.weather[0].main} - ${data.weather[0].description}</p>
    `;
}
function displayExtendedForecast(data) {
    const days ={};
    data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        if (!days[date]) days[date] = item;
    });

    extendedForecast.innerHTML = "<h3 class='font-bold mt-2 mb-1'>5-Day Forecast:</h3>";
    Object.values(days).slice(0,5).forEach(item => {
        extendedForecast.innerHTML += `
        <div class="border p-2 rounded mb-1">
        <p>${item.dt_txt.split(" ")[0]}</p>
        <p>🌡️ ${item.main.temp}°C</p>
        <p>💧 ${item.main.humidity}%</p>
        <p>💨 ${item.wind.speed} m/s</p>
        <p>${item.weather[0].main}</p>
        </div>
        `;
    });    
}

document.getElementById("clearRecent").addEventListener("click", () => {
  localStorage.removeItem("recentCities");    
  renderRecentCities();                      
});

function showError(message){
    errorMsg.textContent  = message;
}
renderRecentCities();
};