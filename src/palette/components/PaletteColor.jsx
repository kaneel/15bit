import React from 'react'
import styled from 'styled-components'

import Color, { ColorBlock } from '../../components/Color'

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 200px;
  z-index: 302;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const PaletteColorWrapper = styled.div`
  position: relative;
  width: 100px;
  height: 100px;

  ${ColorBlock} {
    position: absolute;
    top: 0;
    left: 0;
  }

  ${props => props.selected && `
    width: 200px;
    height: 200px;

    ${ColorBlock} {
      width: 200px;
      height: 200px;
      z-index: 301;
      border: 4px solid;
      transform: translate(-4px, -4px);

      &:hover {
        z-index: 301;
        border: 4px solid;
        transform: translate(-4px, -4px);
      }
    }
  `}
`

const PaletteColor = ({children, selected, onClick, ...props}) => {
  return (
    <PaletteColorWrapper selected={selected} onClick={onClick}>
      { children && <Overlay>{children}</Overlay> }
      <Color small {...props} />
    </PaletteColorWrapper>
  )
}

export default PaletteColor
export { PaletteColorWrapper }
