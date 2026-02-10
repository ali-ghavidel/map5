

/* =====================
Icons
===================== */

const activeIcon = new L.Icon({
  iconUrl: '/AMarker.png',
  // shadowUrl: '/marker-shadow.png',
  iconSize: [25, 25],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  // shadowSize: [41, 41]
});

const inactiveIcon = new L.Icon({
  iconUrl: '/Dmarker.png',
  // shadowUrl: '/marker-shadow.png',
  iconSize: [25, 25],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  // shadowSize: [41, 41]
});

/* =====================
   Map Initialization
===================== */

// const key = 'xG6wRSZ8Wcxgpqc5iLR3';
// const map = L.map('map').setView([49.2125578, 16.62662018], 14); //starting position
// // https://api.maptiler.com/maps/019c3d6d-3e7c-7dd2-b4f3-42eb35cc52ad/?key=DKwYEKyMxmVZVvxIoH6b#{z}/{x}/{y}
// L.tileLayer(`https://api.maptiler.com/maps/019ad9fd-0815-722d-a0f2-fca15bd007df/{z}/{x}/{y}/?key=Lp5oDUU1mBcg1rNurrg0`,{ //style URL
//   // tileSize: 512,
//   zoomOffset: -1,
//   minZoom: 1,
//   attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
//   // crossOrigin: true
// }).addTo(map);

const map = L.map('map', {
  // zoomSnap: 0.25,
  minZoom: 6,

}).setView([36.283337, 59.611196], 15.43);

// https://tile.openstreetmap.org/{z}/{x}/{y}.png
// https://tile.osm.ch/switzerland/{z}/{x}/{y}.png
// https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png
// https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png streetProb
// https://tile.openstreetmap.bzh/ca/{z}/{x}/{y}.png
// https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png good
// https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png good
// https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png
// https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png

// https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=Lp5oDUU1mBcg1rNurrg0

//xG6wRSZ8Wcxgpqc5iLR3
L.tileLayer('https://api.maptiler.com/maps/019c3d6d-3e7c-7dd2-b4f3-42eb35cc52ad/?key=DKwYEKyMxmVZVvxIoH6b#0.3/31.27676/-43.78558', {
  maxZoom: 21,
  attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
}).addTo(map);

// L.tileLayer(
//   'https://api.maptiler.com/maps/019c3d6d-3e7c-7dd2-b4f3-42eb35cc52ad/{z}/{x}/{y}.png?key=DKwYEKyMxmVZVvxIoH6b',
//   {
//     tileSize: 512,
//     zoomOffset: -1,
//     minZoom: 0,
//     maxZoom: 21,
//     attribution:
//       '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> ' +
//       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//   }
// ).addTo(map);


/* =====================
   State
===================== */
let activeMarker = null;
const markers = [];

/* =====================
   Marker Factory
===================== */
function createMarker(lat, lng, title) {
  const marker = L.marker([lat, lng], {
    icon: inactiveIcon
  });

  marker.bindPopup(`<b>${title}</b>`);

  marker.on('popupopen', () => {
    activeMarker = marker;
    updateMarkersVisibility();
    updateMarkerStyles();
    updateResetButtonState();
  });

  marker.on('popupclose', () => {
    activeMarker = null;
    updateMarkersVisibility();
    updateMarkerStyles();
    updateResetButtonState();
  });

  markers.push(marker);
  marker.addTo(map);
}


/* =====================
   Markers
===================== */
createMarker(36.27614098513914, 59.605587458652465, 'darvishi');
createMarker(36.278458967526966, 59.60730407223314, 'ghasr');
createMarker(36.2800157827304, 59.61065146871547, 'jahan');
createMarker(36.281434187327626, 59.61172435220338, 'iran zamin');

/* =====================
   Visibility Logic
===================== */
function updateMarkersVisibility() {
  const zoom = map.getZoom();

  // zoom پایین
  if (zoom <= 15) {
    markers.forEach(marker => {
      if (marker === activeMarker) {
        if (!map.hasLayer(marker)) map.addLayer(marker);
      } else {
        if (map.hasLayer(marker)) map.removeLayer(marker);
      }
    });
  }
  // zoom بالا
  else {
    markers.forEach(marker => {
      if (!map.hasLayer(marker)) map.addLayer(marker);
    });
  }
}

/* =====================
   Events
===================== */
map.on('zoomend', updateMarkersVisibility);

/* =====================
   Zoom Indicator Control
===================== */
const ZoomControl = L.control({ position: 'topright' });

ZoomControl.onAdd = function () {
  const div = L.DomUtil.create('div', 'zoom-indicator');
  div.innerHTML = `Zoom: ${map.getZoom()}`;
  return div;
};

ZoomControl.addTo(map);

/* =====================
   Update Zoom Indicator
===================== */
map.on('zoomend', () => {
  const el = document.querySelector('.zoom-indicator');
  if (el) {
    el.innerHTML = `Zoom: ${map.getZoom()}`;
  }
});

/* =====================
   Reset Zoom Control (flyTo + disabled)
===================== */
const ResetZoomControl = L.control({ position: 'bottomleft' });
let resetBtn = null;

ResetZoomControl.onAdd = function () {
  const wrapper = L.DomUtil.create('div', 'reset-zoom-wrapper');

  resetBtn = L.DomUtil.create('button', 'reset-zoom-btn', wrapper);
  resetBtn.innerText = 'Reset Zoom';

  L.DomEvent.disableClickPropagation(wrapper);
  L.DomEvent.disableScrollPropagation(wrapper);

  resetBtn.onclick = () => {
    if (!activeMarker || resetBtn.disabled) return;

    map.flyTo(activeMarker.getLatLng(), 18, {
      animate: true,
      duration: 1
    });

    activeMarker.openPopup();
  };

  updateResetButtonState();
  return wrapper;
};

ResetZoomControl.addTo(map);

function updateResetButtonState() {
  if (!resetBtn) return;

  if (!activeMarker) {
    resetBtn.disabled = true;
    return;
  }

  const zoom = map.getZoom();
  const center = map.getCenter();
  const target = activeMarker.getLatLng();

  const isSameZoom = zoom === 18;
  const isSameCenter =
    Math.abs(center.lat - target.lat) < 0.00001 &&
    Math.abs(center.lng - target.lng) < 0.00001;

  resetBtn.disabled = isSameZoom && isSameCenter;
}

map.on('zoomend moveend', updateResetButtonState);

markers.forEach(marker => {
  marker.on('popupopen popupclose', updateResetButtonState);
});

/* =====================
   updateMarkerStyles
===================== */

function updateMarkerStyles() {
  if (!activeMarker) {
    markers.forEach(m => m.setIcon(inactiveIcon));
    return;
  }

  markers.forEach(marker => {
    if (marker === activeMarker) {
      marker.setIcon(activeIcon);
      marker.setZIndexOffset(1000);
    } else {
      marker.setIcon(inactiveIcon);
      marker.setZIndexOffset(0);
    }
  });
}
