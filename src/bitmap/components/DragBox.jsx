import React, { useCallback, useState, useRef } from 'react'
import useDragger from '../hooks/useDragger'
import styled from 'styled-components'

const DragBoxWrapper = styled.section`
  position: absolute;
  text-align: left;
  pointer-events: none;
  ${({ isZHigh }) => `
    z-index: ${isZHigh ? 1001 : 1000};
  `}

  ${({ x, y }) =>
    x !== undefined &&
    y !== undefined &&
    `
    top: ${typeof y === 'string' ? y : `${y}px`};
    left: ${typeof x === 'string' ? x : `${x}px`};
  `}
`

const DragBoxTopBar = styled.header`
  border-bottom: 1px solid;
  display: inline-flex;
  justify-content: flex-start;
  align-items: baseline;
  align-content: flex-start;
  background: white;
  cursor: grab;
`

const Button = styled.button.attrs({ type: 'button' })`
  border: 0;
  appearance: none;
  font-size: 1.6rem;
  font-family: monospace;
  pointer-events: all;
`

const BoxHeader = styled.h1`
  margin: 0;
  padding: 0 10px 0 5px;
  line-height: 1;
  user-select: none;
  pointer-events: all;
`

const DragBoxContentWrapper = styled.div`
  overflow: hidden;
  ${({ isMinimised }) => isMinimised && `height: 0;`}
`

const DragBoxContent = styled.div`
  padding: 10px;
  background: white;
  pointer-events: all;
  border: 1px solid;
`

const DragBox = ({
  children,
  onClick,
  isZHigh,
  header,
  startPosition = { x: 0, y: 0 },
}) => {
  const containerRef = useRef()
  const [isMinimised, setMinimised] = useState(false)
  const { position, startDragHandle } = useDragger(containerRef, startPosition)

  const minimiseHandle = useCallback(
    (e) => {
      e.stopPropagation()
      setMinimised(!isMinimised)
    },
    [isMinimised]
  )

  return (
    <DragBoxWrapper
      ref={containerRef}
      isZHigh={isZHigh}
      onClick={onClick}
      {...position}
    >
      <DragBoxTopBar onMouseDown={startDragHandle}>
        <Button aria-label="minimise" onClick={minimiseHandle}>
          {isMinimised ? '+' : '-'}
        </Button>
        <BoxHeader>{header}</BoxHeader>
      </DragBoxTopBar>
      <DragBoxContentWrapper isMinimised={isMinimised}>
        <DragBoxContent>{children}</DragBoxContent>
      </DragBoxContentWrapper>
    </DragBoxWrapper>
  )
}

export default DragBox
