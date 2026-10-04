// ============================================================================
//  solicitante.js  →  Sección "Datos del solicitante" del formulario
// ----------------------------------------------------------------------------
//  Este archivo se ocupa SOLO del primer bloque del formulario de inscripción.
//  Su tarea: leer los campos del solicitante, validarlos, y devolver los datos
//  listos (o avisar del primer error encontrado).
//
//  Lo dejamos separado a propósito para que dos personas puedan trabajar en
//  paralelo: una en el solicitante y otra en el inmueble.
//
//  Expone una única función global: obtenerDatosSolicitante().
// ============================================================================

// Devuelve un objeto que describe el resultado de la validación:
//   { ok: true,  datos: {...} }              si está todo bien
//   { ok: false, mensaje: 'texto del error' } si algo falta o está mal
function obtenerDatosSolicitante() {
  // Leemos y limpiamos (trim) cada campo.
  const nombre = document.getElementById('sol-nombre').value.trim();
  const apellido = document.getElementById('sol-apellido').value.trim();
  const dni = document.getElementById('sol-dni').value.trim();
  const telefono = document.getElementById('sol-telefono').value.trim();
  const email = document.getElementById('sol-email').value.trim();

  // --- Validaciones ---

  // Campos obligatorios (el teléfono es opcional).
  if (nombre === '') {
    return { ok: false, mensaje: 'El nombre del solicitante es obligatorio.' };
  }
  if (apellido === '') {
    return { ok: false, mensaje: 'El apellido del solicitante es obligatorio.' };
  }
  if (dni === '') {
    return { ok: false, mensaje: 'El DNI es obligatorio.' };
  }
  // DNI: solo números (\d) y entre 7 y 8 dígitos.
  if (!/^\d{7,8}$/.test(dni)) {
    return { ok: false, mensaje: 'El DNI debe tener solo números (7 u 8 dígitos).' };
  }
  if (email === '') {
    return { ok: false, mensaje: 'El correo del solicitante es obligatorio.' };
  }
  // Formato de email: algo@algo.algo
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, mensaje: 'El correo del solicitante no es válido (falta @ o dominio).' };
  }

  // Si llegamos hasta acá, está todo bien: devolvemos los datos.
  return {
    ok: true,
    datos: { nombre, apellido, dni, telefono, email }
  };
}
