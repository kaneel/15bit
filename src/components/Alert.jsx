import styled from 'styled-components'

const TYPES = {
  ERROR: 'ERROR',
  WARNING: 'WARNING',
}

const Alert = styled.p`
  border: 1px solid currentColor;
  text-align: left;
  padding: 0.5em;
  border-radius: 5px;

  ${({ type }) => {
    switch (type) {
      case TYPES.ERROR:
        return `color: red;`
      case TYPES.WARNING:
        return `color: orange;`
    }
  }}
`

Alert.TYPES = TYPES

export default Alert
