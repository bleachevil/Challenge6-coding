var searchFormEl = document.querySelector('#search-form');
var ListClick = document.querySelector('#itemGrid');
var currentCity = document.querySelector('#current-city');
var temp_main = document.querySelector('#temperature');
var humidity_main = document.querySelector('#humidity');
var wind_main = document.querySelector('#wind-speed');
var uv_index = document.querySelector('#uv-index');
var listEl = document.querySelector('.list-group');
var APIKey = "6fa76d606f5e9a1cdab184ef3675e48c";
var rightNow = moment().format('dddd') + "," + moment().format('MMMM DD YYYY');
var time0 = moment().add(1, 'days').format('dddd') + "," + moment().add(1, 'days').format('MMMM DD YYYY');
var time1 = moment().add(2, 'days').format('dddd') + "," + moment().add(2, 'days').format('MMMM DD YYYY');
var time2 = moment().add(3, 'days').format('dddd') + "," + moment().add(3, 'days').format('MMMM DD YYYY');
var time3 = moment().add(4, 'days').format('dddd') + "," + moment().add(4, 'days').format('MMMM DD YYYY');
var time4 = moment().add(5, 'days').format('dddd') + "," + moment().add(5, 'days').format('MMMM DD YYYY');
var day0 = document.querySelector('#Date0');
var listCity = [];


//function to get current weather

function fetchdata(searchInputVal) {
    if(searchInputVal) { fetch("https://api.openweathermap.org/data/2.5/weather?q=" + searchInputVal + "&units=imperial&APPID=" + APIKey,     
    {method: 'GET', //GET is the default.
    credentials: 'same-origin', // include, *same-origin, omit
    redirect: 'follow', // manual, *follow, error
    }).then(function (response) {
        return response.json();
    })
    .then(function (data) {
        //console.log(data);
        var iconcode = data.weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        if(searchInputVal) {
            $(currentCity).html(searchInputVal + " " + rightNow + " " + "<img src="+iconurl+">");};
        temp_main.textContent = data.main.temp + " °F";
        wind_main.textContent = data.wind.speed + " MPH";
        humidity_main.textContent = data.main.humidity + " %";
        lat = data.coord.lat;
        lon = data.coord.lon;
        fiveDayforecast(lat, lon, APIKey);
        fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey,     
        {method: 'GET', //GET is the default.
        credentials: 'same-origin', // include, *same-origin, omit
        redirect: 'follow', // manual, *follow, error
        }).then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //console.log(data);
            uv_index.textContent = data.value;

            var nvcolor =  '#uv-index';

            if (data.value <= 2) {
                $(nvcolor).removeClass("bg-warning");
                $(nvcolor).removeClass("bg-danger");
                $(nvcolor).addClass("bg-success");                
            }
            else if (data.value < 8 && data.value > 2) {
                $(nvcolor).removeClass("bg-success");
                $(nvcolor).removeClass("bg-danger");
                $(nvcolor).addClass("bg-warning");
            }
            else {
                $(nvcolor).removeClass("bg-warning");
                $(nvcolor).removeClass("bg-success");
                $(nvcolor).addClass("bg-danger");
            }

        });

        
    });}
}


// append the list of city
function appendlist(city) {
    var cityList = document.createElement("li");
        cityList.setAttribute("class", "list-group-item active");
        cityList.textContent += city;
        //console.log(cityList);
        listEl.append(cityList);
}


//5 day forecast
function fiveDayforecast(lat, lon, APIKey) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey,     
    {method: 'GET', //GET is the default.
    credentials: 'same-origin', // include, *same-origin, omit
    redirect: 'follow', // manual, *follow, error
    }).then(function (response) {
        return response.json();
    })
    .then(function (data) {
        //console.log(data);
        for ( let i = 0; i < 5; i++ ) {
            var iconNumber = "#Icon" + i ;
            var dayNumber = "#Date" + i ;
            var tempNumber = "#Temp" + i ;
            var windNumber = "#wind" + i ;
            var humidityNumber = "#Humidity" + i ;
            var daycide = "time" + i ;
            var iconString = document.querySelector(iconNumber);
            var dayString = document.querySelector(dayNumber);
            var tempString = document.querySelector(tempNumber);
            var windString = document.querySelector(windNumber);
            var humidityString = document.querySelector(humidityNumber);

            var iconcode = data.list[i].weather[0].icon;
            var tempcode = data.list[i].main.temp;
            var windcode = data.list[i].wind.speed;
            var humiditycode = data.list[i].main.humidity;

            //console.log(data);
            var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
            $(iconString).html("<img src="+iconurl+">");
            $(dayString).html(window[daycide]);
            $(tempString).html(tempcode + " °F");
            $(windString).html(windcode + " MPH");
            $(humidityString).html(humiditycode + " %");
        
        
        }
    });
}

//refresh the page and list maintain
if (localStorage.getItem("cityList") != null) {
var listCity = JSON.parse(localStorage.getItem("cityList"))
if(listCity!==null){
    listCity=JSON.parse(localStorage.getItem("cityList"));
    for(i=0; i<listCity.length;i++){
        appendlist(listCity[i]);
        fetchdata(listCity[listCity.length - 1]);
    }}
}

//click the history
$("li").click(function(){
    //console.log($(this).html());
    fetchdata($(this).text());
})

//search
$("button").click(function(){
    var searchInputVal = document.querySelector('#search-input').value;
    if (searchInputVal !== "") {
    listCity.push(searchInputVal);
    localStorage.setItem("cityList",JSON.stringify(listCity));
    appendlist(searchInputVal);
    }; 
    fetchdata(searchInputVal);
})