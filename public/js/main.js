// ============================================================================
//  main.js  →  Utilidades COMUNES a todas las páginas
// ----------------------------------------------------------------------------
//  Este archivo se carga en las cuatro páginas. Trae funciones que usamos en
//  varios lados para no repetir código:
//    - un "helper" para hablar con el backend (fetch),
//    - el toggle de modo oscuro (recordado con localStorage),
//    - el reloj del encabezado,
//    - atajos para mostrar toasts con SweetAlert2.
// ============================================================================

// ----------------------------------------------------------------------------
//  1) HELPER DE FETCH
// ----------------------------------------------------------------------------
//  fetch() es la función del navegador para pedirle cosas al servidor.
//  Como siempre la usamos parecido (mandar/recibir JSON, revisar errores),
//  la envolvemos en una función propia para escribir menos y más claro.
//
//  "async/await" nos deja escribir código asíncrono como si fuera de arriba
//  hacia abajo. "await" significa "esperá a que esto termine".
// ----------------------------------------------------------------------------
async function pedirAlServidor(url, metodo = 'GET', datos = null) {
  // Armamos las opciones del pedido.
  const opciones = {
    method: metodo,
    headers: { 'Content-Type': 'application/json' }
  };

  // Si mandamos datos (POST/PATCH), los convertimos a texto JSON.
  if (datos) {
    opciones.body = JSON.stringify(datos);
  }

  // Hacemos el pedido y esperamos la respuesta.
  const respuesta = await fetch(url, opciones);

  // Convertimos la respuesta a objeto JavaScript.
  const cuerpo = await respuesta.json();

  // Si el servidor respondió con un error (status 400, 404, 500...),
  // lanzamos una excepción con el mensaje que mandó el backend.
  if (!respuesta.ok) {
    throw new Error(cuerpo.error || 'Ocurrió un error en el servidor.');
  }

  // Si todo salió bien, devolvemos los datos.
  return cuerpo;
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
