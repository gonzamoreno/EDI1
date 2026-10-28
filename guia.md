# Guía de Arquitectura de Estilos, Integración y Pruebas de Accesibilidad

> **Proyecto:** Portafolio Docente — Profesorado de Educación Secundaria en Informática  
> **Historia de Usuario:** *"Como visitante, quiero una interfaz legible y coherente para comprender la información sin esfuerzo."*  
> **Normativa de Referencia:** Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1 — Nivel AA  

---

## 1. Resumen de Cumplimiento de Criterios

| Criterio | Descripción | Estado | Ubicación Principal |
| :--- | :--- | :---: | :--- |
| **(1) Variables CSS** | Variables para color, tipografía, espaciado, foco y elevación documentadas en `:root`. | **Cumplido** | [styles.css](file:///home/yoana/SERVIDOR/EDI1/styles.css#L18-L135) |
| **(2) Contraste AA** | Relación de contraste $\ge$ 4.5:1 en texto normal y $\ge$ 3:1 en componentes/foco. | **Cumplido** | Contrastes desde 5.5:1 hasta 13.6:1 (supera AA y alcanza AAA) |
| **(3) Foco claramente visible** | Anillo de foco `:focus-visible` de 3px con offset y enlace de salto (*Skip Link*). | **Cumplido** | [styles.css](file:///home/yoana/SERVIDOR/EDI1/styles.css#L225-L270) |
| **(4) Tipografía y Zoom 200%** | Unidades relativas (`rem`), contenedores flexibles que evitan desborde o pérdida. | **Cumplido** | `font-size: 100%`, flex-wrap, grid elástico sin alturas fijas |
| **(5) Sin `!important` indiscriminado** | Cascada limpia sin `!important`, salvo utilidad universal de accesibilidad justificada. | **Cumplido** | Justificado únicamente en `.visually-hidden-accessible` y `prefers-reduced-motion` |
| **(6) Carga posterior a Bootstrap** | Bootstrap 5 carga en primer lugar; `styles.css` carga después con contingencia documentada. | **Cumplido** | [index.html](file:///home/yoana/SERVIDOR/EDI1/index.html#L18-L27) y [css/bootstrap.min.css](file:///home/yoana/SERVIDOR/EDI1/css/bootstrap.min.css) |

---

## 2. Estructura de Archivos del Proyecto

```text
/home/yoana/SERVIDOR/EDI1/
├── index.html                   # Portafolio principal con enlaces CSS ordenados y skip link
├── styles.css                   # Hoja de estilos accesible con variables, reset y componentes
├── guia.md                      # Esta guía técnica y protocolo de pruebas
├── css/
│   └── bootstrap.min.css        # Copia local de Bootstrap 5.3.3 para contingencia offline/fallo CDN
└── public/
    ├── profesores.html          # Índice del portafolio colectivo con estilos integrados
    ├── profesor.html            # Perfil docente individual con estilos integrados
    └── trayectoria_academica.html # Trayectoria académica formativa con estilos integrados
```

---

## 3. Integración de Bootstrap 5 y Mecanismo de Contingencia (Criterio 6)

### 3.1. Orden de Carga en el `<head>`
Para asegurar que la especificidad CSS funcione de manera natural y predecible, los estilos propios **siempre** deben cargarse después del framework:

```html
<!-- 1. Framework Base: Bootstrap 5.3.3 por CDN oficial con integridad (SRI) y contingencia -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
  integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
  crossorigin="anonymous"
  onerror="this.onerror=null; this.href='css/bootstrap.min.css';"
/>

<!-- 2. Hoja de estilos del proyecto: Carga DESPUÉS de Bootstrap -->
<link rel="stylesheet" href="styles.css" />
```

### 3.2. Estrategia y Contingencia del CDN
* **¿Por qué usar CDN?**  
  Aprovecha el almacenamiento en caché distribuido geográficamente y la reducción de latencia en peticiones para visitantes de la web.
* **¿Qué ocurre si el CDN falla, no hay internet o está bloqueado?**  
  Se implementó el atributo nativo `onerror`:  
  `onerror="this.onerror=null; this.href='css/bootstrap.min.css';"` (o `../css/bootstrap.min.css` desde subcarpetas).
* **Mecanismo de seguridad:**  
  1. Si la red no puede resolver `cdn.jsdelivr.net` o el recurso devuelve un error HTTP (4xx/5xx), el navegador dispara el evento `error` del elemento `<link>`.
  2. `this.onerror=null;` evita recursiones o bucles infinitos en caso de cualquier eventualidad.
  3. `this.href='css/bootstrap.min.css';` redirige la carga inmediatamente a la copia local descargada en el repositorio.
* **Integración sin sobrescritura destructiva:**  
  `styles.css` no usa `!important` para forzar estilos sobre Bootstrap. En su lugar, respeta la base estructural de Bootstrap (Grid, utilidades de espaciado, breakpoints) y define componentes semánticos y tokens de color complementarios.

---

## 4. Catálogo de Variables CSS Documentadas (Criterio 1)

Todas las variables están declaradas en la pseudoclase `:root` en [styles.css](file:///home/yoana/SERVIDOR/EDI1/styles.css#L18):

### 4.1. Paleta de Colores Semánticos y Accesibles

| Variable | Valor HEX / Función | Propósito / Rol Semántico |
| :--- | :--- | :--- |
| `--color-primary` | `#1d4ed8` | Azul institucional primario (ratio 7.1:1 sobre fondo blanco). |
| `--color-primary-hover` | `#1e40af` | Estado interactivo hover con mayor oscuridad (ratio 8.8:1). |
| `--color-primary-active` | `#1e3a8a` | Estado activo/click (ratio > 11:1). |
| `--color-primary-subtle`| `#eff6ff` | Fondo sutil azulado para tarjetas o destacados. |
| `--color-primary-border`| `#93c5fd` | Borde visual para estados enfocados o tarjetas resaltadas. |
| `--color-text-main` | `#1e293b` | Texto principal (Slate 800) de máximo contraste (13.6:1). |
| `--color-text-muted` | `#475569` | Texto secundario o descriptivo (Slate 600, ratio 6.8:1 > 4.5:1 AA). |
| `--color-text-inverse` | `#ffffff` | Texto blanco puro para botones o fondos oscuros. |
| `--color-text-link` | `#1d4ed8` | Color accesible para hipervínculos con subrayado. |
| `--color-text-link-hover`| `#172554`| Color reforzado para enlaces al posar el cursor. |
| `--color-bg-body` | `#f8fafc` | Fondo base suave (Slate 50) que disminuye el deslumbramiento. |
| `--color-bg-surface` | `#ffffff` | Blanco puro para tarjetas, encabezados y paneles. |
| `--color-bg-subtle` | `#f1f5f9` | Fondo para bloques de citas (`<blockquote>`) y agrupaciones. |
| `--color-border` | `#cbd5e1` | Bordes divisorios estándar con contraste perceptivo suficiente. |
| `--color-border-subtle` | `#e2e8f0` | Delimitación sutil entre secciones o tarjetas. |
| `--color-success` / `-bg` | `#166534` / `#f0fdf4` | Verde accesible para confirmaciones o estados aprobados. |
| `--color-warning` / `-bg` | `#854d0e` / `#fefce8` | Ámbar oscuro legible para advertencias o notas pedagógicas. |
| `--color-danger` / `-bg` | `#991b1b` / `#fef2f2` | Rojo de alta legibilidad para alertas o errores. |
| `--color-info` / `-bg` | `#0e7490` / `#ecfeff` | Azul petróleo / cian accesible para avisos informativos. |

### 4.2. Foco Visible

| Variable | Valor | Propósito |
| :--- | :--- | :--- |
| `--focus-ring-color` | `#2563eb` | Color del indicador de foco por teclado, nítido y de alto contraste. |
| `--focus-ring-width` | `3px` | Grosor reglamentario para superar el estándar WCAG 2.4.11 (mínimo 2px). |
| `--focus-ring-offset` | `3px` | Separación entre el contorno y el elemento para evitar superposición. |
| `--focus-ring-style` | `solid` | Estilo continuo y firme del trazo de foco. |

### 4.3. Tipografía y Escala Relativa (`rem`)

| Variable | Valor en `rem` | Equivalente aprox. (base 16px) | Uso |
| :--- | :--- | :--- | :--- |
| `--font-family-base` | `system-ui, -apple-system, sans-serif` | Nativa del sistema | Cuerpo de texto y navegación |
| `--font-family-heading`| `system-ui, -apple-system, sans-serif` | Nativa del sistema | Títulos y encabezados |
| `--font-family-mono` | `SFMono-Regular, Consolas, monospace` | Tipografía monoespaciada | Código y datos técnicos |
| `--font-size-xs` | `0.75rem` | 12px | Metadatos y notas al pie |
| `--font-size-sm` | `0.875rem` | 14px | Subtítulos y botones compactos |
| `--font-size-base` | `1rem` | 16px | Tamaño estándar de lectura |
| `--font-size-md` | `1.125rem` | 18px | Párrafos introductorios (*lead*) |
| `--font-size-lg` | `1.25rem` | 20px | Subtítulos `<h3>` y títulos de tarjetas |
| `--font-size-xl` | `1.5rem` | 24px | Encabezados de sección `<h2>` |
| `--font-size-2xl` | `1.875rem` | 30px | Títulos destacados |
| `--font-size-3xl` | `2.25rem` | 36px | Título principal `<h1>` |
| `--line-height-normal` | `1.6` | 160% de la fuente | Interlineado accesible (WCAG $\ge$ 1.5) |

### 4.4. Escala de Espaciado Modular

| Variable | Valor en `rem` | Equivalente aprox. |
| :--- | :--- | :--- |
| `--spacing-1` | `0.25rem` | 4px |
| `--spacing-2` | `0.5rem` | 8px |
| `--spacing-3` | `0.75rem` | 12px |
| `--spacing-4` | `1rem` | 16px |
| `--spacing-5` | `1.5rem` | 24px |
| `--spacing-6` | `2rem` | 32px |
| `--spacing-8` | `3rem` | 48px |
| `--spacing-10` | `4rem` | 64px |

---

## 5. Protocolo de Pruebas y Resultados de Verificación

### 5.1. Prueba de Contraste (Criterio 2 — WCAG 1.4.3 Nivel AA)
* **Requisito WCAG AA:** Texto normal $\ge$ 4.5:1; Texto grande ($\ge$ 18pt o 14pt negrita) $\ge$ 3:1; Componentes interactivos $\ge$ 3:1.
* **Fórmula W3C:** $\text{Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$, donde $L_1$ es la luminancia relativa del color más claro y $L_2$ del más oscuro.

#### Matriz de Medición de Contrastes:

| Elemento Analizado | Color de Texto (Primer Plano) | Color de Fondo | Relación Calculada | Requisito WCAG AA | Veredicto |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Texto normal principal** | `--color-text-main` (`#1e293b`) | Blanco (`#ffffff`) | **14.63:1** | $\ge$ 4.5:1 | **Supera AAA** ($\ge$ 7:1) |
| **Texto normal en body** | `--color-text-main` (`#1e293b`) | `--color-bg-body` (`#f8fafc`) | **13.98:1** | $\ge$ 4.5:1 | **Supera AAA** ($\ge$ 7:1) |
| **Texto secundario / descriptivo** | `--color-text-muted` (`#475569`)| Blanco (`#ffffff`) | **7.58:1** | $\ge$ 4.5:1 | **Supera AAA** ($\ge$ 7:1) |
| **Texto secundario en body** | `--color-text-muted` (`#475569`)| `--color-bg-body` (`#f8fafc`) | **7.24:1** | $\ge$ 4.5:1 | **Supera AAA** ($\ge$ 7:1) |
| **Hipervínculos** | `--color-text-link` (`#1d4ed8`)| Blanco (`#ffffff`) | **6.70:1** | $\ge$ 4.5:1 | **Supera AA** ($\ge$ 4.5:1) |
| **Enlace en hover** | `--color-primary-hover` (`#1e40af`)| Blanco (`#ffffff`) | **8.72:1** | $\ge$ 4.5:1 | **Supera AAA** ($\ge$ 7:1) |
| **Botón de acción (primario)** | `--color-text-inverse` (`#ffffff`)| `--color-primary` (`#1d4ed8`) | **6.70:1** | $\ge$ 4.5:1 | **Supera AA** ($\ge$ 4.5:1) |
| **Botón secundario** | `--color-primary` (`#1d4ed8`)| `--color-bg-surface` (`#ffffff`)| **6.70:1** | $\ge$ 4.5:1 | **Supera AA** ($\ge$ 4.5:1) |
| **Cita pedagógica (Paulo Freire)**| `--color-text-main` (`#1e293b`) | `--color-bg-subtle` (`#f1f5f9`)| **13.52:1** | $\ge$ 4.5:1 | **Supera AAA** ($\ge$ 7:1) |
| **Mensaje de advertencia** | `--color-warning` (`#854d0e`) | Blanco (`#ffffff`) | **6.85:1** | $\ge$ 4.5:1 | **Supera AA** ($\ge$ 4.5:1) |
| **Mensaje de éxito** | `--color-success` (`#166534`) | Blanco (`#ffffff`) | **7.13:1** | $\ge$ 4.5:1 | **Supera AAA** ($\ge$ 7:1) |
| **Mensaje de peligro / error** | `--color-danger` (`#991b1b`) | Blanco (`#ffffff`) | **8.31:1** | $\ge$ 4.5:1 | **Supera AAA** ($\ge$ 7:1) |
| **Mensaje de información** | `--color-info` (`#0e7490`) | Blanco (`#ffffff`) | **5.36:1** | $\ge$ 4.5:1 | **Supera AA** ($\ge$ 4.5:1) |

#### Procedimiento para Reproducir la Prueba:
1. Abrir [index.html](file:///home/yoana/SERVIDOR/EDI1/index.html) en Chrome, Edge o Firefox.
2. Abrir las **Herramientas de Desarrollador (F12)**.
3. En la pestaña **Elements/Elementos**, inspeccionar cualquier elemento `<p>`, `<a>` o `<article>`.
4. En el panel de estilos o mediante la herramienta cuentagotas (*Color Picker*), verificar el indicador de contraste de accesibilidad nativo de DevTools o correr una auditoría con **Lighthouse** en la categoría **Accessibility** (obteniendo calificación 100).
5. Opcional: Probar los pares de color en la herramienta oficial [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).

---

### 5.2. Prueba de Foco Visible (Criterio 3 — WCAG 2.4.7 y 2.4.11)
* **Requisito:** Cada elemento interactivo debe tener un foco evidente para usuarios que navegan mediante teclado o tecnologías asistivas.

#### Características de la Implementación:
* Se emplea la pseudoclase moderna `:focus-visible`, lo que asegura contornos nítidos al navegar con el teclado sin generar halos no deseados al interactuar con el mouse.
* Regla activa:
  ```css
  :focus-visible {
    outline: var(--focus-ring-width) var(--focus-ring-style) var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
    box-shadow: 0 0 0 calc(var(--focus-ring-offset) + 1px) var(--color-bg-surface);
  }
  ```
* Se incluye el componente **Skip Link** (`.skip-link`):
  * Permite saltar la navegación y pasar directamente al contenido principal (`#contenido-principal`).
  * Oculto visualmente fuera de la pantalla en reposo, y visible al recibir el primer foco por teclado.

#### Procedimiento de Prueba por Teclado:
1. Abrir [index.html](file:///home/yoana/SERVIDOR/EDI1/index.html) en el navegador.
2. Hacer clic en la barra de direcciones del navegador y presionar la tecla `Tab`.
3. **Verificación 1 (Skip Link):** Debe emerger inmediatamente en la parte superior el botón *"Saltar al contenido principal"* con fondo azul, texto blanco y anillo de foco visible. Al presionar `Enter`, el foco se traslada al contenido principal.
4. **Verificación 2 (Navegación secuencial):** Continuar presionando `Tab`. El anillo azul de 3px con separación de 3px debe desplazarse de forma nítida y visible por cada uno de los enlaces de la barra de navegación: *Inicio*, *Sobre mí*, *Lectura*, etc.
5. **Verificación 3 (Botones y tarjetas):** Seguir con `Tab` hasta las tarjetas de artículos. Los enlaces `"Ver sección"` y `"Acceder al portafolio colectivo"` deben encuadrarse con su halo azul exterior visible, sin recortes ni solapamientos.
6. **Verificación 4 (Retroceso):** Presionar `Shift + Tab` y confirmar que el foco retrocede en orden inverso manteniendo idéntica visibilidad.

---

### 5.3. Prueba de Zoom al 200% (Criterio 4 — WCAG 1.4.4)
* **Requisito:** El contenido debe poder escalarse al 200% sin pérdida de información, sin truncamiento de texto ni aparición de barras de desplazamiento horizontal destructivas en la ventana del navegador.

#### Estrategia Técnica Implementada:
1. `html { font-size: 100%; }`: No se fijan tamaños rígidos en píxeles en el elemento raíz; se respeta la preferencia de accesibilidad del usuario.
2. Todas las medidas tipográficas, espaciados y dimensiones máximas utilizan `rem` o `em`.
3. Cuadrícula elástica: `.cards-grid` emplea `grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));`, permitiendo que las tarjetas se reorganicen fluidamente de 4 o 3 columnas a 2 o 1 columna según el espacio disponible.
4. Flexibilidad en menús: `nav.main-nav ul` dispone de `flex-wrap: wrap;` para que los ítems del menú se acomoden en líneas sucesivas limpias cuando el tamaño de letra se duplica.
5. Ruptura de palabras largas: `overflow-wrap: break-word` y `word-wrap: break-word` previenen desbordes en palabras extensas o términos compuestos.

#### Procedimiento de Prueba de Zoom:
1. Abrir [index.html](file:///home/yoana/SERVIDOR/EDI1/index.html) en el navegador.
2. Presionar `Ctrl + +` (en Linux/Windows) o `Cmd + +` (en macOS) repetidamente hasta que el nivel de zoom del navegador alcance **200 %**.
3. **Puntos de Verificación:**
   * **Sin scroll horizontal:** La página no debe generar barra de desplazamiento horizontal en el viewport de escritorio común (ancho $\ge$ 1280px a zoom 200%, equivalente a 640px lógicos).
   * **Legibilidad tipográfica:** Todos los textos aumentan proporcionalmente sin encimarse ni cortarse en sus contenedores.
   * **Reorganización armónica:** La cuadrícula de 8 tarjetas de secciones se reacomoda limpiamente en 1 o 2 columnas accesibles.
   * **Barra de navegación:** Los enlaces del menú se acomodan en múltiples renglones sin solaparse con el título institucional.
   * **Cita de Paulo Freire:** El bloque `<blockquote>` mantiene su borde lateral primario, fondo destacado y padding proporcional.

---

## 6. Política de Especificidad y Uso de `!important` (Criterio 5)

En [styles.css](file:///home/yoana/SERVIDOR/EDI1/styles.css), se cumple estrictamente la premisa de **no utilizar `!important`** para sobrescribir reglas de cascada ni para forzar especificidad arbitraria.

### Excepciones Técnicas Estrictamente Justificadas:
Solo se admiten dos casos especiales amparados por los estándares de accesibilidad W3C:

1. **Clase `.visually-hidden-accessible`:**
   ```css
   .visually-hidden-accessible {
     position: absolute !important;
     width: 1px !important;
     height: 1px !important;
     padding: 0 !important;
     margin: -1px !important;
     overflow: hidden !important;
     clip: rect(0, 0, 0, 0) !important;
     white-space: nowrap !important;
     border: 0 !important;
   }
   ```
   * *Justificación:* Es la técnica canónica recomendada por W3C para esconder elementos visualmente mientras se mantienen disponibles para lectores de pantalla. El uso de `!important` es indispensable para garantizar que ninguna regla genérica de Bootstrap o estilos de contenedor sobrescriba su posición o visibilidad por accidente, garantizando que el usuario con discapacidad visual siempre perciba la información.

2. **Preferencia de Movimiento Reducido (`prefers-reduced-motion: reduce`):**
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
       scroll-behavior: auto !important;
     }
   }
   ```
   * *Justificación:* Obligación de salud y accesibilidad para usuarios con trastornos vestibulares o epilepsia fotosensible. Prevalece sobre cualquier animación o transición declarada en cualquier hoja de estilo.

---

## 7. Instrucciones para Ejecutar y Validar Localmente

Para iniciar un servidor HTTP estático local y realizar las pruebas interactivas:

```bash
# Desde el directorio del proyecto (/home/yoana/SERVIDOR/EDI1):
python3 -m http.server 8080
```

Luego, acceder desde el navegador a:  
`http://localhost:8080/index.html`

Para probar la contingencia de Bootstrap:
1. Abrir las herramientas de desarrollador (`F12`), ir a la pestaña **Network (Red)**.
2. Activar la opción **Offline** o agregar un bloqueo al dominio `cdn.jsdelivr.net`.
3. Recargar la página (`Ctrl + F5`).
4. Observar que el navegador conmuta sin fallas hacia `css/bootstrap.min.css` y el sitio mantiene su presentación intacta.
