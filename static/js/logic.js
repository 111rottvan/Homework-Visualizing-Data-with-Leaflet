// Creating map object
// var myMap = L.map("map", {
//   center: [37.0902, 95.7129],
//   zoom: 1.5
// });



// Link to GeoJSON
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson" 

var plates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
console.log (plates)

function markersize(magnitude) {
  return magnitude * 4
}

var earthQuakes = new L.LayerGroup();

d3.json(url, function (geoJson){
  L.geoJson(geoJson.features, {
    pointToLayer: function (geoJsonPoint, latlng) {
      return L.circleMarker(latlng, {radius: markersize(geoJsonPoint.properties.mag)});
    },
    style: function (geoJsonFeature) {
      return {
        fillColor: Color(geoJsonFeature.properties.mag),
        fillOpacity: 0.7,
        weight: 0.1,
        color: "black"
      }
    }, 

    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "<h4 style='text-align:center;' >" + new Date(feature.properties.time) +
        "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
    }
  }).addTo(earthQuakes);
  createMap(earthQuakes);
});

var plateBoundary = new L.LayerGroup();
d3.json(plates, function (geoJson) {
  L.geoJson(geoJson.features, {
    style: function (geoJsonFeature) {
      return {
        weight: 2,
        color: 'magenta'
      }
    },
  }).addTo(plateBoundary);
})

function Color(magnitude) {
  if (magnitude > 5) {
      return 'red'
  } else if (magnitude > 4) {
      return 'darkorange'
  } else if (magnitude > 3) {
      return 'tan'
  } else if (magnitude > 2) {
      return 'yellow'
  } else if (magnitude > 1) {
      return 'darkgreen'
  } else {
      return 'lightgreen'
  }
};

function createMap() {

    var highContrastMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.high-contrast',
        accessToken: 'pk.eyJ1Ijoic2hla2hhcjAxNCIsImEiOiJjanBraXk1d20wM3czNDNrOWdvMnc5Mmw4In0.CSFCassjDmk_YZR814NhOg'
    });

    var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoic2hla2hhcjAxNCIsImEiOiJjanBraXk1d20wM3czNDNrOWdvMnc5Mmw4In0.CSFCassjDmk_YZR814NhOg'
    });

    var darkMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.dark',
        accessToken: 'pk.eyJ1Ijoic2hla2hhcjAxNCIsImEiOiJjanBraXk1d20wM3czNDNrOWdvMnc5Mmw4In0.CSFCassjDmk_YZR814NhOg'
    });


    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: 'pk.eyJ1Ijoic2hla2hhcjAxNCIsImEiOiJjanBraXk1d20wM3czNDNrOWdvMnc5Mmw4In0.CSFCassjDmk_YZR814NhOg'
    });

  var baseLayers = {
    "High Contrast": highContrastMap,
    "Street": streetMap,
    "Dark": darkMap,
    "Satellite": satellite
  };

  var overlays = {
    "Earthquakes": earthQuakes,
    "Plate Boundaries": plateBoundary,
  };

  var myMap = L.map('myMap', {
    center: [40, -99],
    zoom: 4.3,
    layers: [streetMap, earthQuakes, plateBoundary] 
  });

  L.control.layers(baseLayers, overlays).addTo(myMap);

  var legend = L.control({ position: 'bottomright'});

  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
          magnitude = [0, 1, 2, 3, 4, 5],
          labels = [];

      div.innerHTML += "<h4 style='margin:5px'>Magnitude</h4>"

      for (var i = 0; i < magnitude.length; i++) {
          div.innerHTML +=
              '<i style="background:' + Color(magnitude[i] + 1) + '"></i> ' +
              magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
      }

      return div;
  };
  legend.addTo(myMap);
}