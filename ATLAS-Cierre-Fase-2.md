# 🧭 ATLAS — Cierre de la Fase 2

**Candidata:** v0.0.19. **Base validada:** v0.0.18 (conservada fuera de este ZIP, sin modificaciones).

## Alcance

Se han eliminado del ejecutable los conjuntos de datos deportivos ficticios, los generadores de series y pronósticos, los editores temporales de planes, los datos de identidad inventados y cualquier exportación de ejemplos. Los módulos anteriores de presentación con datos de prueba se han sustituido por `js/views.js`, que sólo proporciona estructuras visuales vacías y navegación local. `prueba-componentes.html` muestra exclusivamente estados vacíos.

Las cinco pestañas, navegación flotante, seis tarjetas de Hoy, seis tarjetas de Evolución, fichas interiores, zona de pronósticos, listado de Actividades, Plan, Perfil, Ajustes y desplegables permanecen presentes. No se han creado conexiones con Garmin, Worker ni IndexedDB. Los controles que requieren datos no calculan ni modifican nada.

## Limitación deliberada

Sin registros no pueden presentarse rutas, parciales, pronósticos, gráficas históricas, planes individuales o sesiones completas. Sus contenedores y estilos permanecen en el proyecto; cuando se desarrollen las capas de datos se poblarán con información real. Esta entrega no constituye una integración de datos.

## Validación pendiente

Abrir `index.html` y `prueba-componentes.html`; recorrer las cinco pestañas; abrir Estado ATLAS, las métricas de Hoy y Evolución y los desplegables de Perfil y Ajustes. Confirmar la ausencia de cifras deportivas inventadas y errores de ejecución. La entrega sólo pasará a ser estable tras validación manual.
