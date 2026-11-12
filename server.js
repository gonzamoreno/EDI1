require("dotenv").config({ path: ".env.development.local" })

const http = require("node:http")
const fs = require("node:fs")
const path = require("node:path")
const getProfesores = require("./api/profesores")
const getProfesorById = require("./api/profesores/[id]")
const getTrayectoriaAcademica = require("./api/trayectoria-academica")
const getTrayectoriaDocente = require("./api/trayectoria-docente")
const getRecursos = require("./api/recursos")

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
