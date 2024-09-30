// Initialize the Socket.IO connection
const socket = io();

// Check if geolocation is available
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;

            // Emit the user's location to the server
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error("Error getting location:", error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000, // milliseconds
            maximumAge: 0,
        }
    );
} else {
    alert("Geolocation is not supported by your browser.");
}

// Initialize the Leaflet map
const map = L.map("map").setView([0, 0], 10);

// Add a tile layer to make the map visible
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Pankaj Suman; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const markers = {}; // Initialize an object to store markers

// Listen for location updates from the server
socket.on("receive-location", (data) => { // Corrected "recieve-location" to "receive-location"
    const { id, latitude, longitude } = data;

    // Set the map view to the latest location
    map.setView([latitude, longitude], 16);

    // Check if the marker for this user already exists
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]); // Update the existing marker's position
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map); // Add a new marker
    }
});
