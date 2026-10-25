# Íconos ATDC

Fix QA-UX-ICONOS-01: set de 37 íconos SVG de línea (stroke `currentColor`,
viewBox `0 0 24 24`, igual estilo que los íconos de micrófono/enviar que
ya existían en `agente-chat.html`) que reemplaza los emojis usados antes
en toda la interfaz de la app (barra de etapas, chips de acción, "Mi
cuenta", banners de bloqueo por plan, etc.).

Estos archivos son la fuente de referencia del set — la app en sí usa
copias inline de estos mismos trazos (ver `_ICONOS_SVG` y la función
`icono(nombre, tamaño)` en `agente-chat.html`), para que cada ícono
herede el color del tema activo (oscuro/claro) sin pedir un archivo
aparte por tema.

Cualquier ícono nuevo que se agregue a `_ICONOS_SVG` en el futuro debería
sumarse también aquí como archivo `.svg` individual, para mantener este
folder como el catálogo completo y navegable del set.
