import React, { useContext, useRef } from 'react'
import styled from 'styled-components'

import useDragger from '../hooks/useDragger'
import KeyboardContext, { KEYS } from '../../context/Keyboard'

const PositionerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const PositionerContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;

  > * {
    transform: translate(-50%, -50%);
  }

  ${({ x, y }) =>
    x !== undefined &&
    y !== undefined &&
    `
    top: ${typeof y === 'string' ? y : `${y}px`};
    left: ${typeof x === 'string' ? x : `${x}px`};
  `}
`

const PositionerOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
`

const Positioner = ({ children, keys }) => {
  const containerRef = useRef()
  const { position, startDragHandle } = useDragger(containerRef)

  return (
    <PositionerWrapper>
      {keys.includes(KEYS.SPACE) && (
        <PositionerOverlay onMouseDown={startDragHandle} />
      )}
      <PositionerContainer {...position} ref={containerRef}>
        {children}
      </PositionerContainer>
    </PositionerWrapper>
  )
}

const PositionerWithKeys = ({ children, ...props }) => {
  const { keys } = useContext(KeyboardContext)

  return (
    <Positioner keys={keys} {...props}>
      {children}
    </Positioner>
  )
}

export default PositionerWithKeys
