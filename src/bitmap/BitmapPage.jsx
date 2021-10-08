import React, { useContext, useCallback } from 'react'

import Color from '../components/Color'
import Slider from '../components/Slider'
import Canvas from './components/Canvas'
import CodeArea from './components/CodeArea'
import { MicroPalette } from '../palette/components/Palette'
import AppContext from '../context/App'

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
    <>
      <>
        <Color {...color} />
        <MicroPalette
          onClick={changeCurrentColor}
          palette={paletteStore.palette}
        />
        <Slider
          label="Size"
          onChange={({ target: { value } }) => setSize(value)}
          value={bitmapStore.size}
        />
      </>
      <>
        <Canvas
          disabled={!color}
          color={color}
          size={bitmapStore.size}
          data={bitmapStore.data}
          onPaint={pushData}
        />
        <CodeArea
          onChange={setCode}
          value={bitmapStore.code}
          onGenerate={pushData}
        />
      </>
    </>
  )
}

export default BitmapPage
