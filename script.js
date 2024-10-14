// Inicializar el mapa
const map = L.map('map').setView([19.4326, -99.1332], 12); // Coordenadas de la ciudad (CDMX)

// Cargar y mostrar un mapa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Crear el ícono personalizado de la patrulla
const patrolIcon = L.icon({
  iconUrl: 'patrol-icon.png',  // Asegúrate de tener esta imagen en la misma carpeta o proporciona la URL correcta
  iconSize: [32, 37],
  iconAnchor: [16, 37],
  popupAnchor: [0, -37]
});

let patrolMarkers = [];

function loadPatrolData() {
  const patrolData = [
    { id: 1, lat: 19.428, lng: -99.13 },
    { id: 2, lat: 19.432, lng: -99.14 },
    { id: 3, lat: 19.434, lng: -99.12 },
    { id: 4, lat: 19.436, lng: -99.15 },
    
  ];

  patrolMarkers.forEach(marker => map.removeLayer(marker));
  patrolMarkers = [];

  patrolData.forEach(patrol => {
    const marker     = L.marker([patrol.lat, patrol.lng], { icon: patrolIcon })
      .bindPopup(`<b>Patrulla ID: ${patrol.id}</b>`)
      .addTo(map);
    patrolMarkers.push(marker);
  });

  setTimeout(loadPatrolData, 5000);
}

// Añade tus puntos de origen y destino
const origin = [19.4326, -99.1332];  // Ejemplo: Centro de CDMX
const destination = [19.437, -99.15]; // Ejemplo: Otra ubicación en CDMX

let routingControl = null; // Variable para almacenar el control de la ruta

function findRoute() {
  // Eliminar cualquier ruta anterior
  if (routingControl !== null) {
    map.removeControl(routingControl);
  }

  // Crear un array con las ubicaciones de las patrullas para evitarlas
  const avoidPoints = patrolMarkers.map(marker => L.latLng(marker.getLatLng()));

  // Crear el control de ruta
  routingControl = L.Routing.control({
    waypoints: [
      L.latLng(origin),
      L.latLng(destination)
    ],
    createMarker: () => null, // No crea marcadores de ruta predeterminados
    routeWhileDragging: true,
    lineOptions: {
      styles: [{ color: 'blue', opacity: 0.6, weight: 5 }]
    },
    router: L.Routing.osrmv1({
      serviceUrl: 'https://router.project-osrm.org/route/v1' // Usa el servicio OSRM de enrutamiento
    }),
    // Evitar ubicaciones de las patrullas
    avoidWaypoints: avoidPoints,
    addWaypoints: false
  }).addTo(map);

  routingControl.on('routesfound', function(e) {
    const route = e.routes[0];
    console.log('Ruta encontrada:', route);
  });

  routingControl.on('routingerror', function(e) {
    alert('No se pudo encontrar una ruta evitando las patrullas.');
  });
}

loadPatrolData();
