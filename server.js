const http = require("node:http")
const fs = require("node:fs")
const path = require("node:path")

const PORT = Number(process.env.PORT) || 8000
const publicRoot = __dirname

const profesores = [
  {
    id: 1,
    nombre: "Ana",
    apellido: "Gómez",
    email: "ana.gomez@example.com",
    especialidad: "Didáctica de la Matemática",
  },
  {
    id: 2,
    nombre: "Carlos",
    apellido: "Pérez",
    email: "carlos.perez@example.com",
    especialidad: "Ciencias Naturales",
  },
  {
    id: 3,
    nombre: "Lucía",
    apellido: "Fernández",
    email: "lucia.fernandez@example.com",
    especialidad: "Lengua y Literatura",
  },
]

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  })
  response.end(JSON.stringify(payload))
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

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`)
  const segments = requestUrl.pathname.split("/").filter(Boolean)

  if (request.method !== "GET") {
    sendJson(response, 405, { error: "Método no permitido" })
    return
  }

  if (requestUrl.pathname === "/api/profesores") {
    sendJson(response, 200, profesores)
    return
  }

  if (segments.length === 3 && segments[0] === "api" && segments[1] === "profesores") {
    const id = Number(segments[2])
    const profesor = profesores.find((item) => item.id === id)

    if (!profesor) {
      sendJson(response, 404, { error: "Profesor no encontrado" })
      return
    }

    sendJson(response, 200, profesor)
    return
  }

  serveStatic(response, requestUrl.pathname)
})

server.listen(PORT, () => {
  console.log(`Servidor Node ejecutándose en http://localhost:${PORT}`)
})
