import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import { ArrowReturnLeft, Check2, Sun } from '@styled-icons/bootstrap'

import { convertRGBToHex } from '../helpers'
import Slider from './Slider'
import { PaletteSelector } from './Palette'
import { PrimaryButton, SecondaryButton } from './Button'
import ModalContext, { ModalHeader, ModalContentWrapper, ModalActions } from '../context/Modal'

const ModalSubheader = styled.h2`
  text-align: left;
`

function reducer(state, action) {
  switch (action.type) {
    case 'selectColour': {
      const { palette, selected } = state
      const { index, modifiers } = action.payload
      const color = palette[index]

      if (modifiers.includes('Meta')) {
        if (selected.includes(index)) {
          return { ...state, selected: selected.filter(i => i !== index) }
        }
        else {
          return { ...state, selected: [...selected, index] }
        }
      }


      if (modifiers.includes('Shift') && selected.length > 0) {
        const newSelected = (function(array, end) {
          const last = array.pop()
          const newArr = new Array(end > last ? end - last + 1 : last - end + 1)
            .fill(0)
            .map((_, i) => {
              return end > last ? last + i : last - i
            })

          return [...array, ...newArr]
        }([...selected], index))

        return { ...state, selected: newSelected }
      }

      return { ...state, selected: [index] }
    }
    case 'changeLuminosity': {
      return {
        ...state,
        luminosity: action.payload
      }
    }
  }
}

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
  const [selected, changeSelected] = useState([])
  const [luminosity, changeLuminosity] = useState(0)
  const [statePal, changePalette] = useState([...palette])

  const onLuminosityChange = useCallback(({ target: { value } }) => {
    changePalette(palette.map(applyLuminosity(selected, parseInt(value, 10))))
    changeLuminosity(parseInt(value, 10))
  }, [statePal, selected, luminosity])

  const onSelect = useCallback((newSelected) => {
    onLuminosityChange({ target: { value: 0 }});
    changeSelected(newSelected)
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

const LuminosityTool = ({ enabled, palette, onLuminositySubmit }) => {
  const modalContext = useContext(ModalContext)
  const modalContent = () => (<LuminosityToolContent palette={palette} submitLuminosity={onLuminositySubmit} />)

  return (
    <SecondaryButton small disabled={!enabled} onClick={() => modalContext.openModal(modalContent)}><Sun />Luminosity</SecondaryButton>
  )
}

export default LuminosityTool

