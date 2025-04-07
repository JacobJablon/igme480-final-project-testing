const fetchPlacesFromOSM = async (latitude, longitude) => {
    // For testing puroposes, you may need to increase the radius and/or change the API query
    // For example, you can try "amenity"="cafe"
    const radius = 1000; // radius in meters
    const query = `
        [out:json];
        node["amenity"="cafe"](around:${radius},${latitude},${longitude});
        out;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch POIs from OpenStreetMap");

        const data = await response.json();

        const places = data.elements.map(el => ({
            name: el.tags.name || "Unknown Attraction",
            latitude: el.lat,
            longitude: el.lon
        }));

        loadPlaces(places);
    } catch (error) {
        console.error("Error fetching POIs:", error);
        alert("Failed to load POIs. Please try again.");
    }
};

const loadPlaces = (places) => {
    const scene = document.querySelector("a-scene");

    places.forEach(place => {
        const entity = document.createElement("a-entity");

        entity.setAttribute("gps-entity-place", `latitude: ${place.latitude}; longitude: ${place.longitude}`);
        entity.setAttribute("geometry", "primitive: sphere");
        entity.setAttribute("material", "color: blue");

        const text = document.createElement("a-text");
        text.setAttribute("value", place.name);
        text.setAttribute("align", "center");
        text.setAttribute("position", "0 2 0");
        entity.appendChild(text);

        entity.addEventListener("click", () => alert(`You clicked on: ${place.name}`));

        scene.appendChild(entity);
    });
};

const mapboxStuff = () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoianJqODI1MCIsImEiOiJjbTM1YjZhNG0wNzFsMmxwdjF6ZjZhdG9nIn0.y_SDHGNopM9DYzaAqYC5mw';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10'
    });

    map.setZoom(9);
    map.setCenter([-77.6799, 43.083848]); // note the order - it's longitude,latitude - which is opposite of Google Maps
    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());
}

// create a function to make a directions request and update the destination
const getRoute = async (end) => {
    // make a directions request using cycling profile
    const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry;
    const geojson = {
        'type': 'Feature',
        'properties': {},
        'geometry': data.geometry
    };

    if (map.getSource('route')) {
        // if the route already exists on the map, reset it using setData
        map.getSource('route').setData(geojson);
    }

    // otherwise, add a new layer using this data
    else {
        map.addLayer({
            id: 'route',
            type: 'line',
            source: {
                type: 'geojson',
                data: geojson
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#3887be',
                'line-width': 5,
                'line-opacity': 0.75
            }
        });
    }
}

window.onload = () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchPlacesFromOSM(latitude, longitude);
        },
        (error) => {
            console.error("Geolocation error:", error);
            alert("Failed to get location. Please enable location services.");
        }
    );

    mapboxStuff();
};