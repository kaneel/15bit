import styled from 'styled-components'

const Button = styled.button`
  apperance: none;
  border: 1px solid;
  background: none;
  padding: 6px 16px;
  margin: 0 8px;
  font-size: 1.5rem;

  &:active {
    transform: translateY(1px);
  }

  ${({small}) => small && `font-size: 1rem; padding: 4px 8px;`}
`

const PrimaryButton = styled(Button)``
const SecondaryButton = styled(Button)``

export {
  PrimaryButton, 
  SecondaryButton
}

