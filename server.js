// ============================================================================
//  server.js  →  La CAPA DE BACKEND (el servidor)
// ----------------------------------------------------------------------------
//  Este archivo hace DOS cosas al mismo tiempo:
//
//   1) Sirve las páginas estáticas (los .html, .css y .js del navegador)
//      desde la carpeta /public.
//   2) Expone los "endpoints" (URLs de la API) que el navegador llama con
//      fetch para guardar y leer datos de la base.
//
//  Al servir el frontend y la API desde EL MISMO servidor, evitamos los
//  problemas de CORS: el navegador ve todo como el mismo origen (localhost).
// ============================================================================

// Traemos Express, el framework que nos facilita armar el servidor web.
const express = require('express');

// Traemos "path" para armar rutas de carpetas de forma segura.
const path = require('path');

// Traemos nuestra conexión a la base (db.js ya creó las tablas al cargarse).
const db = require('./db');

// Creamos la aplicación de Express.
const app = express();

// Puerto donde va a escuchar el servidor. 3000 es un clásico para desarrollo.
const PORT = 3000;

// ----------------------------------------------------------------------------
//  MIDDLEWARES (cosas que se ejecutan en CADA pedido, antes de responder)
// ----------------------------------------------------------------------------

// express.json() lee el cuerpo (body) de los pedidos que vienen en formato
// JSON y lo deja disponible en req.body. Sin esto, req.body sería undefined.
app.use(express.json());

// express.static() sirve automáticamente los archivos de /public.
// Así, entrar a "/" devuelve public/index.html, "/login.html" devuelve esa
// página, "/css/estilos.css" devuelve el CSS, etc. Todo sin escribir rutas.
app.use(express.static(path.join(__dirname, 'public')));

// ----------------------------------------------------------------------------
//  Pequeñas funciones de ayuda para validar del lado del servidor
// ----------------------------------------------------------------------------

// Verifica que un texto no esté vacío (ni sea solo espacios).
function tieneValor(texto) {
  return typeof texto === 'string' && texto.trim().length > 0;
}

