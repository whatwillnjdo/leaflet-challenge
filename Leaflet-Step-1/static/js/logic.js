// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function getTheColor(magnitude) {
  var color = "";
  if (magnitude < 1) {
    color = "#DEEDCF";
  }
  else if (magnitude > 1 & magnitude < 2) {
    color = "#99D492";
  }
  else if (magnitude > 2 & magnitude < 3) {
    color = "#39A96B";
  }
  else if (magnitude > 3 & magnitude < 4) {
    color = "#1D9A6C";
  }
  else if (magnitude > 4 & magnitude < 5) {
    color = "#137177";
  }
  else {
    color = "#0A2F51";
  }
  return color;
}

function createFeatures(earthquakeData) {

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    },
    pointToLayer: function(feature, latlng) {
      return new L.circle(latlng, {
        fillOpacity: 0.75,
        color: getTheColor(feature.properties.mag),
        fillColor: getTheColor(feature.properties.mag),
        radius: feature.properties.mag * 25000
      })
    }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var comicmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: MapBox_API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: MapBox_API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": comicmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [comicmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    div.innerHTML += "<h4>Earthquake Magnitude</h4>";
    div.innerHTML += '<i style="background: #DEEDCF"></i><span>0-1</span><br>';
    div.innerHTML += '<i style="background: #99D492"></i><span>1-2</span><br>';
    div.innerHTML += '<i style="background: #39A96B"></i><span>2-3</span><br>';
    div.innerHTML += '<i style="background: #1D9A6C"></i><span>3-4</span><br>';
    div.innerHTML += '<i style="background: #137177"></i><span>4-5</span><br>';
    div.innerHTML += '<i style="background: #0A2F51"></i><span>5+</span><br>';
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
}
