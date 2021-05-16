import React, { useReducer, useState, useCallback } from 'react'
import { createGlobalStyle } from 'styled-components'

import styled from 'styled-components'

import { KeyboardProvider } from './context/Keyboard'
import { ModalProvider } from './context/Modal'

import Slider from './components/Slider'
import Color from './components/Color'
import Palette from './components/Palette'
import ExportButton from './components/ExportButton'

import GradientTool from './components/GradientTool'

const initialState = {r: 0, g: 0, b: 0, hex: "000000", palette: [], selected: [], gradientSteps: 1};

function convert({r, g, b}) {
  const f = 255 / 31

  const cR = Math.floor(r * f)
  const cG = Math.floor(g * f)
  const cB = Math.floor(b * f)

  r = cR < 10 ? `0${cR}` : cR;
  g = cG < 10 ? `0${cG}` : cG;
  b = cB < 10 ? `0${cB}` : cB;

  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  return `${r}${g}${b}`
}

function reducer(state, action) {
  switch (action.type) {
    case 'changeColor': {
      const { color, value } = action.payload
      const { r, g, b } = state
      const parsedValue = parseInt(value, 10);

      return {...state, [color]: parsedValue, hex: convert({r, g, b, [color]: parsedValue})};
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

      const newSelected = modifiers.includes("Meta") ? [...selected, index ] : 
        modifiers.includes('Shift') ? (function(array, end) {
          const last = array.pop()
          const newArr = new Array(end > last ? end - last + 1 : last - end + 1).fill(0).map((_, i) => {
            return end > last ? last + i : last - i
          })

          return [...array, ...newArr]
        }([...selected], index)) :
        [index]

      return { ...state, ...color, selected: newSelected }
    }
    case 'deleteColor': {
      const { palette } = state;

      return { ...state, palette: palette.filter((_, i) => i !== action.payload ) }
    }
    case 'addColor': {
      const { r, g, b, hex } = state
      let { palette } = state

      palette = [...palette, {r, g, b, hex}]

      return {
        ...state,
        palette,
        selected: []
      }
    }
    case 'makeGradient': {
      const { palette } = state
      let { steps, selected } = action.payload

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
          result[color] = Math.round(result[color] + (factor * (color2[color] - color1[color])))
        }

        final.push(result)
      }

      const palToInject = final.map(([r, g, b]) => {
        return { r, g, b, hex: convert({r, g, b})}
      }) 

      const palStart = selected[0] === 0 ? [] : palette.slice(0, selected[0])
      const palEnd = selected[1] === palette.length - 1 ? [] : palette.slice(selected[1] + 1)

      return {...state, palette: [...palStart, ...palToInject, ...palEnd] }
    }
    default: 
      return state
  }
}

const changeColor = payload => ({ 
  type: 'changeColor', 
  payload
})

const AppWrapper = styled.div`
  max-width: 1200px;
  text-align: center;
  margin: 0 auto;
`

const ColorPickSection = styled.section`
  display: flex;
  margin: 2em 0;
  justify-content: center;
  align-items: flex-start;
  
  > div {
    margin: 0 1em;
  }
`

const PaletteToolsSection = styled.section`
  margin: 2em 0;
`

const AddColorButton = styled.button`
  width: 100%;
  border: solid;
  border-width: 0 4px 2px 4px;
  background: #fff;
  font-size: 20px;
  text-transform: uppercase;
  padding: 0 0 1px;
  cursor: pointer;

  &:active {
    padding: 1px 0 0;
  }
`

const GlobalStyle = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
    font-family: Helvetica;
  }
`

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // colour actions
  const changeR = useCallback(({target: {value}}) => dispatch(changeColor({color: 'r', value})))
  const changeG = useCallback(({target: {value}}) => dispatch(changeColor({color: 'g', value})))
  const changeB = useCallback(({target: {value}}) => dispatch(changeColor({color: 'b', value})))
  const addColor = useCallback(() => dispatch({type: 'addColor'}))
  // palette grid actions
  const deleteColor = useCallback(index => dispatch({type: 'deleteColor', payload: index}))
  const pickColor = useCallback(index => dispatch({type: 'pickColor', payload: index}))
  const swapColor = useCallback((index) => dispatch({type: 'swapColor', payload: index }))

  // tool actions
  const makeGradient = useCallback((selected, steps) => dispatch({type: 'makeGradient', payload: { selected, steps } }))

  const { r, g, b, palette, hex, selected } = state;

  return (
    <KeyboardProvider>
      <GlobalStyle />
      <ModalProvider>
        <AppWrapper>
          <ColorPickSection>
            <div>
              <Slider label="Red" name="R" value={r} onChange={changeR} />
              <Slider label="Green" name="G" value={g} onChange={changeG} />
              <Slider label="Blue" name="B" value={b} onChange={changeB} />
            </div>
            <div>
              <Color hex={hex} />
              <div>
                <AddColorButton style={{borderColor: `#${hex}`}} onClick={addColor}>Add</AddColorButton> 
              </div>
            </div>
          </ColorPickSection>
          <PaletteToolsSection>
            <ExportButton palette={palette}>Export</ExportButton>
            <GradientTool palette={palette} enabled={palette.length > 1} onGradientSubmit={makeGradient} />
          </PaletteToolsSection>
          <Palette palette={palette} selected={selected} onPick={pickColor} onDelete={deleteColor} onSwap={swapColor} />
        </AppWrapper>
      </ModalProvider>
    </KeyboardProvider>
  )
}

export default App

