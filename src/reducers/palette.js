import { convertRGBToHex } from '../helpers'

function palStoreReducer(state, action) {
  switch (action.type) {
    case 'changeColor': {
      const { color, value } = action.payload
      const { r, g, b } = state
      const parsedValue = parseInt(value, 10)

      return {
        ...state,
        [color]: parsedValue,
        hex: convertRGBToHex({ r, g, b, [color]: parsedValue }),
      }
    }
    case 'swapColor': {
      const { palette, r, g, b, hex } = state
      const index = action.payload
      const newPalette = [...palette]

      newPalette[index] = { r, g, b, hex }

      return { ...state, palette: newPalette }
    }
    case 'pickColor': {
      const { palette } = state
      const index = action.payload
      const color = palette[index]

      return { ...state, ...color }
    }
    case 'selectColor': {
      const { palette, selected } = state
      const { index, modifiers } = action.payload
      const color = palette[index]

      const newSelected = modifiers.includes('Meta')
        ? [...selected, index]
        : modifiers.includes('Shift')
        ? (function (array, end) {
            const last = array.pop()
            const newArr = new Array(
              end > last ? end - last + 1 : last - end + 1
            )
              .fill(0)
              .map((_, i) => {
                return end > last ? last + i : last - i
              })

            return [...array, ...newArr]
          })([...selected], index)
        : [index]

      return { ...state, ...color, selected: newSelected }
    }
    case 'deleteColor': {
      const { palette } = state

      return {
        ...state,
        palette: palette.filter((_, i) => i !== action.payload),
      }
    }
    case 'addColor': {
      const { r, g, b, hex } = state
      let { palette } = state

      palette = [...palette, { r, g, b, hex }]

      return {
        ...state,
        palette,
        selected: [],
      }
    }
    case 'changePalette': {
      return { ...state, palette: action.payload }
    }
    default:
      return state
  }
}

export default palStoreReducer
