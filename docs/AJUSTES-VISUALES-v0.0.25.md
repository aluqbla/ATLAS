# ATLAS v0.0.25 · Correcciones solicitadas

Base exclusiva: **ATLAS v0.0.24-Fase-3.5.zip**. La versión rechazada v0.0.25 anterior no se ha utilizado.

## Cambios

- Hoy: en las métricas, Sueño presenta las horas y los minutos separados (`7h 48min`) mediante dos fragmentos visuales y un espacio real; Estado ATLAS usa colores por bandas de puntuación; cerrar la ficha de una sesión abierta desde Hoy devuelve a Hoy.
- Actividades: encabezados de mes con la tipografía de «Último entrenamiento».
- Plan: separadores verticales con extremos libres entre líneas horizontales; Objetivo de Información deja de usar tamaño reducido reservado al estado cualitativo.
- Calendario de entrenamientos: siempre abre la sesión prescrita, incluso si figura como realizada; los títulos de umbral e intervalos incluyen repeticiones y distancia cuando existen esos datos.
- Editor de sesiones DEMO: regreso a la ficha propuesta al cancelar/guardar y al salir de Cambiar fecha. Permite cambiar el tipo de sesión; muestra campos distintos por tipo y ritmos seleccionables del catálogo demostrativo de ritmos del plan. No se implementa el Training Engine ni se persisten estos cambios.
- Cambiar fecha: filas con fecha, separador, contenido y estado siguiendo la retícula de las fichas canónicas.
- Evolución: «Ritmo umbral», «FC Umbral» y encabezado «Pronósticos de carrera» igualado a Hoy.

## Limitaciones / validación

- La aplicación mantiene datos exclusivamente DEMO. La edición de intervalos utiliza estimaciones ilustrativas para distancia total, no un motor de prescripción deportiva.
- Comprobación estática de esquema, caché, scripts y repositorios: 6/6 correctas.
- El navegador automatizado del entorno bloquea las pruebas locales con `ERR_BLOCKED_BY_ADMINISTRATOR`. Se requiere comprobar visualmente en GitHub Pages, especialmente el retorno de subeditores y el cambio dinámico de tipo de sesión.
