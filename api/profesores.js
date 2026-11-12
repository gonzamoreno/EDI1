const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.EDI1_SUPABASE_URL
const supabaseKey = process.env.EDI1_SUPABASE_SECRET_KEY || process.env.EDI1_SUPABASE_ANON_KEY

module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET")
    return response.status(405).json({ error: "Método no permitido" })
  }

  if (!supabaseUrl || !supabaseKey) {
    return response.status(500).json({ error: "Falta la configuración de Supabase" })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from("profesores")
    .select("id_profesor, nombre, foto, sobre_mi, contacto, fortalezas, competencias_profesionales, objetivos_profesionales")
    .order("id_profesor")

  if (error) {
    console.error("Error consultando Supabase:", error.message)
    return response.status(500).json({ error: "No se pudieron obtener los profesores" })
  }

  return response.status(200).json(data)
}
