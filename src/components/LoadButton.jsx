import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import { ArrowReturnLeft, ArrowBarUp } from '@styled-icons/bootstrap'

import { PrimaryButton, SecondaryButton } from './Button'
import ModalContext, { ModalHeader, ModalContentWrapper, ModalActions } from '../context/Modal'
import { MicroPalette } from './Palette'

const LoadForm = styled.form`
  position: absolute;
  width: 300px;
  margin: 0 auto;
  text-align: center;
  align-items: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  > div {
    align-items: center;
    flex-direction: column;
  }
`

const PaletteList = styled.ul`
  list-style: none;
  overflow-y: scroll;
  margin: 1em 0;
  padding: 0;
  max-height: 500px;

  p {
    margin: 0 0 4px;
    text-align: left;
  }
`

const PaletteButton = styled.button`
  appearance: none;
  width: 100%;
  background: none;
  border: 0;
  cursor: pointer;
`

const PaletteDeleteButton = styled.button`
  position: absolute;
  appearance: none;
  background: #fff;
  border: none;
  top: 0;
  right: 0;
  display: none;
  padding: 4px;
  cursor: pointer;
`

const PaletteItem = styled.li`
  position: relative;
  margin: 1em 0;
  padding: 0;

  &:hover {
    ${PaletteDeleteButton} {
      display: block;
    }
  }
`


const LoadButtonForm = ({ onLoadSubmit }) => {
  const modalContext = useContext(ModalContext)
  const [palettes, changePalettes] = useState(JSON.parse(localStorage.getItem('palettes')||'{}'))

  const onLoad = useCallback((name, palette) => {
    onLoadSubmit(palette)
    modalContext.closeModal()
  }, [palettes])

  const onDelete = useCallback((name) => {
    delete palettes[name]
    let newPalettes = { ...palettes }
    localStorage.setItem('palettes', JSON.stringify(newPalettes))
    changePalettes(newPalettes)
  }, [palettes])

    console.log(palettes)

  return (
    <LoadForm>
      <ModalContentWrapper>
        <ModalHeader>Load</ModalHeader>
        <PaletteList>
          { Object.entries(palettes).map(([name, palette], i) => (
            <PaletteItem key={i}>
              <PaletteButton type="button" onClick={() => onLoad(name, palette)}>
                <p>{name}</p>
                <MicroPalette palette={palette} />
              </PaletteButton>
              <PaletteDeleteButton type="button" onClick={() => onDelete(name)}>X</PaletteDeleteButton>
            </PaletteItem>
          ))}
        </PaletteList>
        <ModalActions>
          <SecondaryButton type="button" onClick={modalContext.closeModal}><ArrowReturnLeft />Cancel</SecondaryButton>
        </ModalActions>
      </ModalContentWrapper>
    </LoadForm>
  )
}

const LoadButton = ({ onLoadSubmit }) => {
  const modalContext = useContext(ModalContext)
  const modalContent = () => (<LoadButtonForm onLoadSubmit={onLoadSubmit} />)

  return <PrimaryButton small type="button" onClick={() => modalContext.openModal(modalContent)}><ArrowBarUp /> Load</PrimaryButton>
}

export default LoadButton