// Verifica un formato de email razonable (algo@algo.algo).
function emailValido(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Devuelve la fecha y hora actual como texto ISO (ej: 2026-09-21T14:30:00.000Z).
function ahora() {
  return new Date().toISOString();
}

// ============================================================================
//  ENDPOINTS DE LA API
// ============================================================================

// ----------------------------------------------------------------------------
//  POST /usuarios  →  Registrar un usuario nuevo
// ----------------------------------------------------------------------------
app.post('/usuarios', (req, res) => {
  // Sacamos los datos que mandó el navegador desde el cuerpo del pedido.
  const { nombre, apellido, email, mayor18 } = req.body;

  // --- Validaciones del lado del servidor ---
  // Nunca confiamos solo en el frontend: el servidor SIEMPRE revisa de nuevo.
  if (!tieneValor(nombre) || !tieneValor(apellido) || !tieneValor(email)) {
    return res.status(400).json({
      error: 'Faltan campos obligatorios: nombre, apellido y email.'
    });
  }
  if (!emailValido(email)) {
    return res.status(400).json({ error: 'El email no tiene un formato válido.' });
  }

  // Guardamos el booleano como 0 o 1.
  const mayor18Num = mayor18 ? 1 : 0;

  // Preparamos e insertamos. Los signos "?" son marcadores de posición:
  // better-sqlite3 reemplaza cada "?" por el valor en el orden dado, de forma
  // segura (esto evita el ataque de "inyección SQL").
  const stmt = db.prepare(`
    INSERT INTO usuarios (nombre, apellido, email, mayor18, creado_en)
    VALUES (?, ?, ?, ?, ?)
  `);
  const resultado = stmt.run(nombre.trim(), apellido.trim(), email.trim(), mayor18Num, ahora());

  // Buscamos el registro recién creado para devolverlo completo.
  const usuarioCreado = db
    .prepare('SELECT * FROM usuarios WHERE id = ?')
    .get(resultado.lastInsertRowid);

  // 201 = "Created" (creado con éxito).
  res.status(201).json(usuarioCreado);
});

// ----------------------------------------------------------------------------
//  GET /usuarios  →  Listar todos los usuarios
// ----------------------------------------------------------------------------
app.get('/usuarios', (req, res) => {
  const usuarios = db
    .prepare('SELECT * FROM usuarios ORDER BY id DESC')
    .all();
  res.json(usuarios);
});

// ----------------------------------------------------------------------------
//  POST /inscripciones  →  Cargar una inscripción de inmueble
// ----------------------------------------------------------------------------
app.post('/inscripciones', (req, res) => {
  const {
    nombre, apellido, dni, email, telefono,
    direccion, observaciones, fecha, urgente,
    tipo_tramite, servicios
  } = req.body;

  // --- Validaciones obligatorias ---
  if (!tieneValor(nombre) || !tieneValor(apellido) || !tieneValor(dni) ||
      !tieneValor(email) || !tieneValor(direccion) || !tieneValor(fecha) ||
      !tieneValor(tipo_tramite)) {
    return res.status(400).json({
      error: 'Faltan campos obligatorios (nombre, apellido, DNI, email, dirección, fecha y tipo de trámite).'
    });
  }
  // DNI: solo números y entre 7 y 8 dígitos.
  if (!/^\d{7,8}$/.test(dni)) {
    return res.status(400).json({ error: 'El DNI debe tener solo números (7 u 8 dígitos).' });
  }
  if (!emailValido(email)) {
    return res.status(400).json({ error: 'El email no tiene un formato válido.' });
  }
  // La fecha no puede ser futura ni inválida.
  const fechaObj = new Date(fecha);
  if (isNaN(fechaObj.getTime())) {
    return res.status(400).json({ error: 'La fecha no es válida.' });
  }
  // Comparamos contra el fin del día de hoy para no rechazar la fecha de hoy.
  const finDeHoy = new Date();
  finDeHoy.setHours(23, 59, 59, 999);
  if (fechaObj > finDeHoy) {
    return res.status(400).json({ error: 'La fecha no puede ser futura.' });
  }

  // "servicios" puede llegar como array (["agua","luz"]) o como texto.
  // Lo normalizamos a texto separado por comas para guardarlo en la base.
  let serviciosTexto = '';
  if (Array.isArray(servicios)) {
    serviciosTexto = servicios.join(',');
  } else if (typeof servicios === 'string') {
    serviciosTexto = servicios;
  }

  const stmt = db.prepare(`
    INSERT INTO inscripciones
      (nombre, apellido, dni, email, telefono, direccion, observaciones,
       fecha, urgente, tipo_tramite, servicios, estado, creado_en, aprobado_en)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente', ?, NULL)
  `);
  const resultado = stmt.run(
    nombre.trim(),
    apellido.trim(),
    dni.trim(),
    email.trim(),
    (telefono || '').trim(),
    direccion.trim(),
    (observaciones || '').trim(),
    fecha,
    urgente ? 1 : 0,
    tipo_tramite,
    serviciosTexto,
    ahora()
  );

  const inscripcionCreada = db
    .prepare('SELECT * FROM inscripciones WHERE id = ?')
    .get(resultado.lastInsertRowid);

  res.status(201).json(inscripcionCreada);
});

// ----------------------------------------------------------------------------
//  GET /inscripciones  →  Listar todas las inscripciones
// ----------------------------------------------------------------------------
app.get('/inscripciones', (req, res) => {
  const inscripciones = db
    .prepare('SELECT * FROM inscripciones ORDER BY id DESC')
    .all();
  res.json(inscripciones);
});

// ----------------------------------------------------------------------------
//  PATCH /inscripciones/:id  →  Aprobar una inscripción
// ----------------------------------------------------------------------------
//  PATCH se usa para MODIFICAR PARCIALMENTE un recurso existente. Acá solo
//  cambiamos el estado a "aprobado" y guardamos la fecha de aprobación.
// ----------------------------------------------------------------------------
app.patch('/inscripciones/:id', (req, res) => {
  const id = Number(req.params.id);

  // Buscamos la inscripción para asegurarnos de que exista.
  const inscripcion = db.prepare('SELECT * FROM inscripciones WHERE id = ?').get(id);
  if (!inscripcion) {
    return res.status(404).json({ error: 'No existe una inscripción con ese id.' });
  }

  // Actualizamos el estado y la fecha de aprobación.
  const fechaAprobacion = ahora();
  db.prepare(`
    UPDATE inscripciones
    SET estado = 'aprobado', aprobado_en = ?
    WHERE id = ?
  `).run(fechaAprobacion, id);

  // Devolvemos la inscripción ya actualizada.
  const actualizada = db.prepare('SELECT * FROM inscripciones WHERE id = ?').get(id);
  res.json(actualizada);
});

// ============================================================================
//  Encendemos el servidor
// ============================================================================
app.listen(PORT, () => {
  console.log('');
  console.log('  ┌───────────────────────────────────────────────────────┐');
  console.log('  │  Registro General de la Propiedad - Santa Fe (DEMO)     │');
  console.log('  ├───────────────────────────────────────────────────────┤');
  console.log(`  │  Servidor andando en:  http://localhost:${PORT}          │`);
  console.log('  │  Frenalo con Ctrl + C                                   │');
  console.log('  └───────────────────────────────────────────────────────┘');
  console.log('');
});
