import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'

import DragBox from './components/DragBox'
import Color from '../components/Color'
import Slider from '../components/Slider'
import Canvas from './components/Canvas'
import CodeArea from './components/CodeArea'
import ZCorrecter from './components/ZCorrecter'
import { MicroPalette } from '../palette/components/Palette'
import AppContext from '../context/App'

const PaletteBoxWrapper = styled.div`
  max-width: 300px;
`

const BitmapPageWrapper = styled.section`
  height: calc(100vh - 32px);
  overflow: hidden;
`

const BitmapPage = () => {
  const { paletteStore, bitmapStore, dispatch } = useContext(AppContext)
  const color = paletteStore.palette[bitmapStore.currentColor]

  const changeCurrentColor = useCallback((index) =>
    dispatch({
      type: 'changeCurrentColor',
      payload: index,
    })
  )

  const pushData = useCallback(
    (data) => dispatch({ type: 'pushData', payload: data }),
    []
  )
  const setSize = useCallback(
    (value) => dispatch({ type: 'setSize', payload: +value }),
    []
  )
  const setCode = useCallback(
    ({ target: { value } }) => dispatch({ type: 'setCode', payload: value }),
    []
  )

  return (
    <BitmapPageWrapper>
      <ZCorrecter>
        <DragBox header="Brush" startPosition={{ x: 0, y: 0 }}>
          <Color {...color} />
          <Slider
            label="Size"
            onChange={({ target: { value } }) => setSize(value)}
            value={bitmapStore.size}
          />
        </DragBox>
        <DragBox header="Picker" startPosition={{ x: 10, y: 10 }}>
          <PaletteBoxWrapper>
            <MicroPalette
              onClick={changeCurrentColor}
              palette={paletteStore.palette}
            />
          </PaletteBoxWrapper>
        </DragBox>
        <DragBox header="Code" startPosition={{ x: 20, y: 20 }}>
          <CodeArea
            onChange={setCode}
            value={bitmapStore.code}
            onGenerate={pushData}
          />
        </DragBox>
      </ZCorrecter>
      <Canvas
        disabled={!color}
        color={color}
        size={bitmapStore.size}
        data={bitmapStore.data}
        onPaint={pushData}
      />
    </BitmapPageWrapper>
  )
}

export default BitmapPage
