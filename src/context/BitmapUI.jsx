import React, { useReducer, createContext } from 'react'

const initialBitmapUIState = {
  boxes: {},
}

const BitmapUIContext = createContext({ ...initialBitmapUIState })

function reducer(state, action) {
  switch (action.type) {
    case 'onBoxPositionChange':
      const { id, position } = action.payload

      return {
        ...state,
        boxes: {
          ...state.boxes,
          [id]: { position },
        },
      }
    default:
      return state
  }
}

const BitmapUIProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialBitmapUIState)

  return (
    <BitmapUIContext.Provider value={{ ...state, dispatch }}>
      {children}
    </BitmapUIContext.Provider>
  )
}

export default BitmapUIContext
export { BitmapUIProvider }
