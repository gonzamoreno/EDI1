try {
  require("dotenv").config({ path: ".env.development.local" })
} catch (error) {
  // dotenv es opcional para servir contenido estático
}

const http = require("node:http")
const fs = require("node:fs")
const path = require("node:path")
let getProfesores, getProfesorById, getTrayectoriaAcademica, getTrayectoriaDocente, getRecursos, getCapacitaciones, getReflexiones, getPlanificaciones
try {
  getProfesores = require("./api/profesores")
  getProfesorById = require("./api/profesores/[id]")
  getTrayectoriaAcademica = require("./api/trayectoria-academica")
  getTrayectoriaDocente = require("./api/trayectoria-docente")
  getRecursos = require("./api/recursos")
  getCapacitaciones = require("./api/capacitaciones")
  getReflexiones = require("./api/reflexiones")
  getPlanificaciones = require("./api/planificaciones")
} catch (loadError) {
  console.warn("Aviso: Módulos de API pendientes de instalación de dependencias ('npm install'):", loadError.message)
}

const PORT = Number(process.env.PORT) || 8000
const publicRoot = __dirname

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  })
  response.end(JSON.stringify(payload))
}

function createApiResponse(response) {
  return {
    setHeader(name, value) {
      response.setHeader(name, value)
    },
    status(statusCode) {
      response.statusCode = statusCode
      return this
    },
    json(payload) {
      response.setHeader("Content-Type", "application/json; charset=utf-8")
      response.end(JSON.stringify(payload))
      return this
    },
  }
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
}

function serveStatic(response, requestPath) {
  const requestedPath = requestPath === "/" ? "/index.html" : requestPath
  let filePath = path.join(publicRoot, requestedPath)

  const isDirectFile = filePath.startsWith(publicRoot) && fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()
  if (!isDirectFile) {
    const fallbackPath = path.join(publicRoot, "public", requestedPath)
    if (fallbackPath.startsWith(publicRoot) && fs.existsSync(fallbackPath) && !fs.statSync(fallbackPath).isDirectory()) {
      filePath = fallbackPath
    } else {
      sendJson(response, 404, { error: "Recurso no encontrado" })
      return
    }
  }

  const ext = path.extname(filePath).toLowerCase()
  const contentType = MIME_TYPES[ext] || "application/octet-stream"
  response.writeHead(200, { "Content-Type": contentType })
  fs.createReadStream(filePath).pipe(response)
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`)
  const segments = requestUrl.pathname.split("/").filter(Boolean)

  try {
    if (requestUrl.pathname === "/api/profesores") {
      await getProfesores(request, createApiResponse(response))
      return
    }

    if (requestUrl.pathname === "/api/trayectoria-academica") {
      await getTrayectoriaAcademica(
        { method: request.method, query: { id_profesor: requestUrl.searchParams.get("id_profesor") } },
        createApiResponse(response),
      )
      return
    }

    if (requestUrl.pathname === "/api/trayectoria-docente") {
      await getTrayectoriaDocente(
        { method: request.method, query: { id_profesor: requestUrl.searchParams.get("id_profesor") } },
        createApiResponse(response),
      )
      return
    }

    if (requestUrl.pathname === "/api/recursos") {
      await getRecursos(
        { method: request.method, query: { id_profesor: requestUrl.searchParams.get("id_profesor") } },
        createApiResponse(response),
      )
      return
    }

    if (requestUrl.pathname === "/api/capacitaciones") {
      await getCapacitaciones(
        { method: request.method, query: { id_profesor: requestUrl.searchParams.get("id_profesor") } },
        createApiResponse(response),
      )
      return
    }

    if (requestUrl.pathname === "/api/reflexiones") {
      await getReflexiones(
        { method: request.method, query: { id_profesor: requestUrl.searchParams.get("id_profesor") } },
        createApiResponse(response),
      )
      return
    }

    if (requestUrl.pathname === "/api/planificaciones") {
      await getPlanificaciones(
        { method: request.method, query: { id_profesor: requestUrl.searchParams.get("id_profesor") } },
        createApiResponse(response),
      )
      return
    }

    if (segments.length === 3 && segments[0] === "api" && segments[1] === "profesores") {
      await getProfesorById(
        { method: request.method, query: { id: segments[2] } },
        createApiResponse(response),
      )
      return
    }
  } catch (error) {
    console.error("Error ejecutando un endpoint de la API:", error.message)
    if (!response.headersSent) {
      sendJson(response, 500, { error: "No se pudo completar la solicitud" })
    }
    return
  }

  if (request.method !== "GET") {
    sendJson(response, 405, { error: "Método no permitido" })
    return
  }

  serveStatic(response, requestUrl.pathname)
})

server.listen(PORT, () => {
  console.log(`Servidor Node ejecutándose en http://localhost:${PORT}`)
})
