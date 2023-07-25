//Create layer
let basemap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'", 
    {
        attribution: 
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

// Create map object
let map = L.map("map", {
    center: [40.7, -94.5],
    zoom: 3
});

basemap.addTo(map)

// Pull json data 
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data){
    function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: getColor(feature.geometry.coordinates[2]),
          color: "#000000",
          radius: getRadius(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };    
    }

    function getColor(depth) {
        switch (true) {
            case depth > 90:
                return "#581835";
            case depth > 70:
                return "#900c1e";
            case depth > 50:
                return "#c70007";
            case depth > 30:
                return "#ff8a33";
            case depth > 10:
                return "#ffd800";
            default:
                return "#c6f7A6";
        }
    }
    function getRadius(magnitude){
        if (magnitude === 0) {
            return 1;
        }
        return magnitude*4
    }

    //geojson layer
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng)
        },
        style: styleInfo,
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "Magnitude: "
                + feature.properties.mag
                + "<br>Depth: "
                + feature.geometry.coordinates[2]
                + "<br>Location: "
                +feature.properties.place
            );
        }
    }).addTo(map)

    //make legend
    let legend = L.control({
        position: "bottomright"
    });
    
    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");
        
        let grades = [-10, 10, 30, 50, 70, 90];
        let colors = [
            "#c6f7A6",
            "#ffd800",
            "#ff8a33",
            "#c70007",
            "#900c1e",
            "#581835"
        ];

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i>"
            + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    };
    
    legend.addTo(map)
})
