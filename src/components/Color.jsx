import React from 'react'
import styled from 'styled-components'

const ColorWrapper = styled.div`
  width: ${ props => props.small ? '100px' : '200px' };
  height: ${ props => props.small ? '100px' : '200px' };
`

const ColorBlock = styled.div`
  width: ${ props => props.small ? '100px' : '200px' };
  height: ${ props => props.small ? '100px' : '200px' };

  ${props => props.edited && `
    position: relative;
    z-index: 100;
    border: 2px solid;
    transform: translate(-2px, -2px);
  `}
`

const Color = ({ hex, edited, onClick, small }) => (
  <ColorWrapper small={small}>
    <ColorBlock onClick={onClick} edited={edited} style={{backgroundColor: `#${hex}`}} small={small} />
  </ColorWrapper>
)

Color.defaultProps = {
  small: false,
  edited: false
}

export default Color
