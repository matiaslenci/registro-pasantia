# Registro General de la Propiedad — Demo para la pasantía

Demo web pensada como material didáctico. Está hecha **solo con HTML, CSS y
JavaScript**: no hay servidor ni base de datos. Los datos se guardan en el
**localStorage** del navegador.

## Cómo abrirlo

No hay que instalar nada. Abrí cualquier archivo `.html` de la carpeta
`public/` con doble clic (o con la extensión **Live Server** de VS Code).

- Para empezar: `public/basico/index.html` (solo HTML + CSS).
- La demo completa: `public/index.html`.

---

## Qué demuestra cada página

| Página | Archivo | Qué muestra |
|--------|---------|-------------|
| **Inicio básico** | `public/basico/index.html` → abrir directo | **Solo HTML + CSS**, sin JavaScript ni base de datos. Ideal para aprender cómo se arma una página. |
| **Inicio** | `public/index.html` | Solo lectura: HTML + CSS (grid, tabla, cards) y un poco de JS (reloj, acordeón, modo oscuro). No guarda datos. |
| **Acceso / Registro** | `public/login.html` | El **login** es solo frontend (valida y avisa). El **registro** SÍ guarda en `localStorage`. |
| **Inscripción de inmueble** | `public/inscripcion.html` | Formulario en dos bloques (solicitante e inmueble) con validaciones completas. Guarda en `localStorage` en estado *pendiente*. |
| **Panel administrativo** | `public/admin.html` | Lee `localStorage` y permite **aprobar**, mostrando un **sello** de aprobado hecho con CSS. |

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

## ¿Qué es localStorage?

Es una memoria que trae el navegador. Guarda texto asociado a un nombre
(una *clave*) y **no se borra al cerrar la página**. Usamos dos claves:

- `usuarios`: lista de `{ id, nombre, apellido, email, mayor18, creado_en }`
- `inscripciones`: lista de `{ id, nombre, apellido, dni, email, telefono,
  direccion, observaciones, fecha, urgente, tipo_tramite, servicios, estado,
  creado_en, aprobado_en }`

Como solo guarda texto, las listas se convierten con `JSON.stringify` al guardar
y con `JSON.parse` al leer (ver `public/js/main.js`).

Para ver los datos: **F12 → pestaña Application (Aplicación) → Local Storage**.
Ahí también se pueden borrar.

> Ojo: los datos quedan **solo en ese navegador y esa computadora**. Otra
> persona no ve lo que cargaste vos. Para compartir datos entre usuarios hace
> falta un servidor y una base de datos de verdad.

---

## Estructura del proyecto

```
registro-pasantia/
  README.md
  public/
    basico/                 ← inicio solo con HTML + CSS
      index.html
      estilos.css
    index.html              ← bienvenida
    login.html              ← login + registro
    inscripcion.html        ← formulario de inscripción
    admin.html              ← panel de administración
    css/estilos.css         ← estilos compartidos + paleta + modo oscuro
    js/
      main.js               ← utilidades comunes (localStorage, modo oscuro, reloj, toasts)
      login.js              ← lógica de login y registro
      solicitante.js        ← validación del bloque "solicitante"
      inmueble.js           ← validación del bloque "inmueble" + guardado
    assets/                 ← logo.svg y favicon.svg
  docs/
    planilla-bugs.md        ← plantilla de QA para anotar errores
```
