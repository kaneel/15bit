import React, { useReducer, useCallback } from 'react'
import styled from 'styled-components'

import Slider from './components/Slider'
import Color from './components/Color'
import Palette from './components/Palette'
import ExportButton from './components/ExportButton'

const initialState = {r: 0, g: 0, b: 0, hex: "000000", palette: [], edit: -1};

function convert({r, g, b}) {
  const f = 255 / 31

  r = parseInt(r, 10);
  g = parseInt(g, 10);
  b = parseInt(b, 10);

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

      return {...state, [color]: value, hex: convert({r, g, b, [color]: value})};
    }
    case 'editColor': {
      const { palette } = state;
      const color = palette[action.payload]
      console.log(action)

      return { ...state, ...color, edit: action.payload }
    }
    case 'deleteColor': {
      const { palette } = state;

      return { ...state, palette: palette.filter((_, i) => i !== action.payload ) }
    }
    case 'addColor': {
      const { r, g, b, hex, edit } = state
      let { palette } = state

      palette = [...palette, {r, g, b, hex}]

      return {
        ...state,
        palette,
        edit: -1
      }
    }
    case 'replaceColor': {
      const { r, g, b, hex, edit } = state
      let { palette } = state

      palette = palette.map((currColor, i) => {
        if (i === edit) return { r, g, b, hex }
        else return currColor
      }) 

      return {
        ...state,
        palette,
        edit: -1
      }
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
`

const ColorPickSection = styled.section`
  display: flex;
  margin: 2em 0;
  justify-content: center;
  align-items: center;
  
  > div {
    margin: 0 1em;
  }
`

const Button = styled.button`
`

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const changeR = useCallback(({target: {value}}) => dispatch(changeColor({color: 'r', value})))
  const changeG = useCallback(({target: {value}}) => dispatch(changeColor({color: 'g', value})))
  const changeB = useCallback(({target: {value}}) => dispatch(changeColor({color: 'b', value})))
  const addColor = useCallback(() => dispatch({type: 'addColor'}))
  const replaceColor = useCallback(() => dispatch({type: 'replaceColor'}))
  const deleteColor = useCallback((index) => dispatch({type: 'deleteColor', payload: index}))
  const editColor = useCallback((index) => dispatch({type: 'editColor', payload: index}))

  const { r, g, b, palette, hex, edit } = state;

  return (
    <AppWrapper>
      <ColorPickSection>
        <div>
          <Slider label="Red" name="R" value={r} onChange={changeR} />
          <Slider label="Green" name="G" value={g} onChange={changeG} />
          <Slider label="Blue" name="B" value={b} onChange={changeB} />
        </div>
        <div>
          <Color hex={hex} />
          <Button onClick={addColor}>Add</Button> 
          { edit > -1 && <Button onClick={replaceColor}>Replace</Button> }
        </div>
      </ColorPickSection>
      <Palette palette={palette} edit={edit} onDelete={deleteColor} onEdit={editColor} />
      { palette.length > 0 && <ExportButton palette={palette}>Export</ExportButton> }
    </AppWrapper>
  )
}

export default App

