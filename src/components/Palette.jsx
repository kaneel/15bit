import React from 'react'
import styled from 'styled-components'

import Color from './Color'

const PaletteWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin: 0 0 2em;
  padding: 0;
  list-style: none;
`

const DeleteButton = styled.button`
  apperance: none;
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  background: #fff;
  border: 0;
  z-index: 2;
`

const ColorItem = styled.li`
  position: relative;
  cursor: pointer;
  cursor: ;

  &:hover ${DeleteButton} {
    display: block;
  }
`

const Palette = ({palette, onDelete, onEdit, edit}) => (
  <PaletteWrapper>
    { palette.map(({hex}, i) => (
      <ColorItem key={i}>
        <DeleteButton onClick={() => onDelete(i)}>X</DeleteButton>
        <Color onClick={() => onEdit(i)} small edited={edit === i} hex={hex} />
      </ColorItem>
    )) }
  </PaletteWrapper>
)

export default Palette

