import React, { useContext, useCallback } from 'react'

import AppContext from '../../context/App'
import Color from '../../components/Color'
import Slider from '../../components/Slider'

const BrushArea = () => {
  const { bitmapStore, dispatch } = useContext(AppContext)
  const { color, size } = bitmapStore

  const setSize = useCallback(
    (value) => dispatch({ type: 'setSize', payload: +value }),
    []
  )

  return (
    <>
      <Color {...color} />
      <Slider
        label="Size"
        onChange={({ target: { value } }) => setSize(value)}
        value={size}
      />
    </>
  )
}

export default BrushArea
