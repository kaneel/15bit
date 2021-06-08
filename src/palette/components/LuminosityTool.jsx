import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import { ArrowReturnLeft, Check2, Sun } from '@styled-icons/bootstrap'

import { convertRGBToHex } from '../../helpers'
import Slider from '../../components/Slider'
import { PaletteSelector } from './Palette'
import { PrimaryButton, SecondaryButton } from '../../components/Button'
import ModalContext, { ModalHeader, ModalContentWrapper, ModalActions } from '../../context/Modal'

const ModalSubheader = styled.h2`
  text-align: left;
`

const LuminosityToolContentForm = styled.form`
  position: absolute;
  width :1040px;
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

const applyLuminosity = (selected, value) => ({ r, g, b, hex }, i) => {
  if (!selected.includes(i)) return { r, g, b, hex }

  const newColors = { 
    r: Math.max(0, Math.min(31, r + value)),
    g: Math.max(0, Math.min(31, g + value)),
    b: Math.max(0, Math.min(31, b + value)),
  }

  hex = convertRGBToHex(newColors)

  return {
    ...newColors,
    hex
  }
}

const LuminosityToolContent = ({ palette, submitLuminosity }) => {
  const modalContext = useContext(ModalContext)
  const [selected, setSelected] = useState([])
  const [luminosity, setLuminosity] = useState(0)
  const [statePal, setPalette] = useState([...palette])

  const onLuminosityChange = useCallback(({ target: { value } }) => {
    setPalette(palette.map(applyLuminosity(selected, parseInt(value, 10))))
    setLuminosity(parseInt(value, 10))
  }, [statePal, selected, luminosity])

  const onSelect = useCallback((newSelected) => {
    onLuminosityChange({ target: { value: 0 }});
    setSelected(newSelected)
  }, [ onLuminosityChange ])

  return (
    <LuminosityToolContentForm onSubmit={e => { 
      e.preventDefault()
      submitLuminosity(statePal)
      modalContext.closeModal()
    }}>
      <ModalContentWrapper>
        <ModalHeader>Luminosity tool</ModalHeader>
        <ModalSubheader>Choose colours to brighten</ModalSubheader>
        <PaletteSelector onSelect={onSelect} selected={selected} palette={statePal} />
        <Slider label="Luminosity" min={-31} name="luminosity" value={luminosity} onChange={onLuminosityChange} />
        <ModalActions>
          <SecondaryButton type="button" onClick={modalContext.closeModal}><ArrowReturnLeft />Cancel</SecondaryButton>
          <PrimaryButton disabled={selected.length < 1} type="submit"><Check2 />OK</PrimaryButton>
        </ModalActions>
      </ModalContentWrapper>
    </LuminosityToolContentForm>
  )
}

const LuminosityTool = ({ palette, onLuminositySubmit }) => {
  const modalContext = useContext(ModalContext)
  const modalContent = () => (<LuminosityToolContent palette={palette} submitLuminosity={onLuminositySubmit} />)

  return (
    <SecondaryButton small disabled={!(palette.length > 0)} onClick={() => modalContext.openModal(modalContent)}><Sun />Luminosity</SecondaryButton>
  )
}

export default LuminosityTool

