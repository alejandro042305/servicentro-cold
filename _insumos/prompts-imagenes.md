# Prompts de imágenes · Servicentro Cold

Cada imagen tiene: **nombre de archivo** (guárdala así en `src/assets/img/`; la web la toma sola), **proporción**, **tamaño mínimo**, **dónde aparece** y el **prompt** listo para copiar.

Los prompts están en inglés porque Midjourney, DALL·E, Ideogram, Leonardo, Firefly, etc. responden mejor así. Debajo de cada uno va una línea en español con lo que pide.

---

## ⚠️ Antes de generar: regla del prompt maestro

La sección 0.3 del prompt maestro dice: *"nunca fotos de stock con marcas de agua ni **imágenes generadas que simulen trabajos reales**"*. La razón es de confianza: si un cliente descubre que el "técnico" o la "instalación" no existen, se pierde justo lo que la web intenta construir.

| Grupo | ¿IA? | Por qué |
|---|---|---|
| **A. Equipos solos** (mini split, cassette, chiller, etc.) | ✅ Sí | Ilustran un tipo de producto; no dicen "esto lo hicimos nosotros". |
| **B. Fondos de cabecera con velo azul** | 🟡 Con cuidado | Se ven al fondo, detrás de un velo azul del 72–88 %. Mejor: personas de espaldas o de lejos, sin caras protagonistas. Reemplazar por fotos reales cuando existan. |
| **C. Tarjetas que muestran "nuestro trabajo"** | 🟡 Temporal | Úsalas solo mientras llegan las fotos reales. |
| **D. Equipo, responsable técnico, casos de éxito, galería "Instalaciones que hemos hecho"** | ❌ No | Afirman que son personas y trabajos reales de la empresa. **Tienen que ser fotos reales.** |

> **Galería de trabajos reales:** la página de instalación muestra bajo "Instalaciones que hemos hecho" solo los archivos que empiezan por `obra-instalacion-` (por ejemplo `obra-instalacion-1.jpg`). Las imágenes de IA (`instalacion-1`, `instalacion-2`) nunca aparecen ahí.

---

## Bloque de estilo (pégalo al final de TODOS los prompts)

```
Photorealistic commercial photography, natural daylight, clean and orderly, shot on full-frame camera, 35mm lens, shallow depth of field, color palette of white, light grey and blue (#0078E8 accents), professional HVAC and refrigeration context in Bogotá, Colombia, Latin American people, no text, no logos, no brand names on equipment, no watermark.
```

**Prompt negativo** (si la herramienta lo permite):

```
text, letters, logo, brand name, watermark, signature, distorted hands, extra fingers, deformed faces, messy cables, dirty, rust, cartoon, illustration, 3d render, oversaturated, stock photo smile at camera, fisheye
```

---

## B · Cabeceras (fondos 16:9, mínimo 2400 × 1350 px)

Todas llevan encima texto blanco centrado y un velo azul u oscuro. **Deja el centro despejado** (sujeto a un lado, fondo sencillo) para que el texto se lea.

### 1. `hero-tecnico.jpg` — Home, primera pantalla
```
Wide shot of an HVAC technician in a navy blue work uniform, seen from behind and slightly to the side, checking an air conditioning indoor unit mounted high on a white wall of a modern office, using a digital manifold gauge, tidy workspace, subject placed on the right third of the frame, large calm empty wall area in the center and left for text overlay, soft daylight from a window
```
*Técnico de espaldas revisando un aire acondicionado en una oficina, a la derecha, con espacio vacío al centro.*

### 2. `mantenimiento-hero.jpg` — Reparación y mantenimiento
```
Close-up of gloved hands of a technician cleaning the filter of a split air conditioner indoor unit, front cover open, clean white wall, background softly blurred, composition with the action on the left third and negative space on the right
```
*Manos con guantes limpiando el filtro de un mini split.*

### 3. `instalacion-hero.jpg` — Instalación
```
Two technicians in navy uniforms installing a new wall-mounted split air conditioner in a bright modern apartment living room, one on a small ladder leveling the unit, seen from a distance and from behind, faces not visible, clean floor protected with a drop cloth, wide composition with empty space in the center
```
*Dos técnicos instalando un mini split en un apartamento, de lejos y sin caras.*

