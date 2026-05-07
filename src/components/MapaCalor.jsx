import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.heat'

function HeatLayer({ puntos }) {
  const map = useMap()
  useEffect(() => {
    if (!puntos || puntos.length === 0) return
    try {
      const heat = L.heatLayer(puntos, {
        radius: 35,
        blur: 20,
        maxZoom: 10,
        max: 1.0,
        gradient: {
          0.0: '#2ecc71',
          0.25: '#f1c40f',
          0.5: '#e67e22',
          0.75: '#e74c3c',
          1.0: '#c0392b'
        }
      })
      heat.addTo(map)
      return () => { if (map.hasLayer(heat)) map.removeLayer(heat) }
    } catch (e) {
      console.error('Error heat layer:', e)
    }
  }, [puntos, map])
  return null
}

const iconColors = {
  robo: 'red',
  asalto: 'orange',
  vandalismo: 'yellow',
  accidente: 'blue',
  sospechoso: 'gray'
}

function MapaCalor() {
  const [datos, setDatos] = useState({ reportes: [], calor: [] })
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    fetch(`http://${window.location.hostname}:3001/api/reportes`)
      .then(res => res.json())
      .then(data => {
        setDatos(data)
        setCargando(false)
      })
      .catch(() => setCargando(false))
  }, [])

  if (cargando) return <div className="loading">Cargando mapa...</div>

  return (
    <MapContainer center={[20.5881, -100.3899]} zoom={11} style={{ height: '100%', width: '100%' }}>
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution=''
      />
      <HeatLayer puntos={datos.calor} />
      {datos.reportes.map((r, i) => (
        <Marker
          key={i}
          position={[r.lat, r.lng]}
          icon={new L.Icon({
            iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${iconColors[r.tipo] || 'violet'}.png`,
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
          })}
        >
          <Popup>
            <strong>{r.tipo.toUpperCase()}</strong><br />
            {r.descripcion}<br />
            <small>{r.colonia} | {r.fecha} | {r.fuente}</small>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapaCalor