import React, { Component, createContext } from 'react'
import styled from 'styled-components'

const initialState = { isOpen: false, content: null }
const ModalContext = createContext({ ...initialState })

const ModalWrapper = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;

  ${(props) =>
    props.isOpen &&
    `
    display: block;
  `}
`

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
`

const ModalContent = styled.div`
  position: relative;
  top: 50%;
  z-index: 2;
`

const ModalHeader = styled.h1`
  margin: 0 0 1em;
  border-bottom: 1px solid;
  text-align: left;
  font-size: 2rem;
`

const ModalActions = styled.div`
  margin: 2em 0 0;
  display: flex;
  justify-content: center;
`

const ModalContentWrapper = styled.div`
  background: #fff;
  border: 2px solid;
  border-radius: 5px;
  padding: 1em;
`

class ModalProvider extends Component {
  state = { ...initialState }

  constructor(props) {
    super(props)

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.onKeyup = this.onKeyup.bind(this)
  }

  openModal(content) {
    document.addEventListener('keyup', this.onKeyup)

    this.setState({
      content,
      isOpen: true,
    })
  }

  closeModal() {
    document.removeEventListener('keyup', this.onKeyup)

    this.setState({
      content: null,
      isOpen: false,
    })
  }

  onKeyup({ key }) {
    if (key !== 'Escape') {
      return
    }

    this.closeModal()
  }

  render() {
    const { children } = this.props
    const { content, isOpen } = this.state

    return (
      <ModalContext.Provider
        value={{
          ...this.state,
          openModal: this.openModal,
          closeModal: this.closeModal,
        }}
      >
        <ModalWrapper isOpen={isOpen}>
          <ModalOverlay onClick={this.closeModal} />
          <ModalContent>{content && content()}</ModalContent>
        </ModalWrapper>
        {children}
      </ModalContext.Provider>
    )
  }
}

export default ModalContext
export { ModalProvider, ModalHeader, ModalActions, ModalContentWrapper }
