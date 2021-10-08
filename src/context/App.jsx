import React, { useReducer, createContext } from 'react'

import palStoreReducer from '../reducers/palette'
import bitmapStoreReducer from '../reducers/bitmap'

const initialPalStore = {
  r: 0,
  g: 0,
  b: 0,
  hex: '000000',
  palette: [],
  selected: [],
  gradientSteps: 1,
}
const initialBitmapStore = { currentColor: 0, data: [], size: 1, code: '' }

const initialState = {
  paletteStore: initialPalStore,
  bitmapStore: initialBitmapStore,
}
const AppContext = createContext({ ...initialState })

function reducer(state, action) {
  const paletteStore = palStoreReducer(state.paletteStore, action)
  const bitmapStore = bitmapStoreReducer(state.bitmapStore, action)

  return {
    paletteStore,
    bitmapStore,
  }
}

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext
export { AppProvider }
