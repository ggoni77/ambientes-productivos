const API_BASE = "https://preseeds-ambientes-api.onrender.com";

let map, drawn = null;
function initMap() {
  map = L.map('map').setView([-32.95, -60.65], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19}).addTo(map);
  let points = [];
  map.on('click', (e) => {
    points.push([e.latlng.lat, e.latlng.lng]);
    if (drawn) map.removeLayer(drawn);
    drawn = L.polyline(points, {color:'#0a84ff'}).addTo(map);
  });
  map.on('dblclick', () => {
    if (points.length >= 3) {
      if (drawn) map.removeLayer(drawn);
      points.push(points[0]);
      drawn = L.polygon(points, {color:'#2ecc71', fillOpacity:0.2}).addTo(map);
    }
  });
  document.getElementById('btnProcess').addEventListener('click', () => {
    if (!drawn || !(drawn instanceof L.Polygon)) {
      return setOut({ok:false, hint:'Dibuja un polígono con doble click para cerrarlo.'});
    }
    const payload = {
      geometry: drawn.toGeoJSON(),
      k_zonas: parseInt(document.getElementById('k_zonas').value,10),
      ultimos_anios: parseInt(document.getElementById('n_anios').value,10),
      mejores_k: parseInt(document.getElementById('k_mejores').value,10),
      suavizado_px: parseInt(document.getElementById('suavizado').value,10)
    };
    postJSON(`${API_BASE}/process`, payload).then(setOut).catch(e=>setOut({ok:false,error:String(e)}));
  });
}
async function postJSON(url, data, timeoutMs=300000) {
  const ctl = new AbortController(); const t=setTimeout(()=>ctl.abort(), timeoutMs);
  try{
    const r = await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:ctl.signal});
    clearTimeout(t); if(!r.ok){throw new Error(`HTTP ${r.status}: ${await r.text()}`)}; return r.json();
  } finally { clearTimeout(t) }
}
function setOut(obj){ document.getElementById('out').textContent = JSON.stringify(obj,null,2); }
window.addEventListener('load', initMap);
