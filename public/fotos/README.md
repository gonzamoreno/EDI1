# Carpeta de Fotos del Portafolio Docente (`/public/fotos`)

Esta carpeta está destinada al almacenamiento y versionado de las imágenes y fotos de perfil de los docentes del portafolio.

## 📁 Convención de nombres recomendada

Para vincular automáticamente o referenciar las fotos con la base de datos o el sistema de perfiles, se sugiere utilizar:

1. **Por ID de profesor (recomendado):**
   - `profesor-1.jpg`
   - `profesor-2.png`
   - `profesor-3.webp`
   - *(Donde el número corresponde al `id_profesor`)*

2. **Por nombre o slug del docente:**
   - `laura-mendez.jpg`
   - `patricia-alvarez.png`

## 🖼️ Formatos y dimensiones recomendadas

- **Formatos admitidos:** JPEG/JPG (`.jpg`, `.jpeg`), PNG (`.png`), WebP (`.webp`), SVG (`.svg`), GIF (`.gif`).
- **Proporción de aspecto:** Cuadrada (1:1), ideal para avatares circulares.
- **Resolución sugerida:** Entre `300x300 px` y `600x600 px`.
- **Peso de archivo:** Menor a `500 KB` para garantizar una carga rápida.

## 🔗 Cómo referenciar las fotos

Desde cualquier página dentro de `/public` (ej. `profesor.html` o `profesores.html`):
```html
<img src="fotos/profesor-1.jpg" alt="Foto de perfil de..." class="avatar-img" />
```

O mediante ruta absoluta:
```html
<img src="/fotos/profesor-1.jpg" alt="Foto de perfil de..." class="avatar-img" />
```

## 📸 Carga desde la interfaz web

En la página de perfil docente (`profesor.html`), los usuarios pueden hacer clic en el círculo del avatar o en el ícono de cámara para seleccionar y cargar una foto directamente desde su dispositivo. La foto se previsualiza al instante y se almacena localmente (`localStorage`).
