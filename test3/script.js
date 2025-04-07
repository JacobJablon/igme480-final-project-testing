// For testing puroposes, you may need to change these places to something closer to you
const places = [
    { stopNum: 1, name: "Innovation Square", latitude: 43.15477992677929, longitude: -77.60469787116426 },
    { stopNum: 2, name: "ITX Corp.", latitude: 43.15737553564357, longitude: -77.6066996897394 },
    { stopNum: 3, name: "Envative", latitude: 43.15950877753, longitude: -77.59793059450028 },
    { stopNum: 4, name: "MLK Park", latitude: 43.154013805527256, longitude: -77.6018083032324 },
    { stopNum: 5, name: "** Midnight Oil **", latitude: 43.082771075166235, longitude: -77.67992031857891 },
];

const loadPlaces = () => {
    const scene = document.querySelector("a-scene");

    places.forEach(place => {
        const entity = document.createElement("a-entity");

        entity.setAttribute("gps-entity-place", `latitude: ${place.latitude}; longitude: ${place.longitude}`);
        entity.setAttribute("geometry", "primitive: sphere; radius: 1");
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

    map.setZoom(13);
    map.setCenter([-77.6019995334674, 43.15697289921869]); // note the order - it's longitude,latitude - which is opposite of Google Maps
    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());
}

window.onload = () => {
    loadPlaces();
    mapboxStuff();
};