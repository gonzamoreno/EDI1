require("dotenv").config({ path: ".env.development.local" })

const http = require("node:http")
const fs = require("node:fs")
const path = require("node:path")
const { createClient } = require("@supabase/supabase-js")

const PORT = Number(process.env.PORT) || 8000
const publicRoot = __dirname
const supabaseUrl = process.env.EDI1_SUPABASE_URL
const supabaseKey = process.env.EDI1_SUPABASE_SECRET_KEY || process.env.EDI1_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Faltan EDI1_SUPABASE_URL y una clave de Supabase en el entorno")
}

const supabase = createClient(supabaseUrl, supabaseKey)

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  })
  response.end(JSON.stringify(payload))
}

async function getProfesores() {
  const { data, error } = await supabase
    .from("profesores")
    .select("id_profesor, nombre, foto, sobre_mi, contacto, fortalezas")
    .order("id_profesor")

  if (error) throw error
  return data
}

async function getProfesorById(id) {
  const { data, error } = await supabase
    .from("profesores")
    .select("id_profesor, nombre, foto, sobre_mi, contacto, fortalezas")
    .eq("id_profesor", id)
    .maybeSingle()

  if (error) throw error
  return data
}

function serveStatic(response, requestPath) {
  const requestedPath = requestPath === "/" ? "/index.html" : requestPath
  const filePath = path.join(publicRoot, requestedPath)

  if (!filePath.startsWith(publicRoot) || !fs.existsSync(filePath)) {
    sendJson(response, 404, { error: "Recurso no encontrado" })
    return
  }

  const contentType = requestedPath.endsWith(".html") ? "text/html; charset=utf-8" : "application/octet-stream"
  response.writeHead(200, { "Content-Type": contentType })
  fs.createReadStream(filePath).pipe(response)
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`)
  const segments = requestUrl.pathname.split("/").filter(Boolean)

  if (request.method !== "GET") {
    sendJson(response, 405, { error: "Método no permitido" })
    return
  }

  try {
    if (requestUrl.pathname === "/api/profesores") {
      sendJson(response, 200, await getProfesores())
      return
    }

    if (segments.length === 3 && segments[0] === "api" && segments[1] === "profesores") {
      const id = Number(segments[2])

      if (!Number.isInteger(id) || id <= 0) {
        sendJson(response, 400, { error: "El id debe ser un número entero positivo" })
        return
      }

      const profesor = await getProfesorById(id)

      if (!profesor) {
        sendJson(response, 404, { error: "Profesor no encontrado" })
        return
      }

      sendJson(response, 200, profesor)
      return
    }

    serveStatic(response, requestUrl.pathname)
  } catch (error) {
    console.error("[v0] Error consultando Supabase:", error.message)
    sendJson(response, 500, { error: "No se pudieron obtener los profesores" })
  }
})

server.listen(PORT, () => {
  console.log(`Servidor Node ejecutándose en http://localhost:${PORT}`)
})
