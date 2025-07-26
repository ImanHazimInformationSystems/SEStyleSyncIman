// js/map.js

/**
 * Initializes and displays a Leaflet map on the 'map' div.
 * This function is called when the DOM content is fully loaded.
 */

let map; // Global variable to hold the map instance
let deliveryMarker; // Global variable to hold the delivery location marker

function initLeafletMap() {
    // Default coordinates for the delivery destination (e.g., Provo, Utah from the example image)
    // In a real application, these coordinates would come from your order tracking data.
    // Leaflet uses [latitude, longitude] array format.
    const defaultDestinationCoords = [40.233845, -111.658535];

    // You can define a hypothetical origin point as well
    const defaultOriginCoords = [34.052235, -118.243683]; // Example: Los Angeles

    // Initialize the map on the 'map' div
    // Ensure the 'map' div has a defined height in your CSS or inline style.
    map = L.map('map').setView(defaultDestinationCoords, 12); // Set view with coords and zoom level

    // Add an OpenStreetMap tile layer (default base map)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // You can add other tile layers, e.g., for satellite view if available from a provider
    // Note: Free satellite tiles are less common for direct use with Leaflet/OSM
    // Example: Stamen Toner (not satellite, but another map style)
    // L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png', {
    //     attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
    //     subdomains: 'abcd',
    //     maxZoom: 20,
    //     id: 'mapbox/streets-v11', // This example is for Mapbox, requires token
    //     accessToken: 'YOUR_MAPBOX_ACCESS_TOKEN' // If using Mapbox tiles
    // }).addTo(map);

    // Add a marker for the delivery destination
    deliveryMarker = L.marker(defaultDestinationCoords).addTo(map)
        .bindPopup('<b>Delivery Destination</b><br>Mike Montana') // Popup content
        .openPopup(); // Open the popup by default

    // Optionally, add a marker for the origin/shipping point
    L.marker(defaultOriginCoords).addTo(map)
        .bindPopup('<b>Shipping Origin</b><br>Warehouse Location');


    // --- Functions for Dynamic Map Updates (for a real tracking system) ---

    /**
     * Updates the map to show a new current location of the order.
     * In a real tracking system, this would be called with actual transit data.
     * @param {number[]} coords - An array [latitude, longitude] of the new location.
     * @param {string} popupContent - HTML content for the marker's popup.
     */
    window.updateOrderLocation = function(coords, popupContent = "Current Order Location") {
        if (deliveryMarker) {
            deliveryMarker.setLatLng(coords); // Update marker position
            deliveryMarker.setPopupContent(`<b>Current Location:</b><br>${popupContent}`);
        } else {
            // If marker doesn't exist, create it
            deliveryMarker = L.marker(coords).addTo(map)
                .bindPopup(`<b>Current Location:</b><br>${popupContent}`);
        }
        map.panTo(coords); // Center map on new position with a smooth pan animation
        map.setZoom(13); // Adjust zoom level for current location
    };

    /**
     * Placeholder for toggling map types. Leaflet with OpenStreetMap typically doesn't offer
     * a direct "Satellite" toggle without integrating another tile provider (like Mapbox, ESRI, etc.)
     * which might require API keys or different attribution.
     * For now, this will simply log a message. You would need to add a satellite tile layer
     * and switch between tile layers using Leaflet's `removeLayer` and `addLayer` methods.
     */
    window.setMapType = function(type) {
        if (type === 'roadmap') {
            console.log("Switching to Roadmap view (OpenStreetMap default).");
            // If you had multiple tile layers, you'd switch them here:
            // map.removeLayer(satelliteLayer);
            // map.addLayer(osmLayer);
        } else if (type === 'satellite') {
            console.log("Satellite view not directly supported with default OpenStreetMap tiles.");
            console.log("To add satellite view, you need to integrate a satellite tile provider (e.g., Mapbox, ESRI, Google Satellite if you have their keys).");
            // Example if you add another layer:
            // if (satelliteLayer) {
            //     map.removeLayer(osmLayer);
            //     map.addLayer(satelliteLayer);
            // }
        }
    };

    // Bind your HTML buttons to the setMapType function
    const mapButton = document.querySelector('.map-container .btn:nth-child(1)');
    const satelliteButton = document.querySelector('.map-container .btn:nth-child(2)');

    if (mapButton && satelliteButton) {
        mapButton.addEventListener('click', () => {
            window.setMapType('roadmap');
            mapButton.classList.add('active');
            satelliteButton.classList.remove('active');
        });

        satelliteButton.addEventListener('click', () => {
            window.setMapType('satellite');
            satelliteButton.classList.add('active');
            mapButton.classList.remove('active');
        });
    }

    // Set initial active state for buttons based on what is shown
    if (mapButton && satelliteButton) {
        // Assuming OpenStreetMap (Roadmap) is the default active view
        mapButton.classList.add('active');
        satelliteButton.classList.remove('active');
    }
}

// Call initLeafletMap when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', initLeafletMap);