var x = document.getElementById("demo");
var longitude,latitude;
var temp;


function toggleUnit() {
   if($(".temperatureText").text().indexOf("C") >= 0) {
      $(".temperatureText").html("<font size='24' face='verdana'>"+(temp * 9/5+32)+" F</font>");
   } else {
       $(".temperatureText").html("<font size='24' face='verdana'>"+temp+" °C</font>");
   }
}
$(document).ready(function() {

  $(".container").hide();
	getLocation();
});
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPositionWeather);
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPositionWeather(position) {
   latitude  =  position.coords.latitude;
   longitude =  position.coords.longitude;
   var geocoder = new google.maps.Geocoder();
   var latlng = new google.maps.LatLng(latitude, longitude);
   var locationName; 
   geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
         //formatted address
        locationName = results[0].formatted_address;
        } else {
          alert("No results found");
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
    var URL = "https://fcc-weather-api.glitch.me/api/current?lat="+latitude+"&lon="+longitude;
    $.getJSON( URL, {
    tags: "",
    tagmode: "any",
    format: "json"
  })
    .done(function( data ) {
      $(".container").show();
      var baseURL= "../LocalWeather";
      var bgImgURL="";
      if(parseInt(data.main.temp) >=30) {
         bgImgURL = baseURL+"/img/sunny.png";
         $('body').css('background-image', 'url('+bgImgURL+')');
         $('body').css('background-repeat', 'no-repeat');
         $('body').css('background-size', 'cover');
      } else if(parseInt(data.main.temp) <30  && data.weather[0].description.indexOf("cloud") <0 && data.weather[0].description.indexOf("rain")  ) {
         bgImgURL = baseURL+"/img/cool.jpeg";
         $('body').css('background-image', 'url('+bgImgURL+')');
         $('body').css('background-repeat', 'no-repeat');
         $('body').css('background-size', 'cover');
      } else if(data.weather[0].description.indexOf("cloud") >=0) {
         bgImgURL = baseURL+"/img/cloudy.jpeg";
         $('body').css('background-image', 'url('+bgImgURL+')');
         $('body').css('background-repeat', 'no-repeat');
         $('body').css('background-size', 'cover');
      } else if(data.weather[0].description.indexOf("rain") >=0) {
         bgImgURL = baseURL+"/img/rainy.jpeg";
         $('body').css('background-image', 'url('+bgImgURL+')');
         $('body').css('background-repeat', 'no-repeat');
         $('body').css('background-size', 'cover');
      } else {
         bgImgURL = baseURL+"/img/any.jpeg";
         $('body').css('background-image', 'url('+bgImgURL+')');
         $('body').css('background-repeat', 'no-repeat');
         $('body').css('background-size', 'cover');
      }
      temp = Math.round(parseInt(data.main.temp).toFixed(1));
      $(".temperatureImage").html("<img src="+data.weather[0].icon+"/>");
      $(".temperatureText").html("<font size='24' face='verdana'>"+data.main.temp+" °C</font>");
      $(".locationName").html(locationName);
      $(".weatherDescription").html(data.weather[0].description);
      $(".windSpeed").html("SW "+data.wind.speed+" knots");
    });
}