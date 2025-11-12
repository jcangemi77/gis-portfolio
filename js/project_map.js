// initialize map, centered on Massachusetts and Long Island, NY
let map = L.map("map").setView([41.5,-72], 7);

// set basemap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let geojson;

// configure gallery to change on popup open
map.on("popupopen", function(e) {
  // hide About Me
  document.getElementById("gallery_initial").style.display = "none";

  // format Gallery
  document.getElementById("gallery_popup").style.display = "flex";
  const gallery = document.getElementById("gallery_popup");
  gallery.innerHTML = "";		// clear previous content
  const img = e.popup._source.gallery;
  for (let i=0; i < img.length; i++){
	gallery.innerHTML +=
		"<figure>" +
		"<a href='" + img[i].src + "'target='_blank'><img src='" + img[i].src + "'></a>" +
		"<figcaption>" + img[i].caption + "</figcaption>" +
		"</figure>";
  };

  // create button to return to About Me
  document.getElementById("return_button").innerHTML = `<input id="return" type="button" value="Return to About Me">`
  configureReturn();

});

fetch("data/projects.json")
  .then(function(response) {
	return response.json();
  })
  .then(function(data) {
	geojson = L.geoJSON(data, {onEachFeature: function(feature, layer) {
	  // redefine the background-color to be transparent
	  const rgb = feature.properties.color;
	  const rgba = rgb.replace("rgb", "rgba").replace(")", ", 0.6)");
	  // set metadata for gallery
	  layer.gallery = feature.properties.gallery;
	  // configure popup
	  layer.bindPopup(`
		<div class="popup" style="background-color: ${rgba}; padding: 5px;">
		<h2>${feature.properties.name} <a href="${feature.properties.link}" target="_blank">://</a></h2>
		<p>${feature.properties.description}</p>
		<p>${feature.properties.experience}</p>
		</div>
	  `,{minWidth: 400, maxHeight: 300});
	}}).addTo(map);
  });

// configure Return to About Me button
function configureReturn() {
  document.getElementById("return").addEventListener("click", function() {
	document.getElementById("gallery_initial").style.display = "inline";
	document.getElementById("gallery_popup").style.display = "none";
	document.getElementById("return_button").innerHTML = "";
  });
}

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