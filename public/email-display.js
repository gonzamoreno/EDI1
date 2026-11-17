function formatearDireccionesCorreo(texto) {
  return texto.replace(
    /([A-Z0-9._%+-]+)@([A-Z0-9.-]+\.[A-Z]{2,})/gi,
    "$1[arroba]$2",
  )
}
