import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import { KeyboardProvider } from './context/Keyboard'
import { ModalProvider } from './context/Modal'
import { PageProvider } from './context/Page'
import { AppProvider } from './context/App'

import PalettePage from './palette/PalettePage'
import BitmapPage from './bitmap/BitmapPage'

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
  const pages = [
    { title: 'PALETTE', Component: PalettePage },
    { title: 'BITMAP', Component: BitmapPage },
  ]

  return (
    <AppProvider>
      <KeyboardProvider>
        <GlobalStyle />
        <ModalProvider>
          <AppWrapper>
            <PageProvider pages={pages} />
          </AppWrapper>
        </ModalProvider>
      </KeyboardProvider>
    </AppProvider>
  )
}

export default App
