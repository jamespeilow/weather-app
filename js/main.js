var weatherClass = null;
var debug = null;
var lat, lon, temp = 0;
var tempUnit = "C";
var returnedData;
var tempLow;
var tempHigh;
var wind;

$.ajaxSetup({
    async: false
});

$( document ).ready(function() {
	console.log( "ready!" );
	//getLocation();
	$("#location-btn-gps").click(function(e) {
		e.preventDefault();
		getLocation();
	});
	$("#location-search").submit(function(e) {
		e.preventDefault();
		getLocationFromInput();
		}
	);
	$(".temps-info").click(function() {
		toggleTemp();
	});
	$(".weather-card").fadeIn('slow');	
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
	getWeather(lat, lon, "gps");
}

function getLocationByIp() {
	var url = "https://freegeoip.net/json/"
	$.getJSON(url, function(data) {
		returnedData = data;
		console.log(data);
		getWeather(returnedData.latitude, returnedData.longitude, "ip");
	});	
}
function getLocationFromInput() {
	var inputValue = $("#location-input").val();
	if (!inputValue) {
		getLocationByIp();
	}
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
		var address = data.results[0].formatted_address;
		getWeather(coords.lat, coords.lng, "google", address);
	}
}



function getWeather(lat, lon, searchType, locationName) {
	var url = "https://fcc-weather-api.glitch.me/api/current?lat="+lat+"&lon="+lon;
	$.getJSON(url, function(data) {
		console.log(data);
		returnedData = data;
		apiData = data;
		tempUnit="C";
		tempLow=returnedData.main.temp_min;
		tempHigh=returnedData.main.temp_max;
		wind=data.wind.speed;
		$(".weather-main-info").removeClass(weatherClass).addClass(getBodyWeatherClass(data));
		weatherClass = getBodyWeatherClass(data);
		$(".weather-main-icon").addClass("hidden");
		$("#"+getWeatherIcon(data)).removeClass("hidden");
		//$("#weather-icon").attr("src", "img/"+getWeatherIcon(data));
		$("#temps-info-low").text(getWeatherDegrees(tempLow));
		$("#temps-info-high").text(getWeatherDegrees(tempHigh));
		$("#humidity").text(data.main.humidity+"%");
		$("#wind").text((data.wind.speed).toFixed(1)+"m/s");
		$("#pressure").text(data.main.pressure+'hPa');
		if (locationName) {
			$(".location").text(locationName);
			$("#location-input").val(locationName);
		} else {
			$(".location").text(returnedData.name+", "+returnedData.sys.country);
			$("#location-input").val(returnedData.name+", "+returnedData.sys.country);	
		}
		$("#weather-main-text").text(toTitleCase(data.weather[0].description));
	});

	$(".cover").addClass("hide");
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
		wind = (wind/0.44704).toFixed(1);
		tempUnit = "F";
	} else if (tempUnit=="F") {
		tempLow = (tempLow-32)*5/9;
		tempHigh = (tempHigh-32)*5/9;
		wind = (wind*0.44704).toFixed(1);
		tempUnit = "C";
	}
}

function getWeatherIcon(weatherData) {
	var weatherType = weatherData.weather[0].main;
	switch (weatherType) {
	case "Thunderstorm":
	case "Drizzle":
	case "Rain":
	case "Snow":
	case "Atmosphere":
	case "Clear":
	case "Clouds":
	case "Extreme":
	case "Additional":
		weatherIconId = "weather-icon-"+weatherType.toLowerCase();
		break;
	default:
		weatherIconId = "weather-icon-default";
	}
	return weatherIconId;
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
      