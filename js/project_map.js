// initialize map, centered on Massachusetts and Long Island, NY
let map = L.map("map").setView([41.5,-72], 8);

// set basemap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// add data & dynamic styling
fetch("/data/projects.json")
  .then(function(response) {
	return response.json();
  })
  .then(function(data) {
	L.geoJSON(data, {onEachFeature: function(feature, layer) {
	  // redefine the background-color to be transparent
	  const rgb = feature.properties.color;
	  const rgba = rgb.replace("rgb", "rgba").replace(")", ", 0.6)");
	  layer.bindPopup(`
		<div class="popup" style="background-color: ${rgba}; padding: 5px;">
		<h2>${feature.properties.name} <a href="${feature.properties.link}" target="_blank">://</a></h2>
		<p>${feature.properties.orgDescription}</p>
		<p>${feature.properties.description}</p>
		${feature.properties.galleryHTML}
		</div>
	  `,{minWidth: 500, maxHeight: 400});}
	}).addTo(map);
  });

// add header to map
/*
let explanation = L.control({position: "topright"});
explanation.onAdd = function() {
  let div = L.DomUtil.create("div", "explanation");
  div.innerHTML = `<p style="font-size: 1.5vw; text-align: center; margin-top: 5px; margin-bottom: 5px">Click a pop-up to learn more about my experiences!</p>`;
  return div;
};
explanation.addTo(map);
*/
// conflicting with z-index of popups