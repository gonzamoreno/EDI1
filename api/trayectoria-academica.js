const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.EDI1_SUPABASE_URL
const supabaseKey = process.env.EDI1_SUPABASE_SECRET_KEY || process.env.EDI1_SUPABASE_ANON_KEY

module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET")
    return response.status(405).json({ error: "Método no permitido" })
  }

  const idProfesor = Number(request.query.id_profesor)
  if (!Number.isSafeInteger(idProfesor) || idProfesor <= 0) {
    return response.status(400).json({ error: "El id_profesor debe ser un entero positivo" })
  }

  if (!supabaseUrl || !supabaseKey) {
    return response.status(500).json({ error: "Falta la configuración de Supabase" })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data: profesor, error: errorProfesor } = await supabase
    .from("profesores")
    .select("id_profesor, nombre")
    .eq("id_profesor", idProfesor)
    .maybeSingle()

  if (errorProfesor) {
    console.error("Error consultando el profesor:", errorProfesor.message)
    return response.status(500).json({ error: "No se pudo obtener el profesor" })
  }

  if (!profesor) {
    return response.status(404).json({ error: "Profesor no encontrado" })
  }

  const { data: trayectoria, error: errorTrayectoria } = await supabase
    .from("trayectoria_academica")
    .select("id_profesor, año, curso, asignatura, institucion, nota, temario")
    .eq("id_profesor", idProfesor)
    .order("año", { ascending: false })

  if (errorTrayectoria) {
    console.error("Error consultando la trayectoria académica:", errorTrayectoria.message)
    return response.status(500).json({ error: "No se pudo obtener la trayectoria académica" })
  }

  return response.status(200).json({
    profesor,
    trayectoria_academica: trayectoria,
  })
}
