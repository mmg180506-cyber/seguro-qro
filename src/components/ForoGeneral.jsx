import { useState, useEffect, useRef } from 'react'

const API = `http://${window.location.hostname}:3001`

function ForoGeneral({ setMostrarForo }) {
  const [mensajes, setMensajes] = useState([])
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  const cargar = async () => {
    try {
      const res = await fetch(`${API}/api/foro`)
      if (res.ok) setMensajes(await res.json())
    } catch (e) {
      console.log('Error cargando foro:', e)
    }
  }

  useEffect(() => {
    cargar()
    const id = setInterval(cargar, 10000)
    return () => clearInterval(id)
  }, [])

  const enviar = async (e) => {
    e.preventDefault()
    if (!texto.trim() || enviando) return
    setError('')
    setEnviando(true)
    try {
      const res = await fetch(`${API}/api/foro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: texto.trim() })
      })
      const data = await res.json()
      if (res.ok) {
        setTexto('')
        await cargar()
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        setError(data.error || 'Error al publicar')
      }
    } catch (e) {
      setError('Error de conexión')
    } finally {
      setEnviando(false)
    }
  }

  const formatear = (fecha) => {
    const d = new Date(fecha)
    if (isNaN(d.getTime())) return 'Recién'
    
    const ahoraMs = Date.now()
    const diff = ahoraMs - d.getTime()
    const segundos = Math.floor(diff / 1000)
    const minutos = Math.floor(segundos / 60)
    const horas = Math.floor(minutos / 60)
    const dias = Math.floor(horas / 24)

    if (segundos < 10) return 'Justo ahora'
    if (segundos < 60) return `Hace ${segundos} seg`
    if (minutos < 60) return `Hace ${minutos} min`
    if (horas < 24) return `Hace ${horas} h`
    if (dias < 7) return `Hace ${dias} días`
    if (dias < 30) return `Hace ${Math.floor(dias / 7)} sem`
    return d.toLocaleDateString('es-MX', { 
      day: 'numeric', 
      month: 'short',
      timeZone: 'America/Mexico_City'
    })
  }

  return (
    <div className="foro">
      <div className="foro-header">
        <h3>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          Foro de Querétaro
        </h3>
        <button onClick={() => setMostrarForo(false)} className="btn-close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div className="foro-messages">
        {mensajes.length === 0 && (
          <p className="empty">Sin mensajes aún. Sé el primero en compartir información.</p>
        )}
        {mensajes.map(m => (
          <div key={m.id} className="msg">
            <div className="msg-header">
              <span>Anónimo</span>
              <span>{formatear(m.created_at)}</span>
            </div>
            <p>{m.mensaje}</p>
            <button 
              onClick={async () => {
                const clave = prompt('Clave de administrador:')
                if (!clave) return
                try {
                  const res = await fetch(`${API}/api/foro/${m.id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ clave: clave })
                  })
                  const data = await res.json()
                  if (res.ok) {
                    alert('Mensaje eliminado correctamente')
                    cargar()
                  } else {
                    alert(data.error || 'Error al eliminar')
                  }
                } catch {
                  alert('Error de conexión')
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '0.6rem',
                marginTop: '6px',
                padding: '2px 6px',
                textDecoration: 'underline',
                opacity: 0.7
              }}
              title="Eliminar mensaje (solo administrador)"
            >
              Eliminar
            </button>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={enviar} className="foro-form">
        {error && <p className="error-msg">{error}</p>}
        <input
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder="Comparte información sobre seguridad en Querétaro..."
          maxLength={500}
          disabled={enviando}
        />
        <button type="submit" disabled={enviando || !texto.trim()}>
          {enviando ? 'Enviando...' : 'Publicar'}
        </button>
      </form>
    </div>
  )
}

export default ForoGeneral