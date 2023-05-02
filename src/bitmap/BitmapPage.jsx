import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'

import DragBox from './components/DragBox'
import Canvas from './components/Canvas'
import CodeArea from './components/CodeArea'
import BrushArea from './components/BrushArea'
import ZCorrecter from './components/ZCorrecter'
import PaletteArea from './components/PaletteArea'
import AppContext from '../context/App'
import BitmapUIContext, { BitmapUIProvider } from '../context/BitmapUI'

const PaletteBoxWrapper = styled.div`
  max-width: 300px;
`

const BitmapPageWrapper = styled.section`
  height: calc(100vh - 32px);
  position: relative;
  overflow: hidden;
`

const BitmapPage = () => {
  const { paletteStore, bitmapStore, dispatch } = useContext(AppContext)
  const { boxes, dispatch: dispatchUI } = useContext(BitmapUIContext)
  const color = paletteStore.palette[bitmapStore.currentColor]

  const pushData = useCallback(
    (data) => dispatch({ type: 'pushData', payload: data }),
    []
  )

  const setCode = useCallback(
    ({ target: { value } }) => dispatch({ type: 'setCode', payload: value }),
    []
  )

  const { brush } = boxes

  return (
    <BitmapUIProvider>
      <BitmapPageWrapper>
        <ZCorrecter>
          <DragBox header="Brush" id="brush" dispatch={dispatchUI} {...brush}>
            <BrushArea />
          </DragBox>
          <DragBox
            header="Palette"
            id="palette"
            dispatch={dispatchUI}
            startPosition={{ x: 10, y: 10 }}
          >
            <PaletteBoxWrapper>
              <PaletteArea />
            </PaletteBoxWrapper>
          </DragBox>
          <DragBox
            header="Code"
            id="code"
            dispatch={dispatchUI}
            startPosition={{ x: 20, y: 20 }}
          >
            <CodeArea
              onChange={setCode}
              value={bitmapStore.code}
              onGenerate={pushData}
              palette={paletteStore.palette}
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
    </BitmapUIProvider>
  )
}

export default BitmapPage
