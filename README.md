# ATLAS v0.0.37 — Fase 4.3 (candidata)

**Base:** v0.0.36, derivada de v0.0.34 (última versión estable validada).

## Corrección

La opción «☁️ Garmin oficial» pasa de la pantalla principal de Perfil a **Perfil → ⚙️ Ajustes**, con los controles «Conectar» y «Consultar Garmin». Se eliminan de Ajustes los mensajes obsoletos «Worker no configurado» y «Sin conexión a Garmin ni almacenamiento configurado». No se modifican los endpoints del Worker, la autenticación, los repositorios ni el aspecto de las demás pantallas.

El panel se reutiliza entre aperturas de Ajustes, sin recrear la sesión en memoria.

## Publicación y comprobación

1. Sustituir los archivos de GitHub Pages por los de esta candidata, eliminando los antiguos archivos de prueba. **No es necesario actualizar el Worker Cloudflare**, pues `worker/worker.js` es idéntico al de v0.0.36.
2. Recargar ATLAS (si aparece una versión en caché, cerrar todas las pestañas de la aplicación y abrirla de nuevo).
3. Entrar en **Perfil → ⚙️ Ajustes → ☁️ Garmin oficial**. Introducir la contraseña de ATLAS, pulsar **Conectar**, después **Consultar Garmin**.
4. Verificar que se muestran las respuestas reales o los errores y que no aparece el mensaje obsoleto. Verificar navegación y apertura offline con datos locales.

**No probada con cuenta Garmin real en esta entrega.** Los datos deportivos no se inventan. Fase 4.3 pendiente de validación manual.
