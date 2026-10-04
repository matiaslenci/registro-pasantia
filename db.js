// ============================================================================
//  db.js  →  La CAPA DE BASE DE DATOS
// ----------------------------------------------------------------------------
//  Acá vive la conexión con SQLite y la creación de las tablas.
//  SQLite guarda TODO en un solo archivo (registro.db) que se genera solo.
//
//  Usamos "better-sqlite3" porque es SÍNCRONO: las consultas devuelven el
//  resultado directamente (sin promesas ni callbacks), lo que hace el código
//  mucho más fácil de leer para quien recién empieza.
// ============================================================================

// Traemos la librería que sabe hablar con SQLite.
const Database = require('better-sqlite3');

// Traemos "path" para armar la ruta del archivo de la base de forma segura
// en cualquier sistema operativo (Windows, Linux, Mac).
const path = require('path');

// Abrimos (o creamos si no existe) el archivo registro.db, siempre al lado
// de este archivo db.js. __dirname es la carpeta donde estamos parados.
const rutaBase = path.join(__dirname, 'registro.db');
const db = new Database(rutaBase);

// Esta opción hace que la base sea más rápida y estable en escrituras.
// No es imprescindible para entender la demo, pero es una buena práctica.
db.pragma('journal_mode = WAL');

// ----------------------------------------------------------------------------
//  Creación de las tablas
// ----------------------------------------------------------------------------
//  "CREATE TABLE IF NOT EXISTS" significa: creá la tabla SOLO si todavía no
//  existe. Así podemos arrancar el servidor muchas veces sin romper nada.
//
//  Nota sobre los tipos:
//   - Los booleanos (sí/no) se guardan como 0 (no) o 1 (sí), porque SQLite
//     no tiene un tipo "boolean" propio.
//   - La selección múltiple de servicios se guarda como texto separado por
//     comas, por ejemplo: "agua,luz,gas".
// ----------------------------------------------------------------------------

function crearTablas() {
  // Tabla de USUARIOS (los que se registran en login.html)
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre    TEXT    NOT NULL,
      apellido  TEXT    NOT NULL,
      email     TEXT    NOT NULL,
      mayor18   INTEGER NOT NULL DEFAULT 0,
      creado_en TEXT    NOT NULL
    );
  `);

  // Tabla de INSCRIPCIONES (el trámite de inscripción de inmueble)
  db.exec(`
    CREATE TABLE IF NOT EXISTS inscripciones (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre        TEXT    NOT NULL,
      apellido      TEXT    NOT NULL,
      dni           TEXT    NOT NULL,
      email         TEXT    NOT NULL,
      telefono      TEXT,
      direccion     TEXT    NOT NULL,
      observaciones TEXT,
      fecha         TEXT    NOT NULL,
      urgente       INTEGER NOT NULL DEFAULT 0,
      tipo_tramite  TEXT    NOT NULL,
      servicios     TEXT,
      estado        TEXT    NOT NULL DEFAULT 'pendiente',
      creado_en     TEXT    NOT NULL,
      aprobado_en   TEXT
    );
  `);

  console.log('✔ Tablas verificadas/creadas correctamente (usuarios, inscripciones).');
}

// Ejecutamos la creación al cargar este módulo.
crearTablas();

// Exportamos la conexión "db" para que server.js pueda hacer consultas.
module.exports = db;
