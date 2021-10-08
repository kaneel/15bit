import React from 'react'
import styled from 'styled-components'

const ColorBlock = styled.div`
  width: ${(props) => (props.small ? '100px' : '200px')};
  height: ${(props) => (props.small ? '100px' : '200px')};
  position: relative;
`

const Color = ({ hex, selected, onClick, small }) => (
  <ColorBlock
    onClick={onClick}
    selected={selected}
    style={{ backgroundColor: `#${hex}` }}
    small={small}
  />
)

Color.defaultProps = {
  small: false,
}

export default Color
export { ColorBlock }
