const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
//const timezone = document.getElementById('time-zone');
let countryEl = document.getElementById('country');
let latLon = document.getElementById('latLon');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');
let stateEl =document.getElementById('state');
const searchButton = document.getElementById('search-button');
let nameEl = document.getElementById('city');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='dd19b7517654736bd95318485e9bfcac';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);

getWeatherData(0,0)
function getWeatherData (lat=0, lon=0) {
        
        if(lat!==0){
            let latitude = 0;
            let longitude = 0;
            latitude=lat;
            longitude=lon;
            fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`).then(res => res.json()) .then(data1 => { 
                console.log(data1) ;
                cityData( data1);
                })
        
                
        
                fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
        
                console.log(data)
                showWeatherData(data);
                })

        }
        else
        {
            navigator.geolocation.getCurrentPosition((success) => {
                let {latitude, longitude } = success.coords;
             console.log(latitude);
             fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`).then(res => res.json()) .then(data1 => { 
                console.log(data1) ;
                cityData( data1);
                })
        
                
        
                fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
        
                console.log(data)
                showWeatherData(data);
                })
            })
        }
       
        /*fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`).then(res => res.json()) .then(data1 => { 
        console.log(data1) ;
        cityData( data1);
        })

        

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

        console.log(data)
        showWeatherData(data);
        })*/

    
}

function cityData (data1){
    stateEl.innerHTML = data1[0].state+', '+data1[0].country;
    nameEl.innerHTML = data1[0].name;
    let cityName=stateEl.innerHTML;
    //countryEl.innerHTML = data1[0].country;
    /*fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryEl}&limit=3&appid=${API_KEY}`)
    .then(res => res.json()).then(data2 => {
        console.log(data2);
    })*/
}

function showWeatherData (data){
    let {humidity, temp, sunrise, sunset, wind_speed} = data.current;

    //timezone.innerHTML = data.timezone;
    latLon.innerHTML = data.lat + 'N ' + data.lon+'E'

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Temperature</div>
        <div>${temp}&#176;C</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed} m/s</div>
    </div>

    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
    
    
    `;

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">max - ${day.temp.max}&#176;C</div>
                <div class="temp">min - ${day.temp.min}&#176;C</div>
            </div>
            
            `
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">max - ${day.temp.max}&#176;C</div>
                <div class="temp">min - ${day.temp.min}&#176;C</div>
            </div>
            
            `
        }
    })


    weatherForecastEl.innerHTML = otherDayForcast;
}


/*searchButton.addEventListener('click', () => {
  const inputValue = searchInput.value;
  alert(inputValue);
}); */
function searchCity(city){
    const searchInput = document.getElementById('search-input').value;
    console.log(searchInput);
    
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchInput}&limit=1&appid=${API_KEY}`)
    .then(res => res.json()).then(data2 => {
        console.log(data2);
        if(data2.length===0){
            alert("city not found, enter a valid city name");
            return false;
        }
        else{
            getWeatherData (data2[0].lat, data2[0].lon)
        }
        
    })
     
}
