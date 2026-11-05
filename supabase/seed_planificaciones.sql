-- Datos de ejemplo para public."Planificaciones"
-- Puede ejecutarse más de una vez sin duplicar estos registros.

insert into public."Planificaciones" ("materia", "titulo", "descripción", "curso", "link")
select datos."materia", datos."titulo", datos."descripción", datos."curso", datos."link"
from (
  values
    (
      'Programación',
      'Introducción al pensamiento computacional',
      'Secuencia didáctica para reconocer patrones, descomponer problemas y diseñar algoritmos sencillos.',
      '1.º año',
      'https://example.com/planificaciones/pensamiento-computacional'
    ),
    (
      'Bases de Datos',
      'Modelo relacional y consultas SQL',
      'Actividades prácticas para identificar entidades, relaciones y consultas básicas sobre una base de datos.',
      '3.º año',
      'https://example.com/planificaciones/modelo-relacional'
    ),
    (
      'Robótica',
      'Sensores y automatización',
      'Propuesta de trabajo colaborativo para explorar sensores, actuadores y respuestas automatizadas.',
      '2.º año',
      'https://example.com/planificaciones/sensores-automatizacion'
    )
) as datos("materia", "titulo", "descripción", "curso", "link")
where not exists (
  select 1
  from public."Planificaciones" p
  where p."materia" = datos."materia"
    and p."titulo" = datos."titulo"
);
