# Registro General de la Propiedad — Demo de las 3 capas

Demo web **completa y funcional** pensada como material didáctico para una
pasantía. Muestra, de forma tangible, las **tres capas** de una aplicación y
por qué existen:

1. **Frontend** (lo que ve el navegador): HTML + CSS + JavaScript.
2. **Backend** (el servidor): Node.js + Express.
3. **Base de datos** (donde se guardan los datos de verdad): SQLite.

La idea central: cuando apretás **"Enviar"**, un dato viaja del navegador al
servidor y se guarda en una base real; después se puede **listar** y **aprobar**.

Todo corre desde **un solo servidor** (el backend sirve los HTML y expone la
API), así evitamos problemas de CORS.

---

## Requisitos

- **Node.js LTS** (versión 18 o superior). Verificá con:
  ```bash
  node --version
  ```

## Cómo levantarlo desde cero

Desde la carpeta del proyecto:

```bash
npm install      # instala Express y better-sqlite3 (crea node_modules/)
npm start        # enciende el servidor
```

Después abrí en el navegador:

```
http://localhost:3000
```

> Para desarrollar con recarga automática al guardar: `npm run dev` (usa nodemon).

La base de datos (`registro.db`) **se crea sola** la primera vez que arranca el
servidor. No hay que configurar nada más.

---

## Qué demuestra cada página

| Página | Archivo | Qué muestra |
|--------|---------|-------------|
| **Inicio** | `public/index.html` | Solo lectura: HTML + CSS (grid, tabla, cards) y un poco de JS (reloj, acordeón, modo oscuro). No toca la base. |
| **Acceso / Registro** | `public/login.html` | El **login** es solo frontend (valida y avisa). El **registro** SÍ guarda en la base (`POST /usuarios`). |
| **Inscripción de inmueble** | `public/inscripcion.html` | Formulario en dos bloques (solicitante e inmueble) con validaciones completas. Guarda con `POST /inscripciones` en estado *pendiente*. |
| **Panel administrativo** | `public/admin.html` | Lee la base (`GET /usuarios`, `GET /inscripciones`) y permite **aprobar** con `PATCH /inscripciones/:id`, mostrando un **sello** de aprobado hecho con CSS. |

---

## Cómo probar cada flujo

### 1) Registrar un usuario y verlo en el panel
1. Entrá a **Acceso / Registro** → pestaña **Registrarse**.
2. Completá nombre, apellido, email y (opcional) marcá "mayor de 18".
3. Apretá **Crear cuenta** → aparece un toast de éxito y una animación.
4. Andá a **Panel administrativo** → el usuario aparece en la tabla "Usuarios registrados".
   El "mayor de 18" se ve como ✅ o ❌.

### 2) Cargar una inscripción y aprobarla (ver el sello)
1. Entrá a **Inscripción de inmueble**.
2. Completá los datos del solicitante (DNI solo números, email con @) y del
   inmueble (dirección, tipo de trámite, fecha no futura, servicios, etc.).
3. Apretá **Enviar inscripción** → toast de éxito; queda en estado *pendiente*.
4. Andá a **Panel administrativo** → la inscripción aparece con estado
   **Pendiente** y un botón **Aprobar**.
5. Apretá **Aprobar** → el estado pasa a **Aprobado** y aparece el **sello**
   (texto rotado, borde doble, semitransparente) con la fecha de aprobación.
   Es el paralelo digital del sello de goma sobre el papel.

---

## ¿Por qué SQLite necesita el backend y no se puede tocar desde el navegador?

La base de datos es un **archivo en el servidor** (`registro.db`). El navegador,
por seguridad, **no puede abrir archivos del disco del servidor** ni ejecutar
consultas SQL directamente: si pudiera, cualquier página web podría leer o
borrar datos de cualquiera. Por eso el navegador **le pide** los datos al
backend (con `fetch`), y es el **backend** —que sí corre en el servidor y tiene
permiso— el que abre la base, hace la consulta y devuelve el resultado. Esa
separación es, justamente, para qué sirve tener un backend.

---

## Estructura del proyecto

```
registro-pasantia/
  README.md                 ← este archivo
  package.json              ← scripts y dependencias
  .gitignore                ← ignora node_modules/ y *.db
  server.js                 ← BACKEND: sirve /public y expone la API
  db.js                     ← BASE: abre SQLite y crea las tablas
  registro.db               ← se genera solo al arrancar
  public/                   ← FRONTEND (todo lo que ve el navegador)
    index.html              ← bienvenida (solo lectura)
    login.html              ← login + registro
    inscripcion.html        ← formulario de inscripción
    admin.html              ← panel de administración
    css/estilos.css         ← estilos compartidos + paleta + modo oscuro
    js/
      main.js               ← utilidades comunes (fetch, modo oscuro, reloj, toasts)
      login.js              ← lógica de login y registro
      solicitante.js        ← validación del bloque "solicitante"
      inmueble.js           ← validación del bloque "inmueble" + envío
    assets/                 ← logo.svg y favicon.svg
  docs/
    planilla-bugs.md        ← plantilla de QA para anotar errores
```

## Endpoints de la API

| Método | Ruta | Qué hace |
|--------|------|----------|
| `GET`  | `/usuarios` | Devuelve todos los usuarios. |
| `POST` | `/usuarios` | Crea un usuario. Devuelve el creado. |
| `GET`  | `/inscripciones` | Devuelve todas las inscripciones. |
| `POST` | `/inscripciones` | Crea una inscripción (estado *pendiente*). |
| `PATCH`| `/inscripciones/:id` | Marca una inscripción como *aprobado*. |

Todos validan también **del lado del servidor** y devuelven errores en JSON con
un `status` y un `error` claros.

---

## Base de datos (dos tablas, sin relaciones)

- **usuarios**: `id, nombre, apellido, email, mayor18 (0/1), creado_en`
- **inscripciones**: `id, nombre, apellido, dni, email, telefono, direccion,`
  `observaciones, fecha, urgente (0/1), tipo_tramite, servicios (texto separado`
  `por comas), estado, creado_en, aprobado_en`

Los booleanos se guardan como `0`/`1` y la selección múltiple de servicios como
texto separado por comas (ej.: `agua,luz,gas`).

---

## Resumen de archivos creados

- **Backend / base**: `server.js`, `db.js`, `package.json`, `.gitignore`
- **Frontend**: `public/index.html`, `public/login.html`,
  `public/inscripcion.html`, `public/admin.html`, `public/css/estilos.css`,
  `public/js/main.js`, `public/js/login.js`, `public/js/solicitante.js`,
  `public/js/inmueble.js`
- **Assets**: `public/assets/logo.svg`, `public/assets/favicon.svg`
- **Docs**: `README.md`, `docs/planilla-bugs.md`
