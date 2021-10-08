import React, { useState, useCallback, createContext } from 'react'
import styled from 'styled-components'

const PageButton = styled.button`
  appearance: none;
  border: none;
  background: none;
  padding: 0 20px;
  line-height: 100%;
  color: #fff;
  cursor: pointer;

  &:hover {
    transform: scale(1.2);
  }
`

const FixedNav = styled.nav`
  position: sticky;
  top: 0;
  padding: 5px 0;
  background: black;
  z-index: 10000;
`

const initialState = { current: 0, pages: [] }
const PageContext = createContext({ ...initialState })
const PageWrapper = styled.div`
  position: relative;
`

const withPageWrapper = (Page) => {
  const Component = ({ show }) => {
    return (
      show && (
        <PageWrapper>
          <Page />
        </PageWrapper>
      )
    )
  }

  const name = Page.displayName || Page.name || 'Component'

  Component.displayName = `WithPageWrapper(${name})`

  return Component
}

const PageProvider = ({ pages: initialPages }) => {
  const [pages, setPages] = useState(initialPages)
  const [current, setCurrent] = useState(0)

  const addPage = useCallback(
    (page) => {
      setPages([...pages, page])
    },
    [pages]
  )

  const context = { pages, current, addPage }

  return (
    <PageContext.Provider value={context}>
      <FixedNav>
        {pages.length > 1 &&
          pages.map((page, i) => (
            <PageButton key={i} onClick={() => setCurrent(i)}>
              {page.title}
            </PageButton>
          ))}
      </FixedNav>
      {pages.map((page, i) => {
        const { Component } = page

        const PageWithWrapper = withPageWrapper(Component)

        return <PageWithWrapper key={i} show={i === current} />
      })}
    </PageContext.Provider>
  )
}

export default PageContext
export { PageProvider }
