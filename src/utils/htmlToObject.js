const TYPES = {
  bold: 'b',
  underline: 'u',
  italic: 'i',
  strike: 'strike',
  link: 'a'
}

function htmlToObject(str) {
  let array = []
  function unirObjetos(text, types) {
    if (types.length == 0) {
      array.push(text)
    } else {
      const obj = { text }
      for (const type of types) {
        if (type == TYPES.bold) obj.bold = true
        else if (type == TYPES.italic) obj.italics = true
        else if (type == TYPES.strike) {
          if (!obj.decoration) obj.decoration = 'lineThrough'
        } else if (type == TYPES.underline) {
          obj.decoration = 'underline'
        }
        else {
          obj.link = type
          obj.decoration = 'underline'
          obj.bold = true
        }
      }
      array.push(obj)
    }
  }
  let texto = '\u2022'
  let tags = []
  for (let i = 0; i < str.length; i++) {
    if (str[i] == '<' && str[i + 1] == '/') {
      if (texto != '') unirObjetos(texto, tags)
      texto = ''
      tags.pop()
      while (str[i] != '>') {
        i++
      }
    } else if (str[i] == '<') {
      if (texto != '') unirObjetos(texto, tags)
      let tag = ''
      texto = ''
      i++
      while (str[i] != '>') {
        tag += str[i]
        i++
        if (tag == 'a') {
          let link = ''
          let hrefText = ''
          while (str[i] != '>') {
            if (str[i] == ' ') i++
            if (hrefText != 'href="') hrefText += str[i]
            else if (str[i] != "\"") link += str[i]
            i++
          }
          tags.push(link)
        }
      }
      if (tag == 'br' || tag == 'div') texto = '\n'
      if (tag == 'b') tags.push(TYPES.bold)
      if (tag == 'u') tags.push(TYPES.underline)
      if (tag == 'i') tags.push(TYPES.italic)
      if (tag == 'strike') tags.push(TYPES.strike)
    } else {
      texto += str[i]
    }

  }
  if (texto != '') unirObjetos(texto, tags)
  return array
}

export default htmlToObject
