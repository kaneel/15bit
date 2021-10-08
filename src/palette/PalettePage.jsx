import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'

import AppContext from '../context/App'
import Slider from '../components/Slider'
import Color from '../components/Color'
import Palette from './components/Palette'
import ResetButton from './components/ResetButton'
import SaveButton from './components/SaveButton'
import LoadButton from './components/LoadButton'
import ExportButton from './components/ExportButton'
import ImportButton from './components/ImportButton'

import GradientTool from './components/GradientTool'
import LuminosityTool from './components/LuminosityTool'

const changeColor = (payload) => ({
  type: 'changeColor',
  payload,
})

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

const PalettePage = () => {
  const { paletteStore, dispatch } = useContext(AppContext)

  // colour actions
  const changeR = useCallback(({ target: { value } }) =>
    dispatch(changeColor({ color: 'r', value }))
  )
  const changeG = useCallback(({ target: { value } }) =>
    dispatch(changeColor({ color: 'g', value }))
  )
  const changeB = useCallback(({ target: { value } }) =>
    dispatch(changeColor({ color: 'b', value }))
  )
  const addColor = useCallback(() => dispatch({ type: 'addColor' }))
  // palette grid actions
  const deleteColor = useCallback((index) =>
    dispatch({ type: 'deleteColor', payload: index })
  )
  const pickColor = useCallback((index) =>
    dispatch({ type: 'pickColor', payload: index })
  )
  const swapColor = useCallback((index) =>
    dispatch({ type: 'swapColor', payload: index })
  )

  // tool actions
  const changePalette = useCallback((newPalette) =>
    dispatch({ type: 'changePalette', payload: newPalette })
  )

  const { r, g, b, palette, hex, selected } = paletteStore

  return (
    <>
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
            <AddColorButton
              style={{ borderColor: `#${hex}` }}
              onClick={addColor}
            >
              Add
            </AddColorButton>
          </div>
        </div>
      </ColorPickSection>
      <PaletteToolsSection>
        <GradientTool palette={palette} onGradientSubmit={changePalette} />
        <LuminosityTool palette={palette} onLuminositySubmit={changePalette} />
      </PaletteToolsSection>
      <Palette
        palette={palette}
        selected={selected}
        onPick={pickColor}
        onDelete={deleteColor}
        onSwap={swapColor}
      />
    </>
  )
}

export default PalettePage
