import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'

import { MicroPalette } from '../../palette/components/Palette'
import AppContext from '../../context/App'
import LoadButton from '../../palette/components/LoadButton'
import ImportButton from '../../palette/components/ImportButton'

const PaletteTools = styled.footer`
  margin: 1em 0 0;
  display: flex;
`

const PaletteArea = () => {
  const { paletteStore, dispatch } = useContext(AppContext)
  const { palette } = paletteStore

  const changeCurrentColor = useCallback((index) =>
    dispatch({
      type: 'changeCurrentColor',
      payload: index,
    })
  )

  // tool actions
  const changePalette = useCallback((newPalette) =>
    dispatch({ type: 'changePalette', payload: newPalette })
  )

  return (
    <>
      {palette.length === 0 ? (
        <p>No palette!</p>
      ) : (
        <MicroPalette
          onClick={changeCurrentColor}
          palette={paletteStore.palette}
        />
      )}
      <PaletteTools>
        <LoadButton onLoadSubmit={changePalette} />
        <ImportButton onImportSubmit={changePalette} />
      </PaletteTools>
    </>
  )
}

export default PaletteArea
