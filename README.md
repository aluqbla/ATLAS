# 🧭 ATLAS v0.0.36 — Fase 4.3 (limpieza de pruebas)

**Base:** candidata v0.0.35, derivada de la v0.0.34 estable. **Estado:** candidata pendiente de validación manual; no reemplaza la v0.0.34 estable.

## Cambios respecto a v0.0.35

- Eliminadas cinco páginas HTML de pruebas de fases anteriores y sus tres scripts específicos, que no intervienen en el funcionamiento habitual de ATLAS.
- Actualizada la lista del Service Worker para no intentar guardar archivos eliminados; nueva caché `atlas-reconstruccion-shell-v0.0.36`.
- Sin cambios en `index.html`, integración Garmin, repositorios, interfaz ni código del Worker.
- Conservadas las pruebas automatizadas del Worker en `worker/tests/`, porque permiten verificar cambios posteriores sin tocar la cuenta Garmin.
- Las antiguas pruebas HTML permanecen recuperables en los ZIP históricos; no se pierden sus resultados documentados.

## ¿Para qué sirve ATLAS_APP_ORIGIN?

Es una variable **Text** en Cloudflare: autoriza al navegador de GitHub Pages a llamar al Worker mediante CORS. Debe contener solo el origen HTTPS de GitHub Pages, por ejemplo `https://USUARIO.github.io` (sin `/REPOSITORIO`, ni `/` final). Sin ella el formulario administrativo del Worker en su propio dominio sigue funcionando, pero las llamadas desde ATLAS en GitHub Pages serán rechazadas con CORS o `ORIGIN_DENIED`. CORS **no es** un sistema de autenticación: la contraseña y el token de sesión siguen siendo necesarios.

## Instalación y prueba manual

1. Conserva el ZIP de ATLAS v0.0.34 como respaldo estable.
2. Si aún no has instalado v0.0.35, actualiza el Worker de Cloudflare con `worker/worker.js` y conserva los secretos `GARMIN_PERSONAL_API_KEY` y `ATLAS_ACCESS_SECRET`.
3. En **Cloudflare → Workers & Pages → atlas → Settings → Variables and Secrets**, crea o comprueba `ATLAS_APP_ORIGIN` (tipo **Text**) con el origen real de GitHub Pages. Despliega la configuración. No uses una dirección de ejemplo.
4. Publica en GitHub Pages los archivos de aplicación de este ZIP: `index.html`, `assets/`, `css/`, `js/` y `sw.js`. **No publiques `worker/`**, que corresponde a Cloudflare y a pruebas locales.
5. Abre ATLAS, comprueba navegación y funcionamiento offline, y accede a **Perfil → ☁️ Garmin oficial** para iniciar sesión y consultar perfil, últimas 10 actividades y disponibilidad de salud.
6. Recarga y comprueba que las actividades guardadas persisten. Verifica con y sin conexión que las cinco pestañas abren. No se ha implementado importación histórica masiva ni API privada.

## Verificaciones técnicas

- El inventario de precaché del Service Worker se limita a archivos existentes.
- Deben mantenerse idénticos a v0.0.35 todos los archivos que no sean `sw.js` y `README.md` (más las ocho eliminaciones indicadas).
- Las pruebas de autenticación del Worker (`worker/tests/auth.test.mjs`) no requieren credenciales reales y se pueden ejecutar localmente con Node.
- **No se han realizado** pruebas autenticadas de Garmin con la cuenta del usuario, ni comprobaciones de despliegue GitHub Pages de esta versión. Requieren validación manual.

La versión v0.0.34 sigue estable hasta que el usuario confirme expresamente una sucesora.
