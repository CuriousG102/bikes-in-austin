var map, featureList, boroughSearch = [], theaterSearch = [], museumSearch = [];


var markers = [];

$(window).resize(function() {
  sizeLayerControl();
});


function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

/* Basemap Layers */
var mapquestOSM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["otile1", "otile2", "otile3", "otile4"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
});
var mapquestOAM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
});
var mapquestHYB = L.layerGroup([L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"]
}), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
  attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
})]);




map = L.map("map", {
  zoom: 12,
  center: [30.2500, -97.7500],
  layers: [mapquestOSM],
  zoomControl: false,
  attributionControl: false
});



var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: false,
  strings: {
    title: "My location",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Street Map": mapquestOSM,
  "Aerial Imagery": mapquestOAM,
  "Imagery with Streets": mapquestHYB
};

var layerControl = L.control.groupedLayers(baseLayers,
{
  collapsed: isCollapsed
}).addTo(map);

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
});


function display(startDate, endDate) {
  reqMaker.bike_accidents(startDate, endDate);

}

/*
var arrayToBuild = [];

for (var i=0; i < resp.length; i++) {
   if (resp[i] !== 0)
       arrayToBuild.push([resp[i]['offenses'][0]['name'],
                          resp[i]['latitude'],
                          resp[i]['longitude']]);
}

*/
var planes = [];


var myClass = {

  display(start, end, isCrime) {

    var myFunction = function(err, resp) {
      console.log(resp);

      removeMarkers();
      for (var i=0; i < resp.length; i++) {
        if (resp[i] !== 0) {
          planes.push([resp[i]['offenses'][0]['name'],
              resp[i]['latitude'],
              resp[i]['longitude']]);
        }
      }


      addMarkers();
    }

    if (isCrime) {
      reqMaker.bike_crimes(start, end, myFunction);
    }
    else reqMaker.bike_accidents (start, end, myFunction);
  }

}

$().ready(function() {
  var myObject = Object.create(myClass);
  missionControl.addClient(myObject.display);
});


var theftIcon = L.icon({
  iconUrl: 'assets/img/theft.png',
  iconSize: [32, 32]
});

var crashIcon = L.icon({
    iconUrl: 'assets/img/crash.png',
    iconSize: [32, 32]
  });

var injuryIcon = L.icon({
    iconUrl: 'assets/img/injury.png',
    iconSize: [32, 32]
  });

var abandonedIcon = L.icon({
    iconUrl: 'assets/img/abandoned.png',
    iconSize: [32, 32]
  });


var addMarkers = function() {
  for (var i=0; i < planes.length; i++) {
    if (planes[0][0] == "THEFT OF BICYCLE") {
      var marker = new L.marker([planes[i][1],planes[i][2]], {icon: theftIcon});
    marker
      .bindPopup(planes[i][0])
      .addTo(map);
    markers.push(marker);
    }

    if (planes[0][0] == "CRASH/AUTO VS BICYCLE") {
      var marker = new L.marker([planes[i][1],planes[i][2]], {icon: crashIcon});
    marker
      .bindPopup(planes[i][0])
      .addTo(map);
    markers.push(marker);
    }

    if (planes[0][0] == "BICYCLIST INJURED") {
      var marker = new L.marker([planes[i][1],planes[i][2]], {icon: injuryIcon});
    marker
      .bindPopup(planes[i][0])
      .addTo(map);
    markers.push(marker);
    }

    if (planes[0][0] == "ABANDONED BICYCLES/PARTS") {
      var marker = new L.marker([planes[i][1],planes[i][2]], {icon: injuryIcon});
    marker
      .bindPopup(planes[i][0])
      .addTo(map);
    markers.push(marker);
    }

  }
}

var removeMarkers = function() {
  planes = [];
  for (var i=0; i < markers.length; i++) {
    map.removeLayer(markers[i]);
  }
}



