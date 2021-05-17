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

  &:active {
    transform: translateY(1px);
  }

  svg {
    width: 1em;
    height: 1em;
    margin: 0 10px 0 0;
  }

  ${({small}) => small && `font-size: 1rem; padding: 4px 8px;`}
`

const PrimaryButton = styled(Button)``
const SecondaryButton = styled(Button)``

export {
  PrimaryButton, 
  SecondaryButton
}

