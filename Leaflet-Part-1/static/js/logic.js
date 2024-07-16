
  // Function to determine marker color based on depth
  function getColor(depth) {
    if (depth < 10) {
      hue = 120 - (20*1);            // Green
    } else if (depth < 30) {
      hue = 120 - (20*2);            // Light Green
    } else if (depth < 50) {
      hue = 120 - (20*3);            // Yellow
    } else if (depth < 70) {
      hue = 120 - (20*4);            // Orange
    } else if (depth < 90) {
      hue = 120 - (20*5);            // Dark Orange
     } else {
      hue = 120 - (20*6);            // Red
    }
    return `hsl(${hue}, 100%, 50%)`;
  }
  // Hue (H): This is the type of color you want.
  //  It ranges from 0 to 360, where 0 is red, 120 is green, and 240 is blue.
  //
  // Saturation (S): This parameter specifies the intensity of the color.
  //  It ranges from 0% to 100%, where 0% is a shade of gray
  //  and 100% is the full color.
  //
  // Lightness (L): This parameter controls how light or dark the color is.
  //  It also ranges from 0% to 100%, where 0% is black, 50% is normal,
  //  and 100% is white.


  // URL of the JSON data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
// Use d3.json() to fetch the JSON data
d3.json(url).then(function(data) {

  // Once the data is loaded, you can work with it here
  console.log(data); 

  // Initialize the Leaflet map
  const map = L.map('map').setView([37.0902, -95.7129], 4); 

  // Add a tile layer to the map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);



  // ### REMOVED SET COLOR FUNCTION FROM THIS AREA



  // Loop through the earthquake data and create markers on the map
  data.features.forEach(function(feature) {
    const coordinates = feature.geometry.coordinates;
    const magnitude = feature.properties.mag;
    const depth = coordinates[2];
    const title = feature.properties.title

    // Calculate marker size based on earthquake magnitude
    // const markerSize = magnitude * 5; 
    const markerSize = magnitude * 3; 

    // Calculate marker color based on earthquake depth
    const markerColor = getColor(depth); 

    // Create a marker with size and color based on earthquake data
    L.circleMarker([coordinates[1], coordinates[0]], {
        radius: markerSize,
        color: 'green',
        fillColor: markerColor,
        fillOpacity: 0.7
    }).addTo(map).bindPopup(`Magnitude: ${magnitude}<br>Depth: ${depth}<br>${title}`);
  });

  // Add legend to map
  let legend = L.control({ position: 'bottomright' });
  legend.onAdd = function(){
    let div = L.DomUtil.create('div','info legend')
    div.style.backgroundColor = 'white'; 
    div.style.padding = '10px'; 
    div.style.borderRadius = '5px'; 

    const depths = [-10, 10, 30, 50, 70, 90];
    let labels = [];

    div.innerHTML +="<ul>"; 
    // Loop through depth intervals and create a colored legend
    depths.forEach((depth, index) => {
      div.innerHTML += 
        '<li style="background:' + getColor(depth) + '">' + 
        (depths[index + 1] ? `${depth}-${depths[index + 1]}` : `${depth}+`) + '</li>'; 
    });
    div.innerHTML += "</ul>";

    return div;
  };
  legend.addTo(map);

}).catch(function(error) {
    console.log('Error fetching the data:', error);
});