### 4. `aire-hero.jpg` — Tipos de aire acondicionado
```
Modern open-plan office in Bogotá with ceiling cassette air conditioning units integrated into a white suspended ceiling, large windows with city view, empty desks, bright and clean, wide angle, no people
```
*Oficina moderna con aires tipo cassette en el techo, sin personas.*

### 5. `cuarto-frio-hero.jpg` — Cuartos fríos
```
Interior of a clean walk-in cold room with white insulated sandwich panels, stainless steel shelving with neatly stacked produce crates, an evaporator unit mounted near the ceiling, cool blue-white lighting, slight cold mist, symmetrical wide composition, no people
```
*Interior de cuarto frío limpio con estanterías y evaporador, sin personas.*

### 6. `chiller-hero.jpg` — Chillers
```
Large air-cooled industrial chiller unit on the rooftop of an industrial building, insulated blue and white water pipes, clear sky, wide angle, clean and modern, no people, no brand markings
```
*Chiller industrial enfriado por aire en una terraza, sin personas.*

### 7. `sectores-hero.jpg` — Sectores
```
Supermarket refrigerated aisle with glass-door display coolers full of dairy and beverages, bright clean store, shallow depth of field, slightly out of focus, no visible brand labels, no people
```
*Pasillo refrigerado de supermercado, desenfocado y sin marcas.*

### 8. `proyectos-hero.jpg` — Proyectos
```
Walk-in cold room under construction inside a warehouse, white insulated panels being assembled, a technician far in the background seen from behind, construction in progress but tidy, wide shot
```
*Montaje de un cuarto frío en una bodega, técnico de espaldas y a lo lejos.*

### 9. `contacto.jpg` — Fondo de la sección de contacto (va con velo azul del 88 %)
```
Abstract close-up of the aluminum fins of an air conditioning condenser coil with soft blue light reflections, geometric pattern, shallow depth of field, minimalist
```
*Detalle abstracto de las aletas de un condensador. Es casi textura: va tapado por un velo azul.*

### 10–14. Landings de Google Ads (`lp-*.jpg`, 16:9, velo azul del 72 %)

**`lp-urgencias.jpg`**
```
Technician seen from behind kneeling next to an outdoor air conditioning condenser unit at dusk, using a flashlight and a multimeter, urgent but calm atmosphere, subject on the left third, empty space on the right
```

**`lp-instalacion.jpg`**
```
Newly installed white split air conditioner on the wall of a bright modern bedroom, clean finish, no visible pipes, plant and minimalist decor, morning light, no people
```

**`lp-mantenimiento.jpg`**
```
Rooftop of a commercial building with several rows of air conditioning condenser units neatly aligned, a technician with a clipboard far in the background seen from behind, preventive maintenance atmosphere, wide shot
```

**`lp-cuartos-frios.jpg`**
```
Freezer cold room interior with frost on the evaporator, frozen boxed products on stainless steel racks, temperature controller display glowing on the wall (no readable text), cold blue light, no people
```

**`lp-chillers.jpg`**
```
Industrial plant machine room with a water-cooled chiller, blue insulated pipes, pumps and valves, clean concrete floor, wide angle, no people
```

---

## C · Tarjetas de servicios (temporales hasta tener fotos reales)

### 15. `mantenimiento-1.jpg` — 1:1, mínimo 1200 × 1200 px — Tarjeta "Reparación y mantenimiento"
```
Square composition, close-up of a technician's hands connecting a digital manifold gauge to the service valves of an outdoor air conditioning unit, gauges in focus, blurred background
```

### 16. `instalacion-1.jpg` — 1:1, mínimo 1200 × 1200 px — Tarjeta "Instalación y sustitución"
```
Square composition, a white split air conditioner indoor unit freshly installed on a white wall of a modern office, clean finish, soft daylight, no people
```

### 17. `cuarto-frio-1.jpg` — 1:1, mínimo 1200 × 1200 px — Tarjeta "Cuartos fríos y chillers"
```
Square composition, open door of a walk-in cold room seen from outside, white insulated panels, stainless steel shelves with fresh produce inside, cold mist at the door, no people
```

### 18. `instalacion-2.jpg` — 4:3, mínimo 1600 × 1200 px — Tarjeta grande "Instalación con garantía" (velo azul)
```
Outdoor air conditioning condenser unit mounted on a wall bracket on a residential terrace in Bogotá, tidy insulated copper pipes, city rooftops in the background, golden hour light
```

