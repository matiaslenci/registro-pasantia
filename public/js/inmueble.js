// ============================================================================
//  inmueble.js  →  Sección "Datos del inmueble" + ENVÍO del formulario
// ----------------------------------------------------------------------------
//  Este archivo se ocupa del segundo bloque (datos del inmueble) Y ADEMÁS
//  coordina el envío final, porque necesita juntar las dos partes:
//   - los datos del solicitante (obtenerDatosSolicitante, de solicitante.js)
//   - los datos del inmueble (obtenerDatosInmueble, definida acá)
//
//  Se carga DESPUÉS de solicitante.js, así que ya puede usar su función.
// ============================================================================

// ----------------------------------------------------------------------------
//  1) Validar y leer los datos del inmueble
// ----------------------------------------------------------------------------
//  Devuelve { ok, datos } o { ok:false, mensaje } igual que en solicitante.js.
function obtenerDatosInmueble() {
  const direccion = document.getElementById('inm-direccion').value.trim();
  const tipo_tramite = document.getElementById('inm-tipo').value;
  const fecha = document.getElementById('inm-fecha').value; // formato "AAAA-MM-DD"
  const observaciones = document.getElementById('inm-observaciones').value.trim();
  const urgente = document.getElementById('inm-urgente').checked;

  // La selección múltiple: recorremos las opciones elegidas del <select multiple>.
  const selectServicios = document.getElementById('inm-servicios');
  const servicios = Array.from(selectServicios.selectedOptions).map((op) => op.value);

  // --- Validaciones ---
  if (direccion === '') {
    return { ok: false, mensaje: 'La dirección del inmueble es obligatoria.' };
  }
  if (tipo_tramite === '') {
    return { ok: false, mensaje: 'Elegí un tipo de trámite.' };
  }
  if (fecha === '') {
    return { ok: false, mensaje: 'La fecha del trámite es obligatoria.' };
  }

  // Validamos la fecha: que sea válida y que no sea futura.
  const fechaObj = new Date(fecha);
  if (isNaN(fechaObj.getTime())) {
    return { ok: false, mensaje: 'La fecha del trámite no es válida.' };
  }
  const finDeHoy = new Date();
  finDeHoy.setHours(23, 59, 59, 999); // permitimos elegir la fecha de hoy
  if (fechaObj > finDeHoy) {
    return { ok: false, mensaje: 'La fecha del trámite no puede ser futura.' };
  }

  return {
    ok: true,
    datos: { direccion, tipo_tramite, fecha, observaciones, urgente, servicios }
  };
}

// ----------------------------------------------------------------------------
//  2) Envío del formulario (junta las dos partes y la guarda en localStorage)
// ----------------------------------------------------------------------------
const formInscripcion = document.getElementById('form-inscripcion');

formInscripcion.addEventListener('submit', (evento) => {
  evento.preventDefault();

  // Validamos el bloque del solicitante (función de solicitante.js).
  const resSolicitante = obtenerDatosSolicitante();
  if (!resSolicitante.ok) {
    toastError(resSolicitante.mensaje);
    return;
  }

  // Validamos el bloque del inmueble (función de este archivo).
  const resInmueble = obtenerDatosInmueble();
  if (!resInmueble.ok) {
    toastError(resInmueble.mensaje);
    return;
  }

  // Combinamos las dos partes en un solo objeto. El "spread" (...) copia todas
  // las propiedades de cada objeto dentro del nuevo.
  const inscripcion = {
    ...resSolicitante.datos,
    ...resInmueble.datos
  };

  // Guardamos en localStorage. Toda inscripción nueva arranca "pendiente".
  const creada = agregarRegistro('inscripciones', {
    ...inscripcion,
    estado: 'pendiente',
    aprobado_en: null
  });

  toastExito(`Inscripción #${creada.id} enviada. Estado: ${creada.estado}.`);

  // Animación de confirmación sobre el formulario.
  formInscripcion.classList.add('animate__animated', 'animate__fadeIn');
  formInscripcion.addEventListener('animationend', () => {
    formInscripcion.classList.remove('animate__animated', 'animate__fadeIn');
  }, { once: true });

  formInscripcion.reset();
});
