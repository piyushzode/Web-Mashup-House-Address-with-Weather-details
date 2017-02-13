/*  
    Student Name: Piyush Zode
*/
var username = "XXXXXX";
var map;
var geocoder;
var infowindow;
var request = new XMLHttpRequest();
var addr;
var latitude_longitude;
var marker;

function initialize() {
}

//initMap() which initiates map to a location
function initMap() {
    // Initialize the map to default location
    var map_options = {
        zoom: 17,
        center: {lat: 32.75, lng: -97.13}
    }

	map = new google.maps.Map(document.getElementById('map'), map_options);
    geocoder = new google.maps.Geocoder;
    infowindow = new google.maps.InfoWindow;

    marker = new google.maps.Marker({
        map: map,
    });

	//Initialize a mouse click event on map which then calls reversegeocode function
    google.maps.event.addListener(map, 'click', function(event) {
        reversegeocode(event.latLng);
    }); 
}


function reversegeocode(event) {
    var latlng = {lat: event.lat(), lng: event.lng()}; //get the lat & lng of the placed clicked
    //console.log(latlng);
    latitude_longitude = latlng;
    //window.alert(latlng.lat);
    geocoder.geocode({'location': latlng}, function(results, status) {
        // Check the address is correct
        if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {   // Get the first address from the results array
                console.log(results[0]);
                addr = results[0].formatted_address;
                sendRequest(latlng);    // Make call to GeoName function
        } else {
            window.alert('No results found');
        }
        } else {
        window.alert('Geocoder failed due to: ' + status);
        }
    });
}


function setMarker (values_to_print) {
    marker.setMap(null); //remove the previous marker
    console.log(values_to_print)
    
    var infowindow = new google.maps.InfoWindow({
        content: addr+"<BR><BR>"+values_to_print
    });

    
    // Set up a marker at the position where the user has clicked
    marker = new google.maps.Marker({
        position: latitude_longitude,
        map: map,
        title: addr
    });

    infowindow.open(map, marker);

    // Add listner to infowindow
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

    // Recenter the map based on user click
    // map.setCenter(marker.getPosition());
}

function displayResult () {
    if (request.readyState == 4) {
        var xml = request.responseXML.documentElement;
        
        //console.log(xml)
        var temperature = xml.getElementsByTagName("observation")[0].getElementsByTagName("temperature")[0].innerHTML;
        var windSpeed = xml.getElementsByTagName("observation")[0].getElementsByTagName("windSpeed")[0].innerHTML;
        var clouds = xml.getElementsByTagName("observation")[0].getElementsByTagName("clouds")[0].innerHTML;
        
        values="<br>Temperature="+temperature+", WindSpeed="+windSpeed+", Clouds="+clouds;

        if(temperature!='' && windSpeed!='' && clouds!='') {
            setMarker(values);  // Set the marker at the users clicked position
            document.getElementById("output").innerHTML += "<p>"+addr+" : "+values+"</p>";  // Append the result to the div
        }
    }
}


function clear_history() {
    document.getElementById("output").innerHTML = "";    //Clear the users recent searches
}


function sendRequest (latLng) {
    request.onreadystatechange = displayResult;
    var lat = latLng.lat;
    var lng = latLng.lng;
    var initial_url="http://api.geonames.org/findNearByWeatherXML?lat="+lat+"&lng="+lng+"&username="+username;
    var main_url = encodeURI(initial_url);
    //console.log(main_url);
    request.open("GET",main_url,true); //true for async
    request.send(null);
}