### 19. `chiller-1.jpg` — 4:3, mínimo 1600 × 1200 px — Tarjeta grande "Proyectos de cuartos fríos y chillers" (velo azul)
```
Industrial chiller unit installed in a plant, blue insulated pipes and valves, clean and well lit, three-quarter view, no people
```

---

## A · Equipos (✅ aptas para IA) — 4:3, mínimo 1600 × 1200 px, fondo claro

Para que se vean como una serie, usa **el mismo encuadre y la misma luz** en todas.

### 20. `equipo-mini-split.jpg`
```
Product-style photo of a white wall-mounted mini split air conditioner indoor unit on a light grey wall, three-quarter view, soft studio lighting, minimalist, no brand
```

### 21. `equipo-multi-split.jpg`
```
One outdoor multi split condenser unit connected to three white wall-mounted indoor units shown in a clean architectural cutaway style photo of a modern apartment, soft lighting, no brand
```

### 22. `equipo-piso-techo.jpg`
```
White floor-ceiling (under-ceiling) air conditioning unit mounted high on the wall of a restaurant dining room, three-quarter view, warm and clean, no people, no brand
```

### 23. `equipo-cassette.jpg`
```
Four-way ceiling cassette air conditioner flush mounted in a white suspended ceiling, view from below at an angle, modern office, soft light, no brand
```

### 24. `equipo-ductos.jpg`
```
Ducted central air conditioning: linear supply air grilles in the ceiling of a large modern open office, with exposed insulated duct partially visible, clean, no people, no brand
```

### 25. `equipo-inverter.jpg` — página de instalación, bloque "Equipos inverter"
```
White inverter air conditioning outdoor condenser unit on a clean balcony, three-quarter view, soft daylight, modern building facade, no brand
```

### (26. `equipo-vrf.jpg` — no la generes todavía)
La tarjeta VRF/VRV está oculta hasta que confirmes si la empresa ofrece ese servicio.

---

## D · ❌ No generar con IA (tienen que ser fotos reales)

| Archivo | Dónde aparece | Qué foto tomar |
|---|---|---|
| `nosotros-hero.jpg` | Cabecera de "Nosotros" | El equipo real junto al vehículo o en un trabajo, de cuerpo entero |
| `equipo-persona-1.jpg`, `equipo-persona-2.jpg`, … | Galería "Nuestro equipo" | Retrato de cada técnico con uniforme, fondo neutro |
| Foto del responsable técnico (nombre en `site.ts` → `responsableTecnico.foto`) | Bloque "Quién te atiende" | Retrato real, cuadrado |
| `caso-*.jpg` | Casos de éxito | Antes/después reales de cada caso, con permiso del cliente |
| `obra-instalacion-1.jpg`, `obra-instalacion-2.jpg`, … | Galería "Instalaciones que hemos hecho" | Fotos de instalaciones terminadas por la empresa |

> **Alternativa para `nosotros-hero` mientras tanto:** si no subes esa foto, la cabecera se ve en azul sólido y se ve bien. No hace falta rellenarla con IA.

---

## Cómo subirlas

1. Exporta en **JPG**, calidad 85–90 %, con el tamaño mínimo indicado (más grande no hace daño: la web genera versiones AVIF/WebP livianas).
2. Guárdalas con el **nombre exacto** en `src/assets/img/` (por ejemplo `src/assets/img/hero-tecnico.jpg`).
3. La web las usa sola; no hay que tocar código. Las que no subas siguen mostrando el espacio "Foto pendiente" o el fondo azul.

---

## Ya generadas en Canva (pendientes de descargar)

Abre cada enlace, dale **Descargar → JPG** y guarda el archivo en `src/assets/img/` con este nombre exacto:

| Guardar como | Enlace |
|---|---|
| `hero-tecnico.jpg` | https://www.canva.com/M/MAHbC0WjR7E |
| `mantenimiento-1.jpg` | https://www.canva.com/M/MAHbCyDa8pg |
| `instalacion-1.jpg` | https://www.canva.com/M/MAHbC2-g9E4 |
| `cuarto-frio-1.jpg` | https://www.canva.com/M/MAHbC2pQxO8 |
| `equipo-mini-split.jpg` | https://www.canva.com/M/MAHbCx0aPqc |

Pendientes por falta de créditos de Canva: todas las demás (empezando por `chiller-1`, `instalacion-2` y `contacto`, que completan el inicio).
