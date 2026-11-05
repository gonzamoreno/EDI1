-- Datos de prueba para public."Reflexiones"
-- Requiere que existan profesores con id_profesor 1, 2 y 3.
-- Puede ejecutarse más de una vez sin duplicar registros.

insert into public."Reflexiones" (
  "id_reflexión",
  "id_profesor",
  "titulo",
  "descripción",
  "link"
)
values
  (
    'reflexion-001',
    1,
    'El valor de aprender haciendo',
    'Reflexión sobre el uso de actividades prácticas para favorecer aprendizajes significativos.',
    'https://example.com/reflexiones/aprender-haciendo'
  ),
  (
    'reflexion-002',
    2,
    'Tecnología y pensamiento crítico',
    'Análisis del rol docente en la integración crítica y responsable de tecnologías digitales.',
    'https://example.com/reflexiones/tecnologia-pensamiento-critico'
  ),
  (
    'reflexion-003',
    3,
    'Evaluar para acompañar',
    'Reflexión sobre la evaluación formativa como herramienta para acompañar las trayectorias estudiantiles.',
    'https://example.com/reflexiones/evaluar-para-acompanar'
  )
on conflict ("id_reflexión") do update set
  "id_profesor" = excluded."id_profesor",
  "titulo" = excluded."titulo",
  "descripción" = excluded."descripción",
  "link" = excluded."link";
