import React, { useReducer, useState, useCallback } from 'react'
import styled from 'styled-components'
import { createGlobalStyle } from 'styled-components'

import { KeyboardProvider } from './context/Keyboard'
import { ModalProvider } from './context/Modal'

import Slider from './components/Slider'
import Color from './components/Color'
import Palette from './components/Palette'
import ResetButton from './components/ResetButton'
import SaveButton from './components/SaveButton'
import LoadButton from './components/LoadButton'
import ExportButton from './components/ExportButton'
import ImportButton from './components/ImportButton'

import GradientTool from './components/GradientTool'
import LuminosityTool from './components/LuminosityTool'

import { convertRGBToHex } from './helpers'

const initialState = {r: 0, g: 0, b: 0, hex: "000000", palette: [], selected: [], gradientSteps: 1};

function reducer(state, action) {
  switch (action.type) {
    case 'changeColor': {
      const { color, value } = action.payload
      const { r, g, b } = state
      const parsedValue = parseInt(value, 10);

      return {...state, [color]: parsedValue, hex: convertRGBToHex({r, g, b, [color]: parsedValue})};
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
    case 'changePalette': {
      return { ...state, palette: action.payload }
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
  display: flex;
  justify-content: center;
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
    line-height: 1.2;
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
  const changePalette = useCallback(newPalette => dispatch({type: 'changePalette', payload: newPalette }))

  const { r, g, b, palette, hex, selected } = state;

  return (
    <KeyboardProvider>
      <GlobalStyle />
      <ModalProvider>
        <AppWrapper>
          <PaletteToolsSection>
            <ResetButton onReset={() => changePalette([])} />
            <SaveButton palette={palette} />
            <LoadButton onLoadSubmit={changePalette} />
            <ExportButton palette={palette} />
            <ImportButton onImportSubmit={changePalette} />
          </PaletteToolsSection>
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
            <GradientTool palette={palette} onGradientSubmit={changePalette} />
            <LuminosityTool palette={palette} onLuminositySubmit={changePalette} />
          </PaletteToolsSection>
          <Palette palette={palette} selected={selected} onPick={pickColor} onDelete={deleteColor} onSwap={swapColor} />
        </AppWrapper>
      </ModalProvider>
    </KeyboardProvider>
  )
}

export default App

