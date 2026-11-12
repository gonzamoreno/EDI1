# EDI1
Repositorio modelo para la clase

## API de trayectoria académica

`GET /api/trayectoria-academica?id_profesor=<id>` devuelve como JSON el profesor
y sus registros de `public.trayectoria_academica`, ordenados por año. La tabla
debe incluir las columnas `id_profesor`, `año`, `curso`, `asignatura`,
`institucion`, `nota` y `temario`, como en el script SQL de ejemplo.

## API de trayectoria docente

`GET /api/trayectoria-docente?id_profesor=<id>` devuelve como JSON el profesor
y sus registros de `public.trayectoria_docente`, ordenados por año. La tabla
debe incluir las columnas `id_profesor`, `año`, `curso`, `asignatura` e
`institucion`, según el script SQL de ejemplo.

## API de recursos

`GET /api/recursos?id_profesor=<id>` devuelve como JSON el nombre y contacto
del profesor, además de sus registros de `public.recursos`, ordenados por
nombre. La tabla `recursos` debe incluir `id_profesor`, `nombre`, `descripcion`
y `url`; `contacto` se obtiene de la tabla `profesores`.

## Perfil y página «Sobre mí»

`GET /api/profesores/:id` devuelve los datos del perfil, incluyendo
`sobre_mi`, `contacto`, `competencias_profesionales` y
`objetivos_profesionales`. La página `public/sobre_mi.html` usa este endpoint.
Para habilitar los dos últimos campos, ejecutar una vez en el SQL Editor de
Supabase:

```sql
begin;

alter table public.profesores
  add column if not exists competencias_profesionales text,
  add column if not exists objetivos_profesionales text;

update public.profesores
set competencias_profesionales = nullif(btrim(fortalezas), '')
where nullif(btrim(competencias_profesionales), '') is null
  and nullif(btrim(fortalezas), '') is not null;

comment on column public.profesores.competencias_profesionales is
  'Competencias profesionales separadas por punto y coma.';
comment on column public.profesores.objetivos_profesionales is
  'Objetivos profesionales separados por punto y coma.';

commit;
```
