import { useState, useEffect } from 'react'
import MapaCalor from './components/MapaCalor'
import ForoGeneral from './components/ForoGeneral'

function App() {
  const [estadisticas, setEstadisticas] = useState(null)
  const [mostrarForo, setMostrarForo] = useState(false)
  const [disclaimerAceptado, setDisclaimerAceptado] = useState(false)

  useEffect(() => {
    fetch(`http://${window.location.hostname}:3001/api/reportes`)
      .then(res => res.json())
      .then(data => {
        const reportes = data.reportes || []
        const tipos = {}
        const colonias = new Set()
        reportes.forEach(r => {
          tipos[r.tipo] = (tipos[r.tipo] || 0) + 1
          colonias.add(r.colonia)
        })
        setEstadisticas({
          total: reportes.length,
          colonias: colonias.size,
          graves: (tipos['robo'] || 0) + (tipos['asalto'] || 0) + (tipos['fraude'] || 0),
          tipos
        })
      })
      .catch(() => {})
  }, [])

  return (
    <div className="app">
      <header className="header">
        <div className="header-container">
          <div className="brand">
            <svg className="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <div>
              <h1>Seguro Queretaro</h1>
              <p>Mapa de Riesgo Oficial del Estado</p>
            </div>
          </div>
          <div className="header-tags">
            <span className="tag tag-green">Verificado</span>
            <span className="tag tag-blue">Mayo 2026</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="banner">
          <img src="/datos/images/foto de qro 1.jpg" alt="Queretaro" />
          <div className="banner-text">
            <h2>Tu seguridad es primero</h2>
            <p>Fuentes oficiales: SESNSP | SSPM | Fiscalia | Proteccion Civil</p>
          </div>
        </section>

        <section className="panel-row">
          <div className="panel">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              Estadisticas Q1 2026
            </h3>
            {estadisticas ? (
              <>
                <div className="stats-row">
                  <div className="stat-box"><span className="stat-num">{estadisticas.total}</span><span className="stat-lbl">Incidentes</span></div>
                  <div className="stat-box"><span className="stat-num">{estadisticas.colonias}</span><span className="stat-lbl">Colonias</span></div>
                  <div className="stat-box stat-red"><span className="stat-num">{estadisticas.graves}</span><span className="stat-lbl">Graves</span></div>
                </div>
                <div className="tipos-row">
                  {Object.entries(estadisticas.tipos).map(([tipo, cant]) => (
                    <span key={tipo} className={`tipo-tag tipo-${tipo}`}>{tipo}: {cant}</span>
                  ))}
                </div>
                <p className="stats-note">Delitos patrimoniales bajaron 9% | Alto impacto -26% [citation:8]</p>
              </>
            ) : <p className="loading-text">Cargando datos...</p>}
          </div>

          <div className="panel">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Leyenda de Riesgo
            </h3>
            <div className="legend-row">
              <span className="leg-item"><span className="leg-dot" style={{background:'#2ecc71'}}></span> Muy seguro</span>
              <span className="leg-item"><span className="leg-dot" style={{background:'#f1c40f'}}></span> Precaucion</span>
              <span className="leg-item"><span className="leg-dot" style={{background:'#e67e22'}}></span> Riesgo moderado</span>
              <span className="leg-item"><span className="leg-dot" style={{background:'#e74c3c'}}></span> Alta peligrosidad</span>
              <span className="leg-item"><span className="leg-dot" style={{background:'#c0392b'}}></span> Muy peligroso</span>
            </div>
          </div>
        </section>

        <section className="map-section">
          <div className="map-card">
            <MapaCalor />
          </div>
        </section>

        <section className="panel-row">
          <div className="panel">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              Tips de Seguridad
            </h3>
            <ul className="tips-list">
              <li>No compartas tu ubicacion en tiempo real</li>
              <li>Camina por calles iluminadas</li>
              <li>Reporta actividad sospechosa al 911</li>
              <li>Manten tu celular cargado al salir</li>
              <li>Comparte tu ruta con familiares</li>
            </ul>
          </div>

          <div className="panel emergency-panel">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              Emergencias
            </h3>
            <div className="emergency-row">
              <div className="em-item"><span className="em-num">911</span><span className="em-lbl">Emergencias</span></div>
              <div className="em-item"><span className="em-num">089</span><span className="em-lbl">Denuncia anonima</span></div>
              <div className="em-item"><span className="em-num">065</span><span className="em-lbl">Cruz Roja</span></div>
              <div className="em-item"><span className="em-num">442-238-7700</span><span className="em-lbl">Policia Qro</span></div>
            </div>
          </div>
        </section>

        <section className="gallery-section">
          <h3>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Queretaro en imagenes
          </h3>
          <div className="gallery-row">
            <img src="/datos/images/foto de qro 2.jpg" alt="Qro" />
            <img src="/datos/images/foto de qro 3.jpg" alt="Qro" />
            <img src="/datos/images/foto de qro 4.jpg" alt="Qro" />
            <img src="/datos/images/foto de qro 5.jpg" alt="Qro" />
            <img src="/datos/images/foto de poli qro 1.jpg" alt="Policia" />
          </div>
        </section>

        <section className="video-section">
          <h3>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            Video informativo
          </h3>
          <div className="video-container">
            <iframe
              src="https://www.youtube.com/embed/BTA5LpS4sJs"
              title="Video informativo de seguridad Queretaro"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        <section className="foro-section">
          <button
            onClick={() => {
              setMostrarForo(!mostrarForo)
              setDisclaimerAceptado(false)
              if (!mostrarForo) alert('Usa este foro con responsabilidad. La informacion no esta verificada.')
            }}
            className={`btn-foro ${mostrarForo ? 'active' : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            {mostrarForo ? 'Cerrar foro' : 'Foro ciudadano'}
          </button>

          {mostrarForo && (
            <div className="foro-wrapper">
              {!disclaimerAceptado ? (
                <div className="disclaimer">
                  <h3>Atencion</h3>
                  <p>Este foro es <strong>anonimo</strong> y <strong>no verificado</strong>.</p>
                  <p>Los comentarios pueden ser falsos o imprecisos.</p>
                  <button onClick={() => setDisclaimerAceptado(true)} className="btn-accept">Entiendo, entrar</button>
                </div>
              ) : (
                <ForoGeneral setMostrarForo={setMostrarForo} />
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Datos oficiales del SESNSP actualizados al 17 de abril de 2026 [citation:4]</p>
        <p>Percepcion de seguridad en Queretaro: 64.5% [citation:7] | 591 operativos POES en abril [citation:2]</p>
        <p className="footer-warning">El foro es anonimo y no representa informacion verificada</p>
        <p className="footer-sources">Fuentes: SESNSP | SSPM Queretaro | Fiscalia General | Proteccion Civil | INEGI</p>
      </footer>
    </div>
  )
}

export default App