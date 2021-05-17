import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import { ArrowReturnLeft, Check2 } from '@styled-icons/bootstrap'

import { applyGradient } from '../helpers'
import Slider from './Slider'
import { PaletteSelector } from './Palette'
import { PrimaryButton, SecondaryButton } from './Button'
import ModalContext, { ModalHeader, ModalContentWrapper, ModalActions } from '../context/Modal'

const ModalSubheader = styled.h2`
  text-align: left;
`

const GradientToolContentForm = styled.form`
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

const GradientToolContent = ({ palette, onGradientSubmit }) => {
  const modalContext = useContext(ModalContext)
  const [selected, changeSelected] = useState([])
  const [steps, changeSteps] = useState(1)
  const [statePal, changePalette] = useState([...palette])

  const [sel1, sel2] = selected;

  const onStepsChanged = useCallback(({ target: { value } }) => {
    if (selected.length === 2) {
      changePalette(applyGradient(palette, selected, value + 2))
    }

    changeSteps(parseInt(value, 10))
  }, [statePal, selected, sel1, sel2, steps])

  const onSelectionChange = useCallback((newSelected) => {
    if (newSelected.length > 2) return changeSelected(newSelected.slice(0, 2))

    if (newSelected.length === 1)  {
      onStepsChanged({ target: { value: 1 }});
    }
    changeSelected(newSelected)
  }, [selected])

  const areSelectionsValid = Math.abs(selected[0] - selected[1]) === 1

  return (
    <GradientToolContentForm onSubmit={e => { 
      e.preventDefault()
      onGradientSubmit(statePal)
      modalContext.closeModal()
    }}>
      <ModalContentWrapper>
        <ModalHeader>Gradient tool</ModalHeader>
        <ModalSubheader>Choose 2 adjacent colours</ModalSubheader>
        <PaletteSelector onSelect={onSelectionChange} selected={selected} palette={statePal} maxSelection={2} />
        <Slider label="Gradient steps" min={1} max={100} name="gradient-steps" value={steps} onChange={onStepsChanged} />
        <ModalActions>
          <SecondaryButton type="button" onClick={modalContext.closeModal}><ArrowReturnLeft />Cancel</SecondaryButton>
          <PrimaryButton disabled={selected.length < 2 && areSelectionsValid} type="submit"><Check2 />OK</PrimaryButton>
        </ModalActions>
      </ModalContentWrapper>
    </GradientToolContentForm>
  )
}

const GradientTool = ({ enabled, palette, onGradientSubmit }) => {
  const modalContext = useContext(ModalContext)
  const modalContent = () => (<GradientToolContent palette={palette} onGradientSubmit={onGradientSubmit} />)

  return (
    <SecondaryButton small disabled={!enabled} onClick={() => modalContext.openModal(modalContent)}>Gradient</SecondaryButton>
  )
}

export default GradientTool

