# Planilla de QA — Registro de bugs

> **¿Qué es esto?** Una planilla para anotar los errores (bugs) que encuentren
> mientras prueban la aplicación. Probar buscando errores a propósito se llama
> **QA** (Quality Assurance / aseguramiento de la calidad). Es una parte
> importante del trabajo en desarrollo de software.

## Cómo usarla

Por cada error que encuentren, agreguen una fila a la tabla:

- **ID**: un número correlativo (1, 2, 3…).
- **Página**: en qué pantalla pasó (index / login / inscripción / admin).
- **Pasos para reproducir**: qué hicieron, paso a paso, para que vuelva a pasar.
- **Resultado esperado**: qué debería haber pasado.
- **Resultado obtenido**: qué pasó realmente (el error).
- **Gravedad**: qué tan serio es → **baja** / **media** / **alta**.
  - *baja*: detalle estético, no molesta el uso.
  - *media*: molesta pero hay forma de seguir.
  - *alta*: impide completar el trámite / rompe la página.

## Tabla de bugs

| ID | Página | Pasos para reproducir | Resultado esperado | Resultado obtenido | Gravedad |
|----|--------|-----------------------|--------------------|--------------------|----------|
|    |        |                       |                    |                    |          |
|    |        |                       |                    |                    |          |
|    |        |                       |                    |                    |          |
|    |        |                       |                    |                    |          |
|    |        |                       |                    |                    |          |
|    |        |                       |                    |                    |          |
|    |        |                       |                    |                    |          |
|    |        |                       |                    |                    |          |

## Ejemplo (para que se entienda el formato)

| ID | Página | Pasos para reproducir | Resultado esperado | Resultado obtenido | Gravedad |
|----|--------|-----------------------|--------------------|--------------------|----------|
| 0  | login  | Ir a Registrarse, dejar el email vacío y apretar "Crear cuenta" | Un aviso pidiendo el correo | (completar al probar) | media |
