//collecting all necessery dom elements and other important stuff
const container = document.getElementById("cities-container"); 
const input = document.getElementById("search-inpt");
const add_btn = document.getElementById("add-city-btn");
const reset_btn = document.getElementById("add-reset-btn");
const apiKey = `49a3e7802d130c1107168d306e1ef957`;
let arr = [];


// Fetching data from openweathermap.org
async function fetchWeather(){
    const city = input.value.trim();
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    let response = await fetch(URL);
    let data = await response.json();
    console.log(data);
    addInArr(data);
}

//adding the weather elements in array and performing required tasks
function addInArr(data){
    if(data.message === 'city not found'){
        return;
    }
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if(data.name === element.name){
            insert = !insert;
            return;
        }
    }
    arr.push(data);
    arr.sort((a,b)=>{
        return a.main.temp - b.main.temp;
    })
    container.innerHTML = '';
    arr.forEach((ele) =>{
        makeWeatherCards(ele);
    })
}
//adding data in container
function makeWeatherCards(data){
    const weather = document.createElement("div");
    weather.className = "weather";
    const info = selectLogo(data);
    let logo = info[0];
    let desc = info[1];
    let myStr = `
    <div class="top">
        <div class="temparature">${Math.round(data.main.temp)}°</div>
        <div class="logo"><img src="${logo}" alt="weather-logo"></div>
    </div>
    <div class="feels-like"> Feels like: ${Math.round(data.main.feels_like)}° </div>
    <div class="temp">
        <div class="hi-temp">hi: ${Math.round(data.main.temp_max)}°</div>
        <div class="low-temp">lo: ${Math.round(data.main.temp_min)}°</div>
    </div>    
    <div class="bottom">
        <div class="city">${data.name},${data.sys.country}</div>
        <div class="weather-cond">${desc}</div>
    </div>`;
    weather.innerHTML = myStr;
    container.appendChild(weather);

}

//chosing the image part of the card
function selectLogo(data){
    let imageUrl = "";
    let desc = "";
    if(data.weather[0].main === "Clear" || data.weather[0].main === "Sunny"){
        imageUrl = "Resources/icons8-sun-64.png";
        desc = "Sunny";
    }
    
    else if(data.weather[0].main === "Storm" || Math.round(data.wind.speed) >= 15){
        imageUrl = "Resources/icons8-wind-64.png";
        desc = "Windy";
        
    }
    
    else if(data.weather[0].main === "Rain" || Math.round(data.rain) >= 10){
        imageUrl = "Resources/icons8-rain-64.png";
        desc = "Rainy";
        
    }
    else if(data.weather[0].main === "Haze" || data.weather[0].main === "Cloud" || Math.round(data.clouds) >= 65){
        imageUrl = "Resources/icons8-clouds-64.png";
        desc = "Cloudy";
        
    }else{
        imageUrl = "Resources/icons8-partly-cloudy-day-64.png";
        desc = "Partialy Cloudy";

    }
    let info = [imageUrl,desc];
    return info;
}

// Adding EventListeners
add_btn.addEventListener("click",fetchWeather);
reset_btn.addEventListener("click",()=>{
    container.innerHTML = "";
    arr = [];
});