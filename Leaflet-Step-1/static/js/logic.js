// Create function for the map
function createMap(earthquake) {

    // Create the tile layer and dark layer that will be backgrounds of our map
    var earthquakemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark satellite",
        accessToken: API_KEY
    });

    // Create one base layer to hold the layers
    var baseMaps = {
        "Earthquake Map": earthquakemap,
        "Dark Map": darkmap
    };

    //Create an overlayMaps object to hold the earthquake layers
    var overlayMaps = {
        "Earthquake2": earthquake
    };

    // Create the map object with options
    var map = L.map("map-id", {
        center: [0,0],
        zoom: 12,
        layers: [earthquakemap, earthquake]
    });

    
}