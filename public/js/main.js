// ============================================================================
//  main.js  →  Utilidades COMUNES a todas las páginas
// ----------------------------------------------------------------------------
//  Este archivo se carga en las cuatro páginas. Trae funciones que usamos en
//  varios lados para no repetir código:
//    - funciones para guardar y leer datos en localStorage,
//    - el toggle de modo oscuro (recordado con localStorage),
//    - el reloj del encabezado,
//    - atajos para mostrar toasts con SweetAlert2.
// ============================================================================

// ----------------------------------------------------------------------------
//  1) GUARDAR Y LEER DATOS CON localStorage
// ----------------------------------------------------------------------------
//  localStorage es una memoria del navegador que guarda TEXTO con un nombre
//  (una "clave"). Los datos se mantienen aunque cierres la página, pero
//  quedan solo en ESTE navegador y en ESTA computadora.
//
//  Para guardar listas de objetos las convertimos a texto con JSON.stringify
//  y al leerlas las volvemos a objeto con JSON.parse.
//
//  Usamos dos claves: "usuarios" e "inscripciones". Cada una guarda una lista.
// ----------------------------------------------------------------------------

// Devuelve la lista guardada con esa clave (o una lista vacía si no hay nada).
function leerLista(clave) {
  const texto = localStorage.getItem(clave);
  return texto ? JSON.parse(texto) : [];
}

// Guarda la lista completa con esa clave.
function guardarLista(clave, lista) {
  localStorage.setItem(clave, JSON.stringify(lista));
}

// Agrega un registro nuevo con el siguiente id disponible y lo devuelve.
function agregarRegistro(clave, registro) {
  const lista = leerLista(clave);
  const ultimoId = lista.length > 0 ? lista[lista.length - 1].id : 0;
  const nuevo = { id: ultimoId + 1, ...registro, creado_en: new Date().toISOString() };
  lista.push(nuevo);
  guardarLista(clave, lista);
  return nuevo;
}

// ----------------------------------------------------------------------------
//  2) TOASTS (avisitos que aparecen y se van solos) con SweetAlert2
// ----------------------------------------------------------------------------
//  SweetAlert2 se carga por CDN en el HTML y queda disponible como "Swal".
//  Configuramos un "mixin" de toast para reutilizarlo.
// ----------------------------------------------------------------------------
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',      // arriba a la derecha
  showConfirmButton: false,
  timer: 3000,              // se cierra solo a los 3 segundos
  timerProgressBar: true
});

// Atajo para un toast de éxito (verde).
function toastExito(mensaje) {
  Toast.fire({ icon: 'success', title: mensaje });
}

// Atajo para un toast de error (rojo).
function toastError(mensaje) {
  Toast.fire({ icon: 'error', title: mensaje });
}

// ----------------------------------------------------------------------------
//  3) MODO OSCURO
// ----------------------------------------------------------------------------
//  Guardamos la preferencia en localStorage (memoria del navegador) para que
//  se mantenga aunque cierres y abras la página.
// ----------------------------------------------------------------------------
function aplicarModoGuardado() {
  const modo = localStorage.getItem('modo');
  if (modo === 'oscuro') {
    document.body.classList.add('modo-oscuro');
    actualizarTextoBotonModo(true);
  }
}

function alternarModoOscuro() {
  // toggle() agrega la clase si no está, o la saca si estaba.
  const ahoraOscuro = document.body.classList.toggle('modo-oscuro');
  // Guardamos la preferencia.
  localStorage.setItem('modo', ahoraOscuro ? 'oscuro' : 'claro');
  actualizarTextoBotonModo(ahoraOscuro);
}

function actualizarTextoBotonModo(esOscuro) {
  const boton = document.getElementById('btn-modo');
  if (boton) {
    boton.textContent = esOscuro ? '☀ Modo claro' : '🌙 Modo oscuro';
  }
}

// ----------------------------------------------------------------------------
//  4) RELOJ DEL ENCABEZADO
// ----------------------------------------------------------------------------
//  Muestra la hora actual y se actualiza cada segundo con setInterval().
// ----------------------------------------------------------------------------
function iniciarReloj() {
  const reloj = document.getElementById('reloj');
  if (!reloj) return; // si la página no tiene reloj, no hacemos nada

  function actualizar() {
    const ahora = new Date();
    // toLocaleTimeString con formato de Argentina (24hs).
    const hora = ahora.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    reloj.textContent = '🕐 ' + hora;
  }

  actualizar();               // mostramos la hora ya mismo
  setInterval(actualizar, 1000); // y la refrescamos cada 1 segundo
}

// ----------------------------------------------------------------------------
//  5) ARRANQUE COMÚN
// ----------------------------------------------------------------------------
//  Cuando el HTML terminó de cargar, activamos lo compartido: modo oscuro,
//  el botón que lo alterna y el reloj.
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  aplicarModoGuardado();
  iniciarReloj();

  const botonModo = document.getElementById('btn-modo');
  if (botonModo) {
    botonModo.addEventListener('click', alternarModoOscuro);
  }
});
