/*
			var weatherIconCodes = {
				{
					weatherType: "Thunderstorms",
					weatherId: [201,202,211,212,221,231,232,901,961],
					weatherIcon: "Cloud-Lightning.svg"
				},
				{
					weatherType: "Light Thunderstorms",
					weatherId: [200,210,220],
					weatherIcon: "Cloud-Lightning-Sun.svg"
				},
				{
					weatherType: "Drizzle",
					weatherId: [300,301,302,310],
					weatherIcon: "Cloud-Rain-Alt.svg"
				},
				{
					weatherType: "Light Rain",
					weatherId: [311,312,313,314,321,500],
					weatherIcon: "Cloud-Drizzle-Alt.svg"
				},
				{
					weatherType: "Shower",
					weatherId: [520,521],
					weatherIcon: "Cloud-Drizzle-Sun-Alt.svg"
				},
				{
					weatherType: "Rain",
					weatherId: [500, 501, 502],
					weatherIcon: "Cloud-Drizzle.svg"
				},
				{
					weatherType: "Heavy Rain",
					weatherId: [503,504]
					weatherIcon: "Cloud-Rain.svg"
				},
				{
					weatherType: "Heavy Shower",
					weatherId: [522,531],
					weatherIcon: "Cloud-Rain-Sun.svg"
				},
				{
					weatherType: "Freezing Rain",
					weatherId: [511,612],
					weatherIcon: "Cloud-Hail.svg"
				},
				{
					weatherType: "Snow",
					weatherId: [600,601,602],
					weatherIcon: "Cloud-Snow-Alt.svg"
				},
				{
					weatherType: "Snow Shower",
					weatherId: [620,621,622],
					weatherIcon: "Cloud-Snow-Sun-Alt.svg"
				},
				{
					weatherType: "Sleet",
					weatherId: [611,615,616],
					weatherIcon: "Cloud-Snow.svg"
				},
				{
					weatherType: "Mist",
					weatherId: [701,711,721,731,741,751,761,771],
					weatherIcon: "Cloud-Fog-Alt.svg"
				},
				{
					weatherType: "Tornado",
					weatherId: [781,900.962],
					weatherIcon: "Tornado.svg"
				},
				{
					weatherType: "Clear",
					weatherId: [800,904],
					weatherIcon: "Sun.svg",
				},
				{
					weatherType: "Few Clouds",
					weatherId: [801],
					weatherIcon: "Cloud-Sun.svg"
				},
				{
					weatherType: "Clouds",
					weatherId: [802,803,804],
					weatherIcon: "Cloud.svg"
				},
				{
					weatherType: "Cold",
					weatherId: [903],
					weatherIcon: "Thermometer-25.svg"
				},
				{
					weatherType: "Windy",
					weatherId: [905,925,953,954,956,957,958,959,960],
					weatherIcon: "cloud-lightning.svg"
				},
				{
					weatherType: "Hail",
					weatherId: [906],
					weatherIcon: "Cloud-Hail-Alt.svg"
				}
			};
*/
			var lat, lon, temp = 0;
			var tempUnit = "C";
			var returnedData;
			$( document ).ready(function() {
				console.log( "ready!" );
				getLocation();
				$("#weather-temp").click(function() {
					toggleTemp();
				});

				
			});
			function getLocation() {
			    if (navigator.geolocation) {
			        navigator.geolocation.getCurrentPosition(showPosition);
			    } else {
			        alert("Geolocation is not supported by this browser.");
			    }
			    
			}
			function showPosition(position) {
				lat = position.coords.latitude;
				lon = position.coords.longitude;
				getWeather(lat, lon);
			}
			
			function getWeather(lat, lon) {
				url = "https://fcc-weather-api.glitch.me/api/current?lat="+lat+"&lon="+lon;
				$.getJSON(url, function(data) {
					console.log(data);
					returnedData = data;
					tempUnit="C";
					temp=data.main.temp;
					$("#weather-icon").attr("src", "img/"+getWeatherIcon(data));
					$("#weather-temp").text(getWeatherDegrees(temp));
					$("#weather-text").text(toTitleCase(data.weather[0].description));
					$(".location").text(data.name+", "+data.sys.country);
					$(".weather").fadeIn("slow");
				})
			}
			
			function getWeatherDegrees(temp, rounding=true,) {
				if (rounding) {
					temp = Math.round(temp);
				}
				return temp+String.fromCharCode(176)+tempUnit;
			}
			
			function tempConvert() {
				if (tempUnit=="C") {
					//Convert to F
					temp = temp*9/5+32;
					tempUnit = "F";
				} else if (tempUnit=="F") {
					temp = (temp-32)*5/9;
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
			
			function toggleTemp() {
				tempConvert();
				$("#weather-temp").fadeOut(function() {
					$("#weather-temp").text(getWeatherDegrees(temp));
					$("#weather-temp").fadeIn();
				});
			}
			
			function toTitleCase(str) {
				str = str.toLowerCase();
				var words = str.split(' ');
				for (var word in words) {
					words[word] = words[word].charAt(0).toUpperCase() + words[word].slice(1);
				}
				str = words.join(' ');
				return str;				
			}
      