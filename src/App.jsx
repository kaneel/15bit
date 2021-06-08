import React  from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import { KeyboardProvider } from './context/Keyboard'
import { ModalProvider } from './context/Modal'

import PalettePage from './palette/PalettePage'

const GlobalStyle = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
    font-family: Helvetica;
    line-height: 1.2;
  }
`

const AppWrapper = styled.div`
  max-width: 1200px;
  text-align: center;
  margin: 0 auto;
`

const App = () => {
  return (
    <KeyboardProvider>
      <GlobalStyle />
      <ModalProvider>
        <AppWrapper>
          <PalettePage />
        </AppWrapper>
      </ModalProvider>
    </KeyboardProvider>
  )
}

export default App

