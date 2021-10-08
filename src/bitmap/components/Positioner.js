import React, { useContext, createRef, Component } from 'react'
import styled from 'styled-components'

import KeyboardContext, { KEYS } from '../../context/Keyboard'

const PositionerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const PositionerContainer = styled.div`
  position: absolute;

  > * {
    transform: translate(-50%, -50%);
  }
`

const PositionerOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
`

class Positioner extends Component {
  state = {
    isDragging: false,
    posX: 0,
    posY: 0,
  }

  constructor(props) {
    super(props)

    this.startDragging = this.startDragging.bind(this)
    this.stopDragging = this.stopDragging.bind(this)
    this.handleDragging = this.handleDragging.bind(this)

    this.ref = createRef()

    this.state = {
      ...this.state,
      posX: props.containerDimensions.width / 2,
      posY: props.containerDimensions.height / 2,
    }
  }

  startDragging(e) {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ isDragging: true })
  }

  stopDragging() {
    this.setState({ isDragging: false })

    this.prevClientX = undefined
    this.prevClientY = undefined
  }

  handleDragging(e) {
    const { isDragging, posX, posY } = this.state

    if (!isDragging) return

    const distanceX =
      e.clientX - (isNaN(this.prevClientX) ? e.clientX : this.prevClientX)
    const distanceY =
      e.clientY - (isNaN(this.prevClientY) ? e.clientY : this.prevClientY)

    const newX = posX + distanceX
    const newY = posY + distanceY

    this.prevClientX = e.clientX
    this.prevClientY = e.clientY

    this.setState({ posX: newX, posY: newY })
  }

  render() {
    const { children, keys } = this.props
    const { posX, posY } = this.state

    return (
      <PositionerWrapper>
        {keys.includes(KEYS.SPACE) && (
          <PositionerOverlay
            onMouseDown={this.startDragging}
            onMouseMove={this.handleDragging}
            onMouseUp={this.stopDragging}
          />
        )}
        <PositionerContainer
          ref={this.ref}
          style={{ top: `${posY}px`, left: `${posX}px` }}
        >
          {children}
        </PositionerContainer>
      </PositionerWrapper>
    )
  }
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
