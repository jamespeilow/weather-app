var weatherClass = null;
var debug = null;
var lat, lon, temp = 0;
var tempUnit = "C";
var returnedData;
var tempLow;
var tempHigh;
var wind;
$( document ).ready(function() {
	console.log( "ready!" );
	//getLocation();
	$("#location-btn-gps").click(getLocation);
	$("#location-btn-submit").click(getLocationFromInput);
	$(".temps-info").click(function() {
		toggleTemp();
	});	
});

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition, getLocationByIp); //showPosition callback on success, getLocationByIp on fail
	} else {
		console.log("Geolocation is not supported by this browser");
	}    
}

function showPosition(position) {
	lat = position.coords.latitude;
	lon = position.coords.longitude;
	getWeather(lat, lon);
}

function getLocationByIp() {
	var url = "https://freegeoip.net/json/"
	$.getJSON(url, function(data) {
		returnedData = data;
		console.log(data);
		getWeather(returnedData.latitude, returnedData.longitude);
	});	
}
function getLocationFromInput() {
	var inputValue = $("#location-input").val();
	console.log('pressed');
	$.ajax({
		type: "GET",
		url: "https://maps.googleapis.com/maps/api/geocode/json?address="+encodeURIComponent(inputValue)+"&key=AIzaSyDlc1CDHP8y1ysWSI02biWlk0nNatQbHgY",
		dataType: "json",
		success: processJSON,
	});
	function processJSON(data) {
		coords = data.results[0].geometry.location;
		var googleData=[data];
		console.log(googleData);
		getWeather(coords.lat, coords.lng);
	}
}



function getWeather(lat, lon) {
	var url = "https://fcc-weather-api.glitch.me/api/current?lat="+lat+"&lon="+lon;
	$.getJSON(url, function(data) {
		console.log(data);
		returnedData = data;
		debug = data;
		tempUnit="C";
		tempLow=returnedData.main.temp_min;
		tempHigh=returnedData.main.temp_max;
		wind=data.wind.speed;
		$(".weather-main-info").removeClass(weatherClass).addClass(getBodyWeatherClass(data));
		weatherClass = getBodyWeatherClass(data);
		$("#weather-icon").attr("src", "img/"+getWeatherIcon(data));
		$("#temps-info-low").text(getWeatherDegrees(tempLow));
		$("#temps-info-high").text(getWeatherDegrees(tempHigh));
		$("#humidity").text(data.main.humidity+"%");
		$("#wind").text(data.wind.speed+"m/s");
		$("#pressure").text(data.main.pressure+'hPa');
		$("#weather-main-text").text(toTitleCase(data.weather[0].description));
		if (!data.name || !data.sys.country) {
			$(".location").text(" ");
		} else {
			$(".location").text(data.name+", "+data.sys.country);
			$("#location-input").val(data.name+", "+data.sys.country);
		}
		$(".cover").addClass("hide");
	});
}

function getWeatherDegrees(temp, rounding=true) {
	if (rounding) {
		temp = Math.round(temp);
	}
	return temp+String.fromCharCode(176)+tempUnit;
}

function tempConvert() {
	if (tempUnit=="C") {
		//Convert to F
		tempLow = tempLow*9/5+32;
		tempHigh = tempHigh*9/5+32;
		wind = (wind/0.44704).toFixed(2);
		tempUnit = "F";
	} else if (tempUnit=="F") {
		tempLow = (tempLow-32)*5/9;
		tempHigh = (tempHigh-32)*5/9;
		wind = (wind*0.44704).toFixed(2);
		tempUnit = "C";
	}
}

function getWeatherIcon(weatherData) {
	
	var weatherIcon="";
	switch (weatherData.weather[0].main) {
	case "Thunderstorm":
		weatherIcon = "Cloud-Lightning.svg";
		break;
	case "Drizzle":
		weatherIcon = "Cloud-Drizzle.svg";
		break;
	case "Rain":
		weatherIcon = "Cloud-Rain.svg";
		break;
	case "Snow":
		weatherIcon = "Cloud-Snow-Alt.svg";
		break;
	case "Atmosphere":
		weatherIcon = "Cloud-Fog-Alt.svg";
		break;
	case "Clear":
		weatherIcon = "Sun.svg";
		break;
	case "Clouds":
		weatherIcon = "Cloud.svg";
		break;
	case "Extreme":
		weatherIcon = "Tornado.svg";
		break;
	case "Additional":
		weatherIcon = "Wind.svg";
		break;
	default:
		weatherIcon = "Thermometer-50.svg";
	}
	return weatherIcon;
}

function getBodyWeatherClass(weatherData) {
	var weatherClass="";
	switch (weatherData.weather[0].main) {
	case "Thunderstorm":
	case "Extreme":
		weatherClass = "weather-dark";
		break;
	case "Drizzle":
	case "Rain":
		weatherClass = "weather-rain";
		break;
	case "Snow":
		weatherClass = "weather-snow";
		break;
	case "Atmosphere":
		weatherClass = "weather-fog";
		break;
	case "Clear":
		weatherClass = "weather-sunny";
		break;
	case "Clouds":
	case "Additional":
		weatherClass = "weather-clouds";
		break;
	default:
		weatherClass = "";
	}
	return weatherClass;
}

function toggleTemp() {
	tempConvert();
	$("#wind").fadeOut();
	$(".temps-info").fadeOut(function() {
		$("#temps-info-low").text(getWeatherDegrees(tempLow));
		$("#temps-info-high").text(getWeatherDegrees(tempHigh));
		if (tempUnit=="C") {
			windStr = wind+"m/s";
		} else {
			windStr = wind+" mph";
		}
		$("#wind").text(windStr);
		$(".temps-info").fadeIn();
		$("#wind").fadeIn();
	});
}

function toTitleCase(str) {
	str = str.toLowerCase();
	var words = str.split(" ");
	for (var word in words) {
		words[word] = words[word].charAt(0).toUpperCase() + words[word].slice(1);
	}
	str = words.join(" ");
	return str;				
}
      