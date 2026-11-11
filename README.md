# EDI1
Repositorio modelo para la clase

## API de trayectoria académica

`GET /api/trayectoria-academica?id_profesor=<id>` devuelve como JSON el profesor
y sus registros de `public.trayectoria_academica`, ordenados por año. La tabla
debe incluir las columnas `id_profesor`, `año`, `curso`, `asignatura`,
`institucion`, `nota` y `temario`, como en el script SQL de ejemplo.
