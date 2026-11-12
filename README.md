# ATLAS v0.0.38 — Diagnóstico Garmin oficial limitado (Fase 4.5)

**Candidata no validada.** Base estable v0.0.37 intacta.

## Único cambio funcional

`worker/worker.js`: nueva comprobación **de solo lectura** en la página administrativa del Worker. Tras iniciar sesión, pulsa «Diagnóstico oficial limitado (4.5)». Solo consulta perfil, primera actividad del catálogo y detalle de esa actividad, por rutas oficiales. Devuelve exclusivamente nombres y tipos de campos potencialmente asociados a VO₂, umbral, predisposición, carga y pronósticos. No expone valores, nombres personales, credenciales ni archivos completos; no guarda datos. `worker/tests/auth.test.mjs`: dos nuevas pruebas locales.

## Instalación

1. Cloudflare → Workers & Pages → atlas → Edit code.
2. Reemplazar el código por `worker/worker.js` y pulsar Deploy. **No modificar ningún secreto.**
3. Abrir `https://atlas.aj-luque.workers.dev`, iniciar sesión y pulsar **Diagnóstico oficial limitado (4.5)**.
4. Comunicar únicamente el resultado (código, `sources`, `metrics`); el diagnóstico no contiene valores deportivos.

**No actualizar GitHub Pages.** Sus archivos permanecen exactamente iguales a v0.0.37.

## Interpretación

`candidate_fields_found` solo identifica nombres de campos, no verifica semántica ni precisión. `not_identified_in_sample` significa que no aparece en esos tres recursos acotados, **no** que esté ausente de toda la API oficial. Fallos individuales quedan señalados. Si la muestra no contiene una actividad, no se consulta detalle. No se utiliza API privada, no se consulta histórico, no se descargan FIT y no se anticipa la fase 4.6.

**Seguridad residual heredada:** la contraseña del Worker puede ser corta y no hay limitación de intentos; este cambio no empeora ni corrige esa configuración anterior.
