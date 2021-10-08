function applyGradient(palette, selected, steps) {
  steps = parseInt(steps, 10)
  selected = selected.sort()

  const stepFactor = 1 / (steps - 1)

  let [color1, color2] = selected
  let final = []

  const { r: r1, g: g1, b: b1 } = palette[color1]
  const { r: r2, g: g2, b: b2 } = palette[color2]

  color1 = [r1, g1, b1]
  color2 = [r2, g2, b2]

  for (let i = 0; i < steps; i++) {
    const factor = stepFactor * i
    const result = color1.slice()

    for (let color = 0; color < 3; color++) {
      result[color] = Math.round(
        result[color] + factor * (color2[color] - color1[color])
      )
    }

    final.push(result)
  }

  const palToInject = final.map(([r, g, b]) => {
    return { r, g, b, hex: convertRGBToHex({ r, g, b }) }
  })

  const palStart = selected[0] === 0 ? [] : palette.slice(0, selected[0])
  const palEnd =
    selected[1] === palette.length - 1 ? [] : palette.slice(selected[1] + 1)

  return [...palStart, ...palToInject, ...palEnd]
}

function convertRGB24toRGB15({ r, g, b }) {
  const f = 31 / 255

  r = Math.floor(r * f)
  g = Math.floor(g * f)
  b = Math.floor(b * f)

  return { r, g, b }
}

function convertRGB15toRGB24({ r, g, b }) {
  const f = 255 / 31

  r = Math.floor(r * f)
  g = Math.floor(g * f)
  b = Math.floor(b * f)

  return { r, g, b }
}

function convertRGBToHex(color) {
  let { r, g, b } = convertRGB15toRGB24(color)

  r = r < 10 ? `0${r}` : r
  g = g < 10 ? `0${g}` : g
  b = b < 10 ? `0${b}` : b

  r = r.toString(16)
  g = g.toString(16)
  b = b.toString(16)

  return `${r}${g}${b}`
}

export {
  convertRGBToHex,
  convertRGB15toRGB24,
  convertRGB24toRGB15,
  applyGradient,
}
