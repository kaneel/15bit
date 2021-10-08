import React, { useState, useContext, useCallback } from 'react'
import styled from 'styled-components'

import KeyboardContext from '../../context/Keyboard'
import PaletteColor, { PaletteColorWrapper } from './PaletteColor'
import Color, { ColorBlock } from '../../components/Color'

const PaletteWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: 2px 2px;
  padding: 0;
  list-style: none;

  ${(props) => props.withBorder && `border: 1px solid;`}
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

  ${(props) =>
    props.selected &&
    `
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

    ${(props) =>
      props.selected &&
      `
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
    `}
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

  ${(props) =>
    props.selected &&
    `
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
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
`

const PaletteSection = styled.section`
  position: relative;
  margin: 0 auto;
  width: 1006px;
  text-align: left;
`

const PaletteLength = styled.p`
  display: inline-block;
  border: 1px solid;
  margin: 0;
  padding: 0 18px;
  margin: 2px 0 -2px 2px;
  border-bottom: 0;
  line-height: 2.2;
  transform: translateY(1px);
  background: #fff;
`

const ScrollableDiv = styled.div`
  max-height: 400px;
  overflow-y: scroll;
`

const MicroColorItem = styled.li`
  position: relative;
  width: 20px;
  height: 20px;
  margin: 0;

  ${ColorBlock} {
    width: 20px;
    height: 20px;
  }
`

const MainPalette = ({ palette, onDelete, onSwap, onPick }) => {
  const [selected, changeSelected] = useState(-1)

  return (
    <PaletteSection>
      {palette.length > 10 && (
        <PaletteLength>
          Palette length: <strong>{palette.length}</strong>
        </PaletteLength>
      )}
      {selected > -1 && <PaletteOverlay onClick={() => changeSelected(-1)} />}
      <PaletteWrapper withBorder={palette.length > 0}>
        {palette.map(({ hex }, i) => (
          <ColorItem key={i} selected={i === selected}>
            {selected !== i && (
              <DeleteButton onClick={() => onDelete(i)}>X</DeleteButton>
            )}
            <PaletteColor
              hex={hex}
              selected={i === selected}
              onClick={() => changeSelected(i)}
            >
              {selected === i && (
                <>
                  <PaletteButton onClick={() => onSwap(i)}>swap</PaletteButton>
                  <PaletteButton onClick={() => onPick(i)}>pick</PaletteButton>
                </>
              )}
            </PaletteColor>
          </ColorItem>
        ))}
      </PaletteWrapper>
    </PaletteSection>
  )
}

function reducer(state, action) {
  switch (action.type) {
    case 'selectColour': {
      const { palette, selected } = state
      const { index, modifiers } = action.payload
      const color = palette[index]

      if (modifiers.includes('Meta')) {
        if (selected.includes(index)) {
          return { ...state, selected: selected.filter((i) => i !== index) }
        } else {
          return { ...state, selected: [...selected, index] }
        }
      }

      if (modifiers.includes('Shift') && selected.length > 0) {
        const newSelected = (function (array, end) {
          const last = array.pop()
          const newArr = new Array(end > last ? end - last + 1 : last - end + 1)
            .fill(0)
            .map((_, i) => {
              return end > last ? last + i : last - i
            })

          return [...array, ...newArr]
        })([...selected], index)

        return { ...state, selected: newSelected }
      }

      return { ...state, selected: [index] }
    }
    case 'changeLuminosity': {
      return {
        ...state,
        luminosity: action.payload,
      }
    }
  }
}

const PaletteSelector = ({ palette, selected, onSelect, maxSelection }) => {
  const { keys } = useContext(KeyboardContext)

  let newState

  const selectColour = useCallback(
    (index) => {
      const color = palette[index]

      if (keys.includes('Meta')) {
        if (selected.includes(index)) {
          return onSelect(selected.filter((i) => i !== index))
        } else {
          return onSelect([...selected, index])
        }
      }

      if (keys.includes('Shift') && selected.length > 0) {
        return onSelect(
          (function (array, end) {
            const last = array.pop()
            const newArr = new Array(
              end > last ? end - last + 1 : last - end + 1
            )
              .fill(0)
              .map((_, i) => {
                return end > last ? last + i : last - i
              })

            return [...array, ...newArr]
          })([...selected], index)
        )
      }

      onSelect([index])
    },
    [selected, keys]
  )

  return (
    <PaletteSection>
      <ScrollableDiv>
        <PaletteWrapper>
          {palette.map(({ hex }, i) => (
            <SelectorColorItem key={i} selected={selected.includes(i)}>
              <Color hex={hex} onClick={() => selectColour(i)} small />
            </SelectorColorItem>
          ))}
        </PaletteWrapper>
      </ScrollableDiv>
    </PaletteSection>
  )
}

const MicroPalette = ({ palette, onClick = () => {} }) => {
  return (
    <ScrollableDiv>
      <PaletteWrapper>
        {palette.map(({ hex }, i) => (
          <MicroColorItem micro key={i}>
            <Color hex={hex} small onClick={() => onClick(i)} />
          </MicroColorItem>
        ))}
      </PaletteWrapper>
    </ScrollableDiv>
  )
}

export default MainPalette
export { PaletteSelector, MicroPalette }
