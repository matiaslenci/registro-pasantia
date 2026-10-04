// ============================================================================
//  login.js  →  Lógica de la página de Acceso / Registro
// ----------------------------------------------------------------------------
//  Dos partes:
//   1) Cambiar entre las pestañas "Iniciar sesión" y "Registrarse".
//   2) Manejar los dos formularios:
//       - Login: solo valida en el frontend y muestra un toast.
//       - Registro: valida y GUARDA en localStorage.
// ============================================================================

// ----------------------------------------------------------------------------
//  1) PESTAÑAS
// ----------------------------------------------------------------------------
const tabLogin = document.getElementById('tab-login');
const tabRegistro = document.getElementById('tab-registro');
const panelLogin = document.getElementById('panel-login');
const panelRegistro = document.getElementById('panel-registro');

// Muestra el panel de login y oculta el de registro.
function mostrarLogin() {
  tabLogin.classList.add('activa');
  tabRegistro.classList.remove('activa');
  panelLogin.classList.remove('oculto');
  panelRegistro.classList.add('oculto');
}

// Muestra el panel de registro y oculta el de login.
function mostrarRegistro() {
  tabRegistro.classList.add('activa');
  tabLogin.classList.remove('activa');
  panelRegistro.classList.remove('oculto');
  panelLogin.classList.add('oculto');
}

tabLogin.addEventListener('click', mostrarLogin);
tabRegistro.addEventListener('click', mostrarRegistro);

// ----------------------------------------------------------------------------
//  2) FORMULARIO DE LOGIN (solo frontend)
// ----------------------------------------------------------------------------
const formLogin = document.getElementById('form-login');

formLogin.addEventListener('submit', (evento) => {
  // preventDefault evita que el navegador recargue la página al enviar.
  evento.preventDefault();

  const email = document.getElementById('login-email').value.trim();
  const clave = document.getElementById('login-clave').value.trim();

  // Validación simple: que no estén vacíos.
  if (email === '' || clave === '') {
    toastError('Completá el correo y la contraseña.');
    return;
  }
  // Validación de formato de email con una expresión regular.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    toastError('El correo no tiene un formato válido.');
    return;
  }

  // Como es una demo, no hay autenticación real: solo felicitamos.
  toastExito('¡Bienvenido/a! (inicio de sesión simulado)');
  formLogin.reset();
});

// ----------------------------------------------------------------------------
//  3) FORMULARIO DE REGISTRO (guarda en localStorage)
// ----------------------------------------------------------------------------
const formRegistro = document.getElementById('form-registro');

formRegistro.addEventListener('submit', (evento) => {
  evento.preventDefault();

  // Leemos los valores de los campos.
  const nombre = document.getElementById('reg-nombre').value.trim();
  const apellido = document.getElementById('reg-apellido').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const mayor18 = document.getElementById('reg-mayor18').checked;

  // --- Validaciones en el frontend (antes de guardar) ---
  if (nombre === '' || apellido === '' || email === '') {
    toastError('Completá nombre, apellido y correo.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    toastError('El correo no tiene un formato válido.');
    return;
  }

  // --- Guardamos en localStorage (agregarRegistro está en main.js) ---
  const usuarioCreado = agregarRegistro('usuarios', {
    nombre,
    apellido,
    email,
    mayor18
  });

  // Éxito: toast + animación en la tarjeta.
  toastExito(`¡Cuenta creada! Bienvenido/a, ${usuarioCreado.nombre}.`);

  // Animamos la tarjeta con Animate.css (un "pulso" de confirmación).
  const tarjeta = document.querySelector('.tarjeta');
  tarjeta.classList.add('animate__animated', 'animate__pulse');
  // Sacamos las clases al terminar, para poder repetir la animación.
  tarjeta.addEventListener('animationend', () => {
    tarjeta.classList.remove('animate__animated', 'animate__pulse');
  }, { once: true });

  formRegistro.reset();
});
