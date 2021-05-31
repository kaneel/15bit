import styled from 'styled-components'

const Button = styled.button`
  apperance: none;
  border: 1px solid;
  background: none;
  padding: 6px 16px;
  margin: 0 8px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:active {
    transform: translateY(1px);
  }

  svg {
    width: 1em;
    height: 1em;
    margin: 0 10px 0 0;
  }

  ${props => props.small && `font-size: 1rem; padding: 4px 8px;`}
  ${props => props.active && `background: #eee`}

`

const PrimaryButton = styled(Button)``
const SecondaryButton = styled(Button)``

const ButtonGroup = styled.div`
  display: flex; 
  justify-content: center;
  margin-left: 1px;

  ${Button} {
    margin: -1px 0 0 -1px;
    position: relative;
  }
`

export {
  PrimaryButton, 
  SecondaryButton,
  ButtonGroup
}

