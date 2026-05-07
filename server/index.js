import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'dist')));
const DB_PATH = path.join(__dirname, 'mensajes.json');
const CLAVE_ADMIN = 'Qr0$Segura-Max_2026!Admin@Pro#Ultra&Clave*Top%Secreta+';

const PALABRAS_PROHIBIDAS = [
  'puto', 'puta', 'putos', 'putas', 'pendejo', 'pendeja', 'pendejos', 'pendejas',
  'chinga', 'chingar', 'chingado', 'chingada', 'mierda', 'verga', 'culero', 'culo',
  'idiota', 'imbecil', 'estupido', 'pinche', 'cabron', 'jodido', 'mamon', 'huevon',
  'naco', 'narco', 'sicario', 'cartel', 'matar', 'muerte', 'asesinar', 'secuestro',
  'extorsion', 'soborno', 'cocaina', 'heroina', 'marihuana', 'drogas', 'cristal',
  'fentanilo', 'violar', 'acosar', 'abusar', 'golpiza', 'amenazar', 'estafa',
  'fraude', 'maricon', 'joto', 'suicidio', 'lastimar', 'arma', 'pistola', 'disparo',
  'bomba', 'explosivo', 'granada', 'incendiar', 'saquear', 'linchar', 'tortura',
  'ejecutar', 'desaparecer', 'terrorista', 'whatsapp', 'instagram', 'facebook',
  'tiktok', 'telegram', 'sigueme', 'suscribete', 'gana dinero', 'criptomoneda',
  'bitcoin', 'invertir', 'apuesta', 'casino', 'loteria', 'sorteo', 'premio',
  'odio', 'odiame', 'muera', 'mueran', 'vandalismo', 'allanar', 'invadir'
];

function leerMensajes() {
  try {
    if (!fs.existsSync(DB_PATH)) return [];
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch { return []; }
}

function guardarMensajes(mensajes) {
  fs.writeFileSync(DB_PATH, JSON.stringify(mensajes, null, 2));
}

function contienePalabraProhibida(texto) {
  const textoLower = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return PALABRAS_PROHIBIDAS.some(palabra => {
    const palabraLimpia = palabra.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return textoLower.includes(palabraLimpia);
  });
}

function limpiar() {
  let mensajes = leerMensajes();
  const limite = Date.now() - 30 * 24 * 60 * 60 * 1000;
  mensajes = mensajes.filter(m => new Date(m.created_at).getTime() > limite);
  guardarMensajes(mensajes);
}
limpiar();
setInterval(limpiar, 6 * 60 * 60 * 1000);

app.get('/api/reportes', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'dist', 'datos', 'reportes.json');
    if (!fs.existsSync(dataPath)) return res.json({ reportes: [], calor: [] });
    const datos = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const calor = datos.map(r => [r.lat, r.lng, 0.8]);
    res.json({ reportes: datos, calor });
  } catch (e) {
    res.status(500).json({ error: 'Error al cargar datos' });
  }
});

app.get('/api/foro', (req, res) => {
  const mensajes = leerMensajes()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 100);
  res.json(mensajes);
});

app.post('/api/foro', (req, res) => {
  const { mensaje } = req.body;
  
  if (!mensaje || !mensaje.trim()) {
    return res.status(400).json({ error: 'Mensaje requerido' });
  }
  if (mensaje.length > 500) {
    return res.status(400).json({ error: 'Máximo 500 caracteres' });
  }
  if (contienePalabraProhibida(mensaje)) {
    return res.status(400).json({ error: 'Tu mensaje contiene lenguaje inapropiado.' });
  }
  
  const mensajes = leerMensajes();
  const nuevo = {
    id: Date.now(),
    mensaje: mensaje.trim(),
    created_at: new Date().toISOString()
  };
  mensajes.push(nuevo);
  guardarMensajes(mensajes);
  res.json({ id: nuevo.id, mensaje: 'Publicado' });
});

app.delete('/api/foro/:id', (req, res) => {
  const claveIngresada = req.body.clave || '';
  
  if (claveIngresada !== CLAVE_ADMIN) {
    return res.status(403).json({ error: 'Clave incorrecta' });
  }
  
  let mensajes = leerMensajes();
  const idEliminar = Number(req.params.id);
  
  mensajes = mensajes.filter(m => m.id !== idEliminar);
  guardarMensajes(mensajes);
  res.json({ mensaje: 'Mensaje eliminado correctamente' });
});

// Ruta para el frontend (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor Seguro Queretaro en puerto ${PORT}`);
});