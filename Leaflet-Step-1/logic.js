//Store API endpoint inside queryURL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

//Perform a GET request to the query URL
d3.json(url, function(data) {
    // Console log the data to make sure pulled in
    //console.log(data);
    // send the data.features object to the createFeatures function
    createFeatures(data.features);
});

//Create a function that runs each feature above and creates the popups. Also will run a
//function that will locate the earthquake markers
function createFeatures(EQdata) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p><strong>Earthquake Magnitude: " + feature.properties.mag + "</strong></p>" +
        "</h3><hr><p><strong>" + new Date(feature.properties.time) + "</strong></p>" +
        "</h3><hr><p><strong>Earthquake Depth:" + feature.geometry.coordinates[2] + "</strong></p>");
    }

    var earthquakes = L.geoJSON(EQdata, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerRadius(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: "black",
                fillOpacity: .70,
                stroke: true,
                weight: .45
            })
        },
        onEachFeature: onEachFeature
    });
    createMap(earthquakes);
};

//Use a createMap function to create layers and legend
function createMap(earthquakes) {

    //Define satellite layer
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });

    //Define greyscale layer
    var greyscale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });

    //Define terrain layer
    var terrain = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    });

    //Create baseMaps
    var baseMaps = {
        "Light Map": satellite,
        "Satellite": greyscale,
        "Terrain Map": terrain
    };

    var plates = new L.LayerGroup();

    //Create overlayMaps
    var overlayMaps = {
        Earthquakes: earthquakes,
        "TectonicPlates": plates
    };

    var myMap = L.map("mapid", {
        center: [37,-100],
        zoom: 5,
        layers: [satellite, greyscale, terrain, earthquakes, plates]
    });

    terrain.addTo(myMap);

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    //Add legend to the map and use loop for HTML
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');
            var labels = ["0-10", "10-20", "20-30", "30-40", "40-50", ">50"];
            var colors = ["#00008B", "#0000FF","#6495ED","#1E90FF","#00BFFF","#E0FFFF"];
        for (let i = 0; i < colors.length; i++) {
            div.innerHTML +=
            "<li style='background-color: " + colors[i] + "'>" + labels[i] + "</li>"
            }
        return div;
    };
    legend.addTo(myMap);

    d3.json(tectonicURL, function(data2) {
        L.geoJson(data2, {color: "red", weight: 2})
        .addTo(plates);
        plates.addTo(myMap)
    });

    return myMap;
};

//Create a function for the marker size
function markerRadius(magnitude){
    return magnitude * 4.5;
};

//Create a function for the marker color
function markerColor(EQdepth){
    if (EQdepth <= 10) {
        return "#00008B"
    }
    else if (EQdepth <= 20) {
        return "#0000FF"
    }
    else if (EQdepth <= 30) {
        return "#6495ED"
    }
    else if (EQdepth <= 40) {
        return "#1E90FF"
    }
    else if (EQdepth <= 50) {
        return "#00BFFF"
    }
    else {
        return "#E0FFFF"
    }
};