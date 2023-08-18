export function obtenerSingularPalabra(palabra) {

  const listaStr = palabra.split(' ')

  const newStr = listaStr.map(str => {
    const ultima_letra = str[str.length - 1]
    const dos_utlimas_letras = str.slice(-2)
    const ultima_tres_letra = str.slice(-3)

    if (ultima_letra != 's') return str
    if (verificarPalabrasInvariables(str)) return str
    if (dos_utlimas_letras != 'es') return str.substr(0, str.length - 1)
    if (verificarVocal(str[str.length - 4])) {
      if (ultima_tres_letra[0] == 'n' && str[str.length - 4] == 'o') {
        return str.substr(0, str.length - 4) + 'ón'
      }
      if (ultima_tres_letra[0] == 'c') {
        return str.substr(0, str.length - 3) + 'z'
      }
      return str.substr(0, str.length - 2)
    } else {
      return str.substr(0, str.length - 1)
    }
  })
  return newStr.join(' ')
}

function verificarVocal(letra) {
  const vocales = ["a", 'e', 'i', 'o', 'u']
  return vocales.includes(letra)
}

function verificarPalabrasInvariables(str) {
  const palabras_invariables = [
    "mes",
    "dios",
    "paraguas",
    "gafas",
    "víveres",
    "albricias",
    "esponsales",
    "maitines",
    "andurriales",
    "añicos",
    "pararrayos",
    "exequias",
    "enseres",
    "nupcias",
    "creces",
    "trabalenguas",
    "cascarrabias",
    "viacrucis",
    "saltamontes",
    "sacacorchos",
    "lavacoches",
    "paracaídas",
    "pisapapeles",
    "quitamanchas",
    "alicates",
    "cosquillas",
    "fauces",
    "mondadientes",
    "cortaplumas",
    "abrelatas",
    "limpiabotas",
    "cuelgacapas",
    "parabrisas",
    "parachoques",
    "portaaviones",
    "salvavidas",
    "rompeolas",
    "análisis",
    "crisis",
    "síntesis",
    "fotosíntesis",
    "caries"
  ]
  return palabras_invariables.includes(str)
}
