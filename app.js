    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            osm = L.tileLayer(osmUrl, { maxZoom: 18, attribution: osmAttrib }),
            map = new L.Map('map', { center: new L.LatLng(51.505, -0.04), zoom: 13 }),
            drawnItems = L.featureGroup().addTo(map);
    L.control.layers({
        'osm': osm.addTo(map),
        "google": L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
            attribution: 'google'
        })
    }, { 'drawlayer': drawnItems }, { position: 'topleft', collapsed: false }).addTo(map);
    map.addControl(new L.Control.Draw({
        edit: {
            featureGroup: drawnItems,
            poly: {
                allowIntersection: false
            }
        },
        draw: {
            polygon: {
                allowIntersection: false,
                showArea: true
            }
        }
    }));

    map.on(L.Draw.Event.CREATED, function (event) {
        var layer = event.layer;
            feature = layer.feature = layer.feature || {};
    
        feature.type = feature.type || "Feature";
        var props = feature.properties = feature.properties || {};
        //layer.feature = {properties: {}}; // No need to convert to GeoJSON.
        //var props = layer.feature.properties;
        props.name = null;
        props.image = null;
        drawnItems.addLayer(layer);
        addPopup(layer);
    });

    function addPopup(layer) {
        var content = document.createElement("textarea");
        content.addEventListener("keyup", function () {
            layer.feature.properties.desc = content.value;
        });
        layer.on("popupopen", function () {
            content.value = layer.feature.properties.desc;
          content.focus();
        });
        layer.bindPopup(content).openPopup();
    }

    //delete  and download feature
    // on click, clear all layers
    document.getElementById('delete').onclick = function(e) {
        drawnItems.clearLayers();
    }

    document.getElementById('export').onclick = function(e) {
        // Extract GeoJson from featureGroup
        var data = drawnItems.toGeoJSON();

        // Stringify the GeoJson
        var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

        // Create export
        document.getElementById('export').setAttribute('href', 'data:' + convertedData);
        document.getElementById('export').setAttribute('download','data.geojson');
    }