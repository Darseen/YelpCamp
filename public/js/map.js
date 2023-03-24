const camp = campground;
const map = L.map('map').setView([camp.lat, camp.lon], 9);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
const marker = L.marker([camp.lat, camp.lon])
    .bindPopup(`<h5>${camp.title}</h5><p>${camp.location}</p>`).openPopup()
    .addTo(map)

if (camp.lat === 39.147 && camp.lon === -102.019) {
    marker.remove();
}

const Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});

Stadia_AlidadeSmooth.addTo(map);

const camps = campgrounds || null;

if (camps) {
    const markers = [];
    for (let i = 0; i < camps.length; i++) {
        const camp = camps[i];
        const marker = L.marker([camp.lat, camp.lon]).bindPopup(camp.popUpMarkUp);
        markers.push(marker);
    }
    const markerCluster = L.markerClusterGroup();
    for (let i = 0; i < markers.length; i++) {
        markerCluster.addLayer(markers[i]);
    }
    map.addLayer(markerCluster);
    map.fitBounds(markerCluster.getBounds());
}