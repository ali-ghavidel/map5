import maplibregl from 'maplibre-gl';

maplibregl.setRTLTextPlugin(
  "/map5/mapbox-gl-rtl-text.js",
  null,
  true
);

// =====================
// Map Initialization
// =====================

const map = new maplibregl.Map({
  container: 'map',
  style: './style.json',
  center: [59.611196, 36.283337],
  zoom: 15.43,
  minZoom: 6
});

// =====================
// On Load
// =====================

map.on('load', () => {

  // =====================
  // Load Icons
  // =====================

  map.loadImage('/map5/AMarker.png', (err, img) => {
    if (err) throw err;
    map.addImage('activeIcon', img);
  });

  map.loadImage('/map5/DMarker.png', (err, img) => {
    if (err) throw err;
    map.addImage('inactiveIcon', img);
  });

  // =====================
  // Markers Data
  // =====================

  const features = [
    { id: 1, coordinates: [59.605587458652465, 36.27614098513914], title: 'darvishi' },
    { id: 2, coordinates: [59.60730407223314, 36.278458967526966], title: 'ghasr' },
    { id: 3, coordinates: [59.61065146871547, 36.2800157827304], title: 'jahan' },
    { id: 4, coordinates: [59.61172435220338, 36.281434187327626], title: 'iran zamin' }
  ];

  map.addSource('markers', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: features.map(f => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: f.coordinates },
        properties: { title: f.title },
        id: f.id
      }))
    }
  });

  // =====================
  // Marker Layer
  // =====================

  map.addLayer({
    id: 'markers-layer',
    type: 'symbol',
    source: 'markers',
    layout: {
      'icon-image': [
        'case',
        ['boolean', ['feature-state', 'active'], false],
        'activeIcon',
        'inactiveIcon'
      ],
      'icon-size': 1,
      'icon-allow-overlap': true
    }
  });

  // =====================
  // Popup (Single Instance)
  // =====================

  const popup = new maplibregl.Popup({
    closeButton: true,
    closeOnClick: false,
    anchor: 'bottom',
    offset: 25
  });

  let activeId = null;

  // =====================
  // Click Event
  // =====================

  map.on('click', 'markers-layer', (e) => {
    const feature = e.features[0];
    const coordinates = feature.geometry.coordinates.slice();
    const title = feature.properties.title;

    // remove previous active
    if (activeId !== null) {
      map.setFeatureState(
        { source: 'markers', id: activeId },
        { active: false }
      );
    }

    // set new active
    activeId = feature.id;
    map.setFeatureState(
      { source: 'markers', id: activeId },
      { active: true }
    );

    // show popup
    popup
      .setLngLat(coordinates)
      .setHTML(`<b>${title}</b>`)
      .addTo(map);
  });

  // =====================
  // Cursor Change
  // =====================

  map.on('mouseenter', 'markers-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'markers-layer', () => {
    map.getCanvas().style.cursor = '';
  });

});


// =====================
// Zoom Indicator
// =====================

const zoomIndicator = document.querySelector('.zoom-indicator');

map.on('zoom', () => {
  zoomIndicator.innerText = `Zoom: ${map.getZoom().toFixed(2)}`;
});

// =====================
// Reset Zoom Button
// =====================

const resetBtn = document.querySelector('.reset-zoom-btn');

resetBtn.onclick = () => {
  map.flyTo({
    center: [59.611196, 36.283337],
    zoom: 15.43
  });
};
