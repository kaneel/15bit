import React, { useState } from 'react'
import styled from 'styled-components'

import PaletteColor, { PaletteColorWrapper } from './PaletteColor'
import Color, { ColorBlock } from './Color'

const PaletteWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: 0 auto;
  padding: 2px 2px;
  list-style: none;
`

const PaletteButton = styled.button`
  apperance: none;
  background: #fff;
  border: 0;
  z-index: 2;
  margin: 0 2px;
  cursor: pointer;
`

const DeleteButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  apperance: none;
  background: #fff;
  border: 0;
  z-index: 2;
  margin: 0;
  cursor: pointer;
  display: none;
`

const ColorItem = styled.li`
  position: relative;
  cursor: pointer;
  width: 100px;
  height: 100px;

  ${props => props.selected && `
    z-index: 400;
  `}

  &:hover {
    ${DeleteButton} {
      display: block;
    }

    ${PaletteColorWrapper} {
      position: absolute;
      border: 1px solid;
      transform: translate(-1px, -1px);
      z-index: 1;
    }

    ${ColorBlock} {
      position: absolute;
      border: 1px solid;
      transform: translate(-1px, -1px);
      z-index: 1;
    }

    ${props => props.selected && `
      ${PaletteColorWrapper} {
        position: relative;
        border: 0;
        z-index: 1;
        transform: none;

        ${ColorBlock} {
          border: 4px solid;
          transform: translate(-4px, -4px);
        }
      }
    `
  }
`

const SelectorColorItem = styled(ColorItem)`
  &:hover {
    ${ColorBlock} {
      position: absolute;
      border: 1px solid;
      transform: translate(-1px, -1px);
      z-index: 1;
    }
  }

  ${props => props.selected && `
    ${ColorBlock} {
      position: absolute;
      border: 2px solid;
      transform: translate(-2px, -2px);
      z-index: 1;
    }

    &:hover {
      ${ColorBlock} {
        border: 2px solid;
        transform: translate(-2px, -2px);
      }
    }
  `}
`

const PaletteOverlay = styled.div`
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 300;
  background: rgba(255, 255, 255, .9);
  display: flex;
  align-items: center;
  justify-content: center;
`

const PaletteSection = styled.section`
  position: relative;
  margin: 0 auto 2em;
  width: 1004px;
`

const MainPalette = ({palette, onDelete, onSwap, onPick}) => {
  const [selected, changeSelected] = useState(-1);

  return (
    <PaletteSection>
      { selected > -1 && (<PaletteOverlay onClick={() => changeSelected(-1)}/>)}
      <PaletteWrapper>
        { palette.map(({hex}, i) => (
          <ColorItem key={i} selected={i===selected}>
            { selected !== i && <DeleteButton onClick={() => onDelete(i)}>X</DeleteButton>}
            <PaletteColor hex={hex} selected={i===selected} onClick={() => changeSelected(i)}>
              { selected === i && (
                <>
                  <PaletteButton onClick={() => onSwap(i)}>swap</PaletteButton>
                  <PaletteButton onClick={() => onPick(i)}>pick</PaletteButton>
                </>
              ) }
          </PaletteColor>
          </ColorItem>
        )) }
      </PaletteWrapper>
    </PaletteSection>
  )
}

const PaletteSelector = ({palette, selected, onSelect}) => (
  <PaletteSection>
    <PaletteWrapper>
      { palette.map(({hex}, i) => (
        <SelectorColorItem key={i} selected={selected.includes(i)}>
          <Color hex={hex} onClick={() => onSelect(i)} small />
        </SelectorColorItem>
      )) }
    </PaletteWrapper>
  </PaletteSection>
)

export default MainPalette
export { PaletteSelector }

