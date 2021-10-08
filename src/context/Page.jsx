import React, { useState, useCallback, createContext } from 'react'
import styled from 'styled-components'

const initialState = { current: 0, pages: [] }
const PageContext = createContext({ ...initialState })
const PageWrapper = styled.div``

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
      {pages.length > 1 &&
        pages.map((page, i) => (
          <button key={i} onClick={() => setCurrent(i)}>
            {page.title}
          </button>
        ))}
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
